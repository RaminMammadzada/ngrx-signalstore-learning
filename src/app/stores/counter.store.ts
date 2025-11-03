import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

// Define the state interface
interface CounterState {
  count: number;
  incrementBy: number;
}

// Initial state
const initialState: CounterState = {
  count: 0,
  incrementBy: 1,
};

/**
 * Basic Counter Store demonstrating NgRx SignalStore fundamentals
 * 
 * Key Learning Points:
 * 1. withState() - defines the store's state structure
 * 2. withComputed() - creates derived/computed values from state
 * 3. withMethods() - defines actions that can modify the state
 * 4. patchState() - immutable state updates
 */
export const CounterStore = signalStore(
  { providedIn: 'root' },
  
  // 1. Define the state
  withState(initialState),
  
  // 2. Add computed properties (derived state)
  withComputed((store) => ({
    // Computed signal that depends on count
    doubleCount: computed(() => store.count() * 2),
    
    // Another computed signal showing conditional logic
    isEven: computed(() => store.count() % 2 === 0),
    
    // Formatted display text
    displayText: computed(() => `Count: ${store.count()}`),
  })),
  
  // 3. Define methods (actions) to update state
  withMethods((store) => ({
    // Basic increment action
    increment(): void {
      patchState(store, { count: store.count() + store.incrementBy() });
    },
    
    // Basic decrement action
    decrement(): void {
      patchState(store, { count: store.count() - store.incrementBy() });
    },
    
    // Reset to initial state
    reset(): void {
      patchState(store, { count: 0 });
    },
    
    // Set a specific value
    setCount(newCount: number): void {
      patchState(store, { count: newCount });
    },
    
    // Update the increment step
    setIncrementBy(value: number): void {
      patchState(store, { incrementBy: value });
    },
    
    // Increment by a custom amount
    incrementByAmount(amount: number): void {
      patchState(store, { count: store.count() + amount });
    },
  })),
);

// Type for the store
export type CounterStore = InstanceType<typeof CounterStore>;