import { computed } from '@angular/core';
import { patchState, signalStore, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

/**
 * Custom Store Features - Reusable Store Extensions
 * 
 * This demonstrates how to create reusable store features that can be
 * composed into different stores. Features encapsulate common patterns
 * like loading states, pagination, sorting, etc.
 */

// 1. Loading State Feature
export interface LoadingState {
  loading: boolean;
}

export function withLoadingState() {
  return signalStoreFeature(
    withState<LoadingState>({ loading: false }),
    withComputed((store) => ({
      isLoading: computed(() => store.loading()),
    })),
    withMethods((store) => ({
      setLoading(loading: boolean): void {
        patchState(store, { loading });
      },
    }))
  );
}

// 2. Error State Feature
export interface ErrorState {
  error: string | null;
}

export function withErrorState() {
  return signalStoreFeature(
    withState<ErrorState>({ error: null }),
    withComputed((store) => ({
      hasError: computed(() => store.error() !== null),
      errorMessage: computed(() => store.error()),
    })),
    withMethods((store) => ({
      setError(error: string | null): void {
        patchState(store, { error });
      },
      clearError(): void {
        patchState(store, { error: null });
      },
    }))
  );
}

// 3. Pagination Feature
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function withPagination(initialPageSize: number = 10) {
  return signalStoreFeature(
    withState<PaginationState>({ 
      page: 1, 
      pageSize: initialPageSize, 
      total: 0 
    }),
    withComputed((store) => ({
      totalPages: computed(() => Math.ceil(store.total() / store.pageSize())),
      hasNextPage: computed(() => store.page() < Math.ceil(store.total() / store.pageSize())),
      hasPreviousPage: computed(() => store.page() > 1),
      startIndex: computed(() => (store.page() - 1) * store.pageSize()),
      endIndex: computed(() => Math.min(store.page() * store.pageSize(), store.total())),
      paginationInfo: computed(() => ({
        page: store.page(),
        pageSize: store.pageSize(),
        total: store.total(),
        totalPages: Math.ceil(store.total() / store.pageSize()),
        startIndex: (store.page() - 1) * store.pageSize(),
        endIndex: Math.min(store.page() * store.pageSize(), store.total())
      }))
    })),
    withMethods((store) => ({
      setPage(page: number): void {
        patchState(store, { page });
      },
      nextPage(): void {
        const totalPages = Math.ceil(store.total() / store.pageSize());
        if (store.page() < totalPages) {
          patchState(store, { page: store.page() + 1 });
        }
      },
      previousPage(): void {
        if (store.page() > 1) {
          patchState(store, { page: store.page() - 1 });
        }
      },
      setPageSize(pageSize: number): void {
        patchState(store, { pageSize, page: 1 });
      },
      setTotal(total: number): void {
        patchState(store, { total });
      },
      resetPagination(): void {
        patchState(store, { page: 1, total: 0 });
      }
    }))
  );
}

// 4. Simple Async Operations Feature
export function withAsyncOperations() {
  return signalStoreFeature(
    withLoadingState(),
    withErrorState(),
    withMethods((store) => ({
      // Simulated async operation
      simulateOperation: rxMethod<{ delayMs: number; shouldFail?: boolean }>(
        pipe(
          tap(() => {
            store.setLoading(true);
            store.clearError();
          }),
          switchMap(({ delayMs, shouldFail = false }) => {
            // Simple timeout simulation
            const promise = new Promise<{ success: boolean }>((resolve, reject) => {
              setTimeout(() => {
                if (shouldFail) {
                  reject(new Error('Simulated operation failed'));
                } else {
                  resolve({ success: true });
                }
              }, delayMs);
            });
            
            return promise;
          }),
          tap({
            next: () => store.setLoading(false),
            error: (error: Error) => {
              store.setLoading(false);
              store.setError(error.message);
            }
          })
        )
      )
    }))
  );
}

/**
 * Example: Product Store using custom features
 */
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

interface ProductsState {
  products: Product[];
  selectedProductId: number | null;
  categoryFilter: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999, inStock: true },
  { id: 2, name: 'Mouse', category: 'Electronics', price: 25, inStock: true },
  { id: 3, name: 'Keyboard', category: 'Electronics', price: 75, inStock: false },
  { id: 4, name: 'Desk', category: 'Furniture', price: 200, inStock: true },
  { id: 5, name: 'Chair', category: 'Furniture', price: 150, inStock: true },
  { id: 6, name: 'Book', category: 'Education', price: 20, inStock: true },
  { id: 7, name: 'Pen', category: 'Education', price: 2, inStock: true },
];

const initialState: ProductsState = {
  products: initialProducts,
  selectedProductId: null,
  categoryFilter: '',
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  
  // Base state
  withState(initialState),
  
  // Compose custom features
  withPagination(3), // 3 items per page
  withAsyncOperations(), // This already includes loading and error state
  
  // Additional computed properties
  withComputed((store) => ({
    // Filter products by category
    filteredProducts: computed(() => {
      const products = store.products();
      const categoryFilter = store.categoryFilter();
      
      if (!categoryFilter) return products;
      
      return products.filter(product => 
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }),
    
    // Get selected product
    selectedProduct: computed(() => {
      const products = store.products();
      const selectedId = store.selectedProductId();
      return products.find(product => product.id === selectedId) ?? null;
    }),
    
    // Get available categories
    categories: computed(() => {
      const products = store.products();
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort((a, b) => a.localeCompare(b));
    }),
  })),
  
  // Computed properties that depend on filteredProducts
  withComputed((store) => ({
    // Statistics
    inStockCount: computed(() => 
      store.filteredProducts().filter((p: Product) => p.inStock).length
    ),
    
    outOfStockCount: computed(() => 
      store.filteredProducts().filter((p: Product) => !p.inStock).length
    ),
    
    averagePrice: computed(() => {
      const products = store.filteredProducts();
      if (products.length === 0) return 0;
      const total = products.reduce((sum: number, p: Product) => sum + p.price, 0);
      return Math.round((total / products.length) * 100) / 100;
    }),
    
    // Paginated products
    paginatedProducts: computed(() => {
      const filtered = store.filteredProducts();
      const startIndex = store.startIndex();
      return filtered.slice(startIndex, startIndex + store.pageSize());
    })
  })),
  
  // Update pagination when filtered products change
  withComputed((store) => ({
    _updatePagination: computed(() => {
      const filteredCount = store.filteredProducts().length;
      // This will trigger pagination update
      return filteredCount;
    })
  })),
  
  // Store-specific methods
  withMethods((store) => ({
    // Initialize store
    loadProducts(): void {
      store.simulateOperation({ delayMs: 1000 });
      // Update pagination total
      patchState(store, {});
      store.setTotal(store.filteredProducts().length);
    },
    
    // Product operations
    addProduct(product: Omit<Product, 'id'>): void {
      const currentProducts = store.products();
      const newProduct = { ...product, id: Date.now() };
      const updatedProducts = [...currentProducts, newProduct];
      
      patchState(store, { products: updatedProducts });
      store.setTotal(store.filteredProducts().length);
    },
    
    removeProduct(productId: number): void {
      const currentProducts = store.products();
      const updatedProducts = currentProducts.filter(p => p.id !== productId);
      
      patchState(store, { 
        products: updatedProducts,
        selectedProductId: store.selectedProductId() === productId ? null : store.selectedProductId()
      });
      store.setTotal(store.filteredProducts().length);
    },
    
    toggleStock(productId: number): void {
      const currentProducts = store.products();
      const updatedProducts = currentProducts.map(p => 
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      );
      
      patchState(store, { products: updatedProducts });
    },
    
    // Selection
    selectProduct(productId: number): void {
      patchState(store, { selectedProductId: productId });
    },
    
    clearSelection(): void {
      patchState(store, { selectedProductId: null });
    },
    
    // Filtering
    setCategoryFilter(category: string): void {
      patchState(store, { categoryFilter: category });
      store.resetPagination();
      store.setTotal(store.filteredProducts().length);
    },
    
    clearCategoryFilter(): void {
      patchState(store, { categoryFilter: '' });
      store.resetPagination();
      store.setTotal(store.filteredProducts().length);
    }
  }))
);