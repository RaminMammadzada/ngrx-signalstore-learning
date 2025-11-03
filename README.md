# 🚀 NgRx SignalStore Learning Project

A comprehensive learning project for mastering NgRx SignalStore, Angular's lightweight signal-based state management solution.

## 📋 Overview

This project provides hands-on examples and tutorials to help you learn NgRx SignalStore from basic concepts to advanced patterns. Each example builds upon the previous one, gradually introducing more complex state management scenarios.

## 🎯 Learning Objectives

- Understand NgRx SignalStore fundamentals
- Learn signal-based reactive state management
- Master async operations with rxMethod()
- Build reusable store features
- Implement real-world state management patterns

## 📚 Examples Included

### 1. 🔢 Basic Counter Store
**File**: `src/app/stores/counter.store.ts`
**Component**: `src/app/components/counter.component.ts`

Learn the fundamentals:
- Basic store setup with `signalStore()`
- State definition with `withState()`
- Computed properties with `withComputed()`
- Actions with `withMethods()`
- Immutable updates with `patchState()`

### 2. 👥 Advanced Users Store
**File**: `src/app/stores/users.store.ts`
**Component**: `src/app/components/users.component.ts`

Advanced concepts:
- HTTP integration with HttpClient
- Async operations with `rxMethod()`
- Loading and error state management
- Complex computed properties
- Side effects and error handling

### 3. 🛍️ Custom Store Features
**File**: `src/app/stores/custom-features.store.ts`
**Component**: `src/app/components/products.component.ts`

Reusable patterns:
- Custom store features with `signalStoreFeature()`
- Composable feature libraries
- Pagination, filtering, and selection
- Feature composition and reusability

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   ng serve
   ```
   Or use VS Code Task: `Ctrl+Shift+P` → "Tasks: Run Task" → "npm: start"

3. **Open your browser** to `http://localhost:4200`

4. **Explore the examples** using the navigation tabs

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start development server |
| `ng build` | Build the project |
| `ng test` | Run unit tests |
| `ng lint` | Run linting |

## 📖 Core Concepts

### SignalStore Creation
```typescript
export const MyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // computed properties
  })),
  withMethods((store) => ({
    // actions
  }))
);
```

### State Updates
```typescript
// Immutable state updates
patchState(store, { count: newCount });

// Partial updates
patchState(store, (state) => ({ 
  items: [...state.items, newItem] 
}));
```

### Async Operations
```typescript
// Using rxMethod for async operations
loadData: rxMethod<void>(
  pipe(
    tap(() => patchState(store, { loading: true })),
    switchMap(() => httpClient.get('/api/data')),
    tap((data) => patchState(store, { data, loading: false }))
  )
)
```

### Custom Features
```typescript
// Reusable store features
export function withLoadingState() {
  return signalStoreFeature(
    withState({ loading: false }),
    withMethods((store) => ({
      setLoading: (loading: boolean) => patchState(store, { loading })
    }))
  );
}
```

## 🔍 Key Learning Points

### 1. **Basic Store Setup**
- Creating stores with `signalStore()`
- Defining initial state
- Accessing state with signals
- Type safety with TypeScript

### 2. **Computed Properties**
- Derived state with `withComputed()`
- Automatic dependency tracking
- Performance optimization
- Chaining computed properties

### 3. **State Management**
- Immutable updates with `patchState()`
- Action patterns with `withMethods()`
- State normalization
- Complex state structures

### 4. **Async Operations**
- HTTP integration
- `rxMethod()` for reactive operations
- Error handling patterns
- Loading state management

### 5. **Advanced Patterns**
- Custom store features
- Feature composition
- Reusable state logic
- Store modularity

## 🎓 Best Practices

1. **Keep stores focused** - One store per domain/feature
2. **Use computed for derived state** - Leverage automatic dependency tracking
3. **Handle errors gracefully** - Always include error state management
4. **Create reusable features** - Build feature libraries for common patterns
5. **Type everything** - Leverage TypeScript for better DX
6. **Test your stores** - Write unit tests for store logic

## 📁 Project Structure

```
src/app/
├── components/           # Example components
│   ├── counter.component.ts
│   ├── users.component.ts
│   └── products.component.ts
├── stores/              # SignalStore examples
│   ├── counter.store.ts
│   ├── users.store.ts
│   └── custom-features.store.ts
├── app.component.ts     # Main app with navigation
└── app.config.ts        # App configuration
```

## 🔗 Resources

- [NgRx SignalStore Documentation](https://ngrx.io/guide/signals)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [NgRx GitHub Repository](https://github.com/ngrx/platform)
- [RxJS Documentation](https://rxjs.dev/)

## 🚧 Next Steps

After completing these examples, consider:

1. **Integration with NgRx Store** - For complex applications
2. **Testing strategies** - Unit testing SignalStore
3. **Performance optimization** - Advanced signal patterns
4. **DevTools integration** - Debugging and monitoring

## 📝 Notes

This project uses:
- **Angular 19+** with standalone components
- **NgRx SignalStore** for state management
- **TypeScript** for type safety
- **RxJS** for async operations
- **HttpClient** for API integration

## 🤝 Contributing

Feel free to expand on these examples or add new learning scenarios!

---

**Happy Learning!** 🎉 Start with the Basic Counter example and work your way through to the advanced patterns.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
