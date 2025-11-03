import { Component, inject } from '@angular/core';
import { CounterStore } from '../stores/counter.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="counter-container">
      <h2>Basic Counter Example</h2>
      <p class="description">
        This demonstrates basic NgRx SignalStore usage with simple state management.
      </p>
      
      <!-- Display current state -->
      <div class="state-display">
        <h3>Current State:</h3>
        <p><strong>Count:</strong> {{ counterStore.count() }}</p>
        <p><strong>Double Count:</strong> {{ counterStore.doubleCount() }}</p>
        <p><strong>Is Even:</strong> {{ counterStore.isEven() ? 'Yes' : 'No' }}</p>
        <p><strong>Display Text:</strong> {{ counterStore.displayText() }}</p>
        <p><strong>Increment By:</strong> {{ counterStore.incrementBy() }}</p>
      </div>
      
      <!-- Basic actions -->
      <div class="actions">
        <h3>Basic Actions:</h3>
        <button (click)="counterStore.increment()" class="btn btn-primary">
          Increment (+{{ counterStore.incrementBy() }})
        </button>
        <button (click)="counterStore.decrement()" class="btn btn-secondary">
          Decrement (-{{ counterStore.incrementBy() }})
        </button>
        <button (click)="counterStore.reset()" class="btn btn-warning">
          Reset
        </button>
      </div>
      
      <!-- Advanced actions -->
      <div class="actions">
        <h3>Advanced Actions:</h3>
        <div class="input-group">
          <label for="setCount">Set Count:</label>
          <input 
            id="setCount"
            type="number" 
            [(ngModel)]="newCount" 
            placeholder="Enter count"
          >
          <button (click)="setCount()" class="btn btn-info">Set</button>
        </div>
        
        <div class="input-group">
          <label for="incrementBy">Increment By:</label>
          <input 
            id="incrementBy"
            type="number" 
            [(ngModel)]="incrementStep" 
            placeholder="Increment step"
          >
          <button (click)="updateIncrementBy()" class="btn btn-info">Update Step</button>
        </div>
        
        <div class="input-group">
          <label for="customIncrement">Custom Increment:</label>
          <input 
            id="customIncrement"
            type="number" 
            [(ngModel)]="customAmount" 
            placeholder="Amount"
          >
          <button (click)="incrementByCustom()" class="btn btn-success">Add</button>
        </div>
      </div>
      
      <!-- Learning notes -->
      <div class="learning-notes">
        <h3>🎓 Learning Notes:</h3>
        <ul>
          <li><strong>Signal Access:</strong> Use <code>store.property()</code> to read signals</li>
          <li><strong>Reactivity:</strong> The UI automatically updates when store signals change</li>
          <li><strong>Computed Signals:</strong> <code>doubleCount</code> and <code>isEven</code> are automatically recalculated</li>
          <li><strong>State Updates:</strong> Use <code>patchState()</code> for immutable updates</li>
          <li><strong>Type Safety:</strong> Full TypeScript support with proper typing</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .counter-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    
    .description {
      color: #666;
      font-style: italic;
      margin-bottom: 20px;
    }
    
    .state-display {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .state-display p {
      margin: 5px 0;
    }
    
    .actions {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .actions h3 {
      margin-top: 0;
      color: #333;
    }
    
    .btn {
      padding: 8px 16px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-warning { background: #ffc107; color: black; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-success { background: #28a745; color: white; }
    
    .btn:hover {
      opacity: 0.8;
    }
    
    .input-group {
      display: flex;
      align-items: center;
      margin: 10px 0;
      gap: 10px;
    }
    
    .input-group label {
      min-width: 120px;
      font-weight: bold;
    }
    
    .input-group input {
      padding: 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100px;
    }
    
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
    
    .learning-notes ul {
      margin: 10px 0;
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
export class CounterComponent {
  // Inject the store
  counterStore = inject(CounterStore);
  
  // Component properties for form inputs
  newCount: number = 0;
  incrementStep: number = 1;
  customAmount: number = 5;
  
  setCount(): void {
    this.counterStore.setCount(this.newCount);
  }
  
  updateIncrementBy(): void {
    this.counterStore.setIncrementBy(this.incrementStep);
  }
  
  incrementByCustom(): void {
    this.counterStore.incrementByAmount(this.customAmount);
  }
}