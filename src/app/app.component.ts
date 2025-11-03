import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './components/counter.component';
import { UsersComponent } from './components/users.component';
import { ProductsComponent } from './components/products.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CounterComponent, UsersComponent, ProductsComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🚀 NgRx SignalStore Learning Project</h1>
        <p class="subtitle">Learn NgRx SignalStore with comprehensive examples</p>
      </header>
      
      <nav class="navigation">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab.id"
          [class.active]="activeTab === tab.id"
          class="nav-button">
          {{ tab.label }}
        </button>
      </nav>
      
      <main class="main-content">
        <!-- Basic Counter Example -->
        <div *ngIf="activeTab === 'counter'" class="tab-content">
          <app-counter></app-counter>
        </div>
        
        <!-- Advanced Users Example -->
        <div *ngIf="activeTab === 'users'" class="tab-content">
          <app-users></app-users>
        </div>
        
        <!-- Custom Features Example -->
        <div *ngIf="activeTab === 'products'" class="tab-content">
          <app-products></app-products>
        </div>
        
        <!-- Learning Guide -->
        <div *ngIf="activeTab === 'guide'" class="tab-content">
          <div class="learning-guide">
            <h2>NgRx SignalStore Learning Guide</h2>
            
            <section class="guide-section">
              <h3>🎯 What is NgRx SignalStore?</h3>
              <p>
                NgRx SignalStore is a lightweight, signal-based state management solution for Angular applications.
                It leverages Angular's signals for reactive state management with a simpler API compared to traditional NgRx Store.
              </p>
            </section>
            
            <section class="guide-section">
              <h3>📚 Core Concepts</h3>
              <ul>
                <li><strong>signalStore():</strong> Creates a signal-based store</li>
                <li><strong>withState():</strong> Defines the initial state structure</li>
                <li><strong>withComputed():</strong> Creates derived state (computed values)</li>
                <li><strong>withMethods():</strong> Defines actions to update state</li>
                <li><strong>patchState():</strong> Updates state immutably</li>
                <li><strong>rxMethod():</strong> Handles async operations with RxJS</li>
              </ul>
            </section>
            
            <section class="guide-section">
              <h3>🔄 Learning Path</h3>
              <ol>
                <li><strong>Counter Example:</strong> Basic store setup and state management</li>
                <li><strong>Users Example:</strong> HTTP integration and async operations</li>
                <li><strong>Products Example:</strong> Custom features and complex state management</li>
              </ol>
            </section>
            
            <section class="guide-section">
              <h3>✨ Key Benefits</h3>
              <ul>
                <li><strong>Simplicity:</strong> Less boilerplate than traditional NgRx</li>
                <li><strong>Performance:</strong> Fine-grained reactivity with signals</li>
                <li><strong>Type Safety:</strong> Full TypeScript support</li>
                <li><strong>Composability:</strong> Reusable store features</li>
                <li><strong>Integration:</strong> Seamless Angular integration</li>
              </ul>
            </section>
            
            <section class="guide-section">
              <h3>🛠️ Best Practices</h3>
              <ul>
                <li>Keep stores focused on specific domains</li>
                <li>Use computed properties for derived state</li>
                <li>Handle async operations with rxMethod()</li>
                <li>Create reusable features for common patterns</li>
                <li>Use patchState() for immutable updates</li>
                <li>Provide stores at appropriate levels</li>
              </ul>
            </section>
            
            <section class="guide-section">
              <h3>📖 Additional Resources</h3>
              <ul>
                <li><a href="https://ngrx.io/guide/signals" target="_blank">Official NgRx Signals Documentation</a></li>
                <li><a href="https://angular.io/guide/signals" target="_blank">Angular Signals Guide</a></li>
                <li><a href="https://github.com/ngrx/platform" target="_blank">NgRx GitHub Repository</a></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <footer class="app-footer">
        <p>Built with Angular {{ angularVersion }} and NgRx SignalStore</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }
    
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 2.5em;
      font-weight: 300;
    }
    
    .subtitle {
      margin: 10px 0 0 0;
      font-size: 1.2em;
      opacity: 0.9;
    }
    
    .navigation {
      background: white;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      overflow-x: auto;
    }
    
    .nav-button {
      padding: 15px 25px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      transition: all 0.2s ease;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
    }
    
    .nav-button:hover {
      background: #f8f9fa;
      color: #333;
    }
    
    .nav-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
      background: #f8f9fa;
    }
    
    .main-content {
      flex: 1;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    
    .tab-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .learning-guide {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .learning-guide h2 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .guide-section {
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .guide-section h3 {
      margin: 0 0 15px 0;
      color: #333;
    }
    
    .guide-section p, .guide-section li {
      line-height: 1.6;
      color: #555;
    }
    
    .guide-section ul, .guide-section ol {
      padding-left: 20px;
    }
    
    .guide-section li {
      margin: 8px 0;
    }
    
    .guide-section a {
      color: #667eea;
      text-decoration: none;
    }
    
    .guide-section a:hover {
      text-decoration: underline;
    }
    
    .app-footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: auto;
    }
    
    .app-footer p {
      margin: 0;
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 2em;
      }
      
      .subtitle {
        font-size: 1em;
      }
      
      .main-content {
        padding: 10px;
      }
      
      .learning-guide {
        padding: 20px;
      }
    }
  `]
})
export class AppComponent {
  activeTab = 'counter';
  angularVersion = '19+';
  
  tabs = [
    { id: 'counter', label: '🔢 Basic Counter' },
    { id: 'users', label: '👥 Advanced Users' },
    { id: 'products', label: '🛍️ Custom Features' },
    { id: 'guide', label: '📖 Learning Guide' }
  ];
}
