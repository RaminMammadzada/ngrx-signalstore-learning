import { Component, inject, OnInit } from '@angular/core';
import { ProductsStore } from '../stores/custom-features.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-container">
      <h2>Custom Store Features Example</h2>
      <p class="description">
        This demonstrates NgRx SignalStore with custom reusable features including loading states, 
        pagination, and error handling.
      </p>
      
      <!-- Status Bar -->
      <div class="status-bar">
        <div *ngIf="productsStore.isLoading()" class="loading">
          🔄 Loading...
        </div>
        
        <div *ngIf="productsStore.hasError()" class="error">
          ❌ {{ productsStore.errorMessage() }}
          <button (click)="productsStore.clearError()" class="btn btn-sm">Clear</button>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <button 
          (click)="productsStore.loadProducts()" 
          [disabled]="productsStore.isLoading()"
          class="btn btn-primary">
          Simulate Load
        </button>
        
        <button 
          (click)="simulateError()" 
          [disabled]="productsStore.isLoading()"
          class="btn btn-warning">
          Simulate Error
        </button>
      </div>
      
      <!-- Category Filter -->
      <div class="filter-section">
        <h3>Category Filter</h3>
        <div class="filter-controls">
          <select 
            [(ngModel)]="selectedCategory" 
            (change)="onCategoryChange()"
            class="category-select">
            <option value="">All Categories</option>
            <option *ngFor="let category of productsStore.categories()" [value]="category">
              {{ category }}
            </option>
          </select>
          <button (click)="clearCategoryFilter()" class="btn btn-sm">Clear Filter</button>
        </div>
      </div>
      
      <!-- Statistics -->
      <div class="stats-section">
        <h3>Statistics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>{{ productsStore.filteredProducts().length }}</h4>
            <p>Total Products</p>
          </div>
          <div class="stat-card">
            <h4>{{ productsStore.inStockCount() }}</h4>
            <p>In Stock</p>
          </div>
          <div class="stat-card">
            <h4>{{ productsStore.outOfStockCount() }}</h4>
            <p>Out of Stock</p>
          </div>
          <div class="stat-card">
            <h4>\${{ productsStore.averagePrice() }}</h4>
            <p>Average Price</p>
          </div>
        </div>
      </div>
      
      <!-- Add Product Form -->
      <div class="add-product-section">
        <h3>Add New Product</h3>
        <div class="add-product-form">
          <input 
            type="text" 
            [(ngModel)]="newProduct.name"
            placeholder="Product Name"
            class="form-input"
          >
          <select 
            [(ngModel)]="newProduct.category"
            class="form-input">
            <option value="">Select Category</option>
            <option *ngFor="let category of productsStore.categories()" [value]="category">
              {{ category }}
            </option>
            <option value="other">Other</option>
          </select>
          <input 
            type="number" 
            [(ngModel)]="newProduct.price"
            placeholder="Price"
            min="0"
            step="0.01"
            class="form-input"
          >
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              [(ngModel)]="newProduct.inStock"
            >
            In Stock
          </label>
          <button 
            (click)="addProduct()" 
            [disabled]="!canAddProduct()"
            class="btn btn-success">
            Add Product
          </button>
        </div>
      </div>
      
      <!-- Pagination Controls -->
      <div class="pagination-section" *ngIf="productsStore.filteredProducts().length > 0">
        <div class="pagination-info">
          Page {{ productsStore.page() }} of {{ productsStore.totalPages() }}
          ({{ productsStore.startIndex() + 1 }} - {{ productsStore.endIndex() }} of {{ productsStore.total() }})
        </div>
        
        <div class="pagination-controls">
          <button 
            (click)="productsStore.previousPage()" 
            [disabled]="!productsStore.hasPreviousPage()"
            class="btn btn-secondary">
            ← Previous
          </button>
          
          <span class="page-numbers">
            <button 
              *ngFor="let page of getPageNumbers()" 
              (click)="productsStore.setPage(page)"
              [class.active]="page === productsStore.page()"
              class="btn btn-page">
              {{ page }}
            </button>
          </span>
          
          <button 
            (click)="productsStore.nextPage()" 
            [disabled]="!productsStore.hasNextPage()"
            class="btn btn-secondary">
            Next →
          </button>
        </div>
        
        <div class="page-size-controls">
          <label>Items per page:</label>
          <select 
            [(ngModel)]="pageSize" 
            (change)="onPageSizeChange()"
            class="page-size-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div class="products-section">
        <h3>Products ({{ productsStore.paginatedProducts().length }} showing)</h3>
        
        <div *ngIf="productsStore.paginatedProducts().length === 0" class="no-products">
          No products found.
        </div>
        
        <div class="products-grid" *ngIf="productsStore.paginatedProducts().length > 0">
          <div 
            *ngFor="let product of productsStore.paginatedProducts()" 
            class="product-card"
            [class.selected]="productsStore.selectedProductId() === product.id"
            [class.out-of-stock]="!product.inStock"
            (click)="selectProduct(product.id)">
            
            <div class="product-header">
              <h4>{{ product.name }}</h4>
              <span class="category-badge">{{ product.category }}</span>
            </div>
            
            <div class="product-details">
              <p class="price">\${{ product.price }}</p>
              <p class="stock-status" [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </p>
            </div>
            
            <div class="product-actions">
              <button 
                (click)="toggleStock(product.id); $event.stopPropagation()"
                class="btn btn-sm btn-info">
                {{ product.inStock ? 'Mark Out' : 'Mark In' }}
              </button>
              <button 
                (click)="removeProduct(product.id); $event.stopPropagation()"
                class="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Selected Product Details -->
      <div class="selected-section" *ngIf="productsStore.selectedProduct()">
        <h3>Selected Product</h3>
        <div class="selected-product">
          <h4>{{ productsStore.selectedProduct()?.name }}</h4>
          <p><strong>ID:</strong> {{ productsStore.selectedProduct()?.id }}</p>
          <p><strong>Category:</strong> {{ productsStore.selectedProduct()?.category }}</p>
          <p><strong>Price:</strong> \${{ productsStore.selectedProduct()?.price }}</p>
          <p><strong>Status:</strong> {{ productsStore.selectedProduct()?.inStock ? 'In Stock' : 'Out of Stock' }}</p>
          
          <button (click)="productsStore.clearSelection()" class="btn btn-secondary">
            Clear Selection
          </button>
        </div>
      </div>
      
      <!-- Learning Notes -->
      <div class="learning-notes">
        <h3>🎓 Custom Features Learning Points:</h3>
        <ul>
          <li><strong>Reusable Features:</strong> withLoadingState(), withErrorState(), withPagination()</li>
          <li><strong>Feature Composition:</strong> Multiple features combined in one store</li>
          <li><strong>Computed Dependencies:</strong> Multiple withComputed() calls for dependent calculations</li>
          <li><strong>State Management:</strong> Complex state with filtering, selection, and pagination</li>
          <li><strong>Error Handling:</strong> Built-in error state management and recovery</li>
          <li><strong>Pagination:</strong> Full pagination with page size control and navigation</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
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
    
    .controls, .filter-section, .add-product-section, .pagination-section, .products-section, .selected-section {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .filter-controls, .add-product-form, .pagination-controls {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .stats-section {
      margin: 20px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 15px 0;
    }
    
    .stat-card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stat-card h4 {
      margin: 0;
      font-size: 24px;
      color: #007bff;
    }
    
    .stat-card p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }
    
    .category-select, .form-input, .page-size-select {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .pagination-info {
      text-align: center;
      margin: 10px 0;
      color: #666;
    }
    
    .page-numbers {
      display: flex;
      gap: 5px;
    }
    
    .btn-page {
      padding: 4px 8px;
      min-width: 32px;
    }
    
    .btn-page.active {
      background: #007bff;
      color: white;
    }
    
    .page-size-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }
    
    .no-products {
      text-align: center;
      color: #666;
      padding: 40px;
      background: white;
      border-radius: 8px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    
    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }
    
    .product-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    
    .product-card.selected {
      border-color: #007bff;
      background: #e3f2fd;
    }
    
    .product-card.out-of-stock {
      opacity: 0.7;
    }
    
    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    
    .product-header h4 {
      margin: 0;
      color: #333;
    }
    
    .category-badge {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    }
    
    .product-details {
      margin: 10px 0;
    }
    
    .price {
      font-size: 18px;
      font-weight: bold;
      color: #28a745;
      margin: 5px 0;
    }
    
    .stock-status {
      margin: 5px 0;
      font-size: 14px;
    }
    
    .stock-status.in-stock {
      color: #28a745;
    }
    
    .stock-status.out-of-stock {
      color: #dc3545;
    }
    
    .product-actions {
      display: flex;
      gap: 5px;
      margin-top: 10px;
    }
    
    .selected-product {
      background: white;
      padding: 15px;
      border-radius: 8px;
    }
    
    .selected-product h4 {
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
    .btn-warning { background: #ffc107; color: black; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; margin: 2px; }
    
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
  `]
})
export class ProductsComponent implements OnInit {
  productsStore = inject(ProductsStore);
  
  selectedCategory = '';
  pageSize = 3;
  newProduct = {
    name: '',
    category: '',
    price: 0,
    inStock: true
  };
  
  ngOnInit(): void {
    // Initialize pagination
    this.productsStore.setTotal(this.productsStore.filteredProducts().length);
  }
  
  onCategoryChange(): void {
    this.productsStore.setCategoryFilter(this.selectedCategory);
  }
  
  clearCategoryFilter(): void {
    this.selectedCategory = '';
    this.productsStore.clearCategoryFilter();
  }
  
  onPageSizeChange(): void {
    this.productsStore.setPageSize(Number(this.pageSize));
  }
  
  getPageNumbers(): number[] {
    const totalPages = this.productsStore.totalPages();
    const currentPage = this.productsStore.page();
    const pages: number[] = [];
    
    // Show up to 5 page numbers around current page
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  selectProduct(productId: number): void {
    if (this.productsStore.selectedProductId() === productId) {
      this.productsStore.clearSelection();
    } else {
      this.productsStore.selectProduct(productId);
    }
  }
  
  toggleStock(productId: number): void {
    this.productsStore.toggleStock(productId);
  }
  
  removeProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsStore.removeProduct(productId);
    }
  }
  
  addProduct(): void {
    if (this.canAddProduct()) {
      this.productsStore.addProduct({ ...this.newProduct });
      this.resetForm();
    }
  }
  
  canAddProduct(): boolean {
    return this.newProduct.name.trim() !== '' && 
           this.newProduct.category.trim() !== '' &&
           this.newProduct.price > 0;
  }
  
  simulateError(): void {
    this.productsStore.simulateOperation({ delayMs: 1000, shouldFail: true });
  }
  
  private resetForm(): void {
    this.newProduct = {
      name: '',
      category: '',
      price: 0,
      inStock: true
    };
  }
}