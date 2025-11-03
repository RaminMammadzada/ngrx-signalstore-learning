import { Component, inject } from '@angular/core';
import { UsersStore } from '../stores/users.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <h2>Advanced Users Store Example</h2>
      <p class="description">
        This demonstrates NgRx SignalStore with async operations, HTTP integration, and advanced state management.
      </p>
      
      <!-- Loading and error states -->
      <div class="status-bar">
        <div *ngIf="usersStore.isLoading()" class="loading">
          🔄 Loading...
        </div>
        
        <div *ngIf="usersStore.hasError()" class="error">
          ❌ {{ usersStore.error() }}
          <button (click)="usersStore.clearError()" class="btn btn-sm">Clear</button>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <button 
          (click)="usersStore.loadUsers()" 
          [disabled]="usersStore.isLoading()"
          class="btn btn-primary">
          Load Users
        </button>
        
        <button 
          (click)="usersStore.reset()" 
          class="btn btn-secondary">
          Reset Store
        </button>
      </div>
      
      <!-- Search -->
      <div class="search-section" *ngIf="usersStore.hasUsers()">
        <h3>Search Users</h3>
        <div class="search-controls">
          <select [(ngModel)]="searchField" class="search-field-select">
            <option value="all">All Fields</option>
            <option value="name">Name Only</option>
            <option value="email">Email Only</option>
            <option value="phone">Phone Only</option>
            <option value="website">Website Only</option>
          </select>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            [placeholder]="getSearchPlaceholder()"
            class="search-input"
          >
          <button (click)="clearSearch()" class="btn btn-sm">Clear</button>
        </div>
        <p class="search-info">
          Showing {{ usersStore.filteredCount() }} of {{ usersStore.usersCount() }} users
          <span *ngIf="searchTerm && searchField !== 'all'"> (searching in {{ searchField }})</span>
        </p>
      </div>
      
      <!-- Add User Form -->
      <div class="add-user-section">
        <h3>Add New User</h3>
        <div class="add-user-form">
          <input 
            type="text" 
            [(ngModel)]="newUser.name"
            placeholder="Name"
            class="form-input"
          >
          <input 
            type="email" 
            [(ngModel)]="newUser.email"
            placeholder="Email"
            class="form-input"
          >
          <input 
            type="text" 
            [(ngModel)]="newUser.phone"
            placeholder="Phone"
            class="form-input"
          >
          <input 
            type="text" 
            [(ngModel)]="newUser.website"
            placeholder="Website"
            class="form-input"
          >
          <button 
            (click)="addUser()" 
            [disabled]="!canAddUser() || usersStore.isLoading()"
            class="btn btn-success">
            Add User
          </button>
        </div>
      </div>
      
      <!-- Users List -->
      <div class="users-list" *ngIf="usersStore.hasUsers()">
        <h3>Users List</h3>
        <div class="users-grid">
          <div 
            *ngFor="let user of usersStore.filteredUsers()" 
            class="user-card"
            [class.selected]="usersStore.selectedUserId() === user.id"
            (click)="selectUser(user.id)">
            
            <div class="user-info">
              <h4>{{ user.name }}</h4>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Phone:</strong> {{ user.phone }}</p>
              <p><strong>Website:</strong> {{ user.website }}</p>
            </div>
            
            <div class="user-actions">
              <button 
                (click)="deleteUser(user.id); $event.stopPropagation()"
                [disabled]="usersStore.isLoading()"
                class="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Selected User Details -->
      <div class="selected-user" *ngIf="usersStore.selectedUser()">
        <h3>Selected User Details</h3>
        <div class="user-details">
          <h4>{{ usersStore.selectedUser()?.name }}</h4>
          <p><strong>ID:</strong> {{ usersStore.selectedUser()?.id }}</p>
          <p><strong>Email:</strong> {{ usersStore.selectedUser()?.email }}</p>
          <p><strong>Phone:</strong> {{ usersStore.selectedUser()?.phone }}</p>
          <p><strong>Website:</strong> {{ usersStore.selectedUser()?.website }}</p>
          
          <button (click)="usersStore.clearSelection()" class="btn btn-secondary">
            Clear Selection
          </button>
        </div>
      </div>
      
      <!-- Learning Notes -->
      <div class="learning-notes">
        <h3>🎓 Advanced Learning Points:</h3>
        <ul>
          <li><strong>rxMethod():</strong> Handles async operations with RxJS integration</li>
          <li><strong>HTTP Integration:</strong> Direct HttpClient injection and usage</li>
          <li><strong>Loading States:</strong> Proper loading/error state management</li>
          <li><strong>Computed Chains:</strong> Multiple withComputed() calls for dependent computations</li>
          <li><strong>Side Effects:</strong> Handling API calls, delays, and error recovery</li>
          <li><strong>State Normalization:</strong> Managing selected items and filtering</li>
          <li><strong>Error Handling:</strong> Comprehensive error management with user feedback</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    
    .description {
      color: #666;
      font-style: italic;
      margin-bottom: 20px;
    }
    
    .status-bar {
      min-height: 40px;
      margin: 10px 0;
    }
    
    .loading {
      color: #007bff;
      font-weight: bold;
    }
    
    .error {
      color: #dc3545;
      background: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
    
    .controls {
      margin: 20px 0;
    }
    
    .search-section, .add-user-section {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .search-controls {
      display: flex;
      gap: 10px;
      align-items: center;
      margin: 10px 0;
    }
    
    .search-field-select {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      min-width: 120px;
    }
    
    .search-input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .search-info {
      color: #666;
      font-size: 14px;
    }
    
    .add-user-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      align-items: center;
    }
    
    .form-input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    
    .user-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .user-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    
    .user-card.selected {
      border-color: #007bff;
      background: #e3f2fd;
    }
    
    .user-info h4 {
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .user-info p {
      margin: 5px 0;
      font-size: 14px;
      color: #666;
    }
    
    .user-actions {
      margin-top: 10px;
      text-align: right;
    }
    
    .selected-user {
      background: #e8f5e8;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .user-details h4 {
      margin: 0 0 10px 0;
      color: #2c5530;
    }
    
    .btn {
      padding: 8px 16px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    
    .learning-notes {
      background: #e8f4f8;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .learning-notes h3 {
      margin-top: 0;
      color: #0c5460;
    }
    
    .learning-notes li {
      margin: 8px 0;
    }
    
    .learning-notes code {
      background: #f8f9fa;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
  `]
})
export class UsersComponent {
  usersStore = inject(UsersStore);
  
  searchTerm = '';
  searchField = 'all'; // New property for search field selection
  newUser = {
    name: '',
    email: '',
    phone: '',
    website: ''
  };
  
  onSearchChange(): void {
    // Pass both search term and field to store
    this.usersStore.searchUsers(this.searchTerm, this.searchField);
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.searchField = 'all';
    this.usersStore.clearSearch();
  }
  
  getSearchPlaceholder(): string {
    switch (this.searchField) {
      case 'name': return 'Search by name...';
      case 'email': return 'Search by email...';
      case 'phone': return 'Search by phone...';
      case 'website': return 'Search by website...';
      default: return 'Search by name, email, phone, or website...';
    }
  }
  
  selectUser(userId: number): void {
    if (this.usersStore.selectedUserId() === userId) {
      this.usersStore.clearSelection();
    } else {
      this.usersStore.selectUser(userId);
    }
  }
  
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersStore.deleteUser(userId);
    }
  }
  
  addUser(): void {
    if (this.canAddUser()) {
      this.usersStore.addUser({ ...this.newUser });
      this.resetForm();
    }
  }
  
  canAddUser(): boolean {
    return this.newUser.name.trim() !== '' && 
           this.newUser.email.trim() !== '' &&
           this.newUser.phone.trim() !== '' &&
           this.newUser.website.trim() !== '';
  }
  
  private resetForm(): void {
    this.newUser = {
      name: '',
      email: '',
      phone: '',
      website: ''
    };
  }
}