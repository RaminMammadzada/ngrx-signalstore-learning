import { inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, map, catchError, of, delay, tap } from 'rxjs';

// Define interfaces
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUserId: number | null;
  searchTerm: string;
  searchField: string;
}

// Initial state
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUserId: null,
  searchTerm: '',
  searchField: 'all',
};

/**
 * Advanced Users Store demonstrating NgRx SignalStore with async operations
 * 
 * Key Learning Points:
 * 1. HTTP service integration with HttpClient
 * 2. rxMethod() for handling async operations
 * 3. Loading and error state management
 * 4. Complex computed properties with filtering
 * 5. State normalization patterns
 * 6. Side effects and error handling
 */
export const UsersStore = signalStore(
  { providedIn: 'root' },
  
  // 1. Define the state
  withState(initialState),
  
  // 2. Add computed properties
  withComputed((store) => ({
    // Filter users based on search term and field
    filteredUsers: computed(() => {
      const users = store.users();
      const searchTerm = store.searchTerm().toLowerCase();
      const searchField = store.searchField();
      
      if (!searchTerm) return users;
      
      return users.filter(user => {
        switch (searchField) {
          case 'name':
            return user.name.toLowerCase().includes(searchTerm);
          case 'email':
            return user.email.toLowerCase().includes(searchTerm);
          case 'phone':
            return user.phone.toLowerCase().includes(searchTerm);
          case 'website':
            return user.website.toLowerCase().includes(searchTerm);
          case 'all':
          default:
            return user.name.toLowerCase().includes(searchTerm) ||
                   user.email.toLowerCase().includes(searchTerm) ||
                   user.phone.toLowerCase().includes(searchTerm) ||
                   user.website.toLowerCase().includes(searchTerm);
        }
      });
    }),
    
    // Get selected user
    selectedUser: computed(() => {
      const users = store.users();
      const selectedId = store.selectedUserId();
      return users.find(user => user.id === selectedId) || null;
    }),
    
    // Get users count
    usersCount: computed(() => store.users().length),
    
    // Check if there are any users
    hasUsers: computed(() => store.users().length > 0),
    
    // Check if currently loading
    isLoading: computed(() => store.loading()),
    
    // Check if there's an error
    hasError: computed(() => store.error() !== null),
  })),
  
  // 3. Add filtered count as a separate computed section
  withComputed((store) => ({
    // Get filtered count (depends on filteredUsers from previous computed)
    filteredCount: computed(() => store.filteredUsers().length),
  })),
  
  // 3. Define methods and effects
  withMethods((store, httpClient = inject(HttpClient)) => ({
    // Load users with rxMethod for async handling
    loadUsers: rxMethod<void>(
      pipe(
        // Set loading state
        tap(() => patchState(store, { loading: true, error: null })),
        
        // Switch to HTTP request
        switchMap(() =>
          httpClient.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
            // Add artificial delay to demonstrate loading state
            delay(1000),
            
            // Success case
            map((users) => ({ users, error: null })),
            
            // Error handling
            catchError((error) => {
              console.error('Error loading users:', error);
              return of({ 
                users: [] as User[], 
                error: 'Failed to load users. Please try again.' 
              });
            })
          )
        ),
        
        // Update state with result
        tap(({ users, error }) => {
          patchState(store, { 
            users, 
            error, 
            loading: false 
          });
        })
      )
    ),
    
    // Search users with optional field specification
    searchUsers(searchTerm: string, searchField: string = 'all'): void {
      patchState(store, { searchTerm, searchField });
    },
    
    // Clear search
    clearSearch(): void {
      patchState(store, { searchTerm: '', searchField: 'all' });
    },
    
    // Select a user
    selectUser(userId: number): void {
      patchState(store, { selectedUserId: userId });
    },
    
    // Clear selection
    clearSelection(): void {
      patchState(store, { selectedUserId: null });
    },
    
    // Add a new user (simulated)
    addUser: rxMethod<Omit<User, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        
        switchMap((newUser) =>
          httpClient.post<User>('https://jsonplaceholder.typicode.com/users', newUser).pipe(
            delay(800),
            
            map((createdUser) => {
              // Simulate ID assignment
              const userWithId = { ...createdUser, id: Date.now() };
              return userWithId;
            }),
            
            catchError((error) => {
              console.error('Error adding user:', error);
              patchState(store, { 
                error: 'Failed to add user. Please try again.',
                loading: false 
              });
              return of(null);
            })
          )
        ),
        
        tap((newUser) => {
          if (newUser) {
            const currentUsers = store.users();
            patchState(store, { 
              users: [...currentUsers, newUser],
              loading: false,
              error: null
            });
          }
        })
      )
    ),
    
    // Delete a user (simulated)
    deleteUser: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        
        switchMap((userId) =>
          httpClient.delete(`https://jsonplaceholder.typicode.com/users/${userId}`).pipe(
            delay(500),
            
            map(() => userId),
            
            catchError((error) => {
              console.error('Error deleting user:', error);
              patchState(store, { 
                error: 'Failed to delete user. Please try again.',
                loading: false 
              });
              return of(null);
            })
          )
        ),
        
        tap((deletedUserId) => {
          if (deletedUserId) {
            const currentUsers = store.users();
            const updatedUsers = currentUsers.filter(user => user.id !== deletedUserId);
            patchState(store, { 
              users: updatedUsers,
              loading: false,
              error: null,
              // Clear selection if deleted user was selected
              selectedUserId: store.selectedUserId() === deletedUserId ? null : store.selectedUserId()
            });
          }
        })
      )
    ),
    
    // Clear error
    clearError(): void {
      patchState(store, { error: null });
    },
    
    // Reset store to initial state
    reset(): void {
      patchState(store, initialState);
    },
  }))
);

// Type for the store
export type UsersStore = InstanceType<typeof UsersStore>;