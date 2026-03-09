

## Plan: Fix build error + remove Baños filter

### 1. Fix TypeScript build error in `Mapa.tsx` (line 75)

The type `L.MarkerCluster` doesn't exist in the installed `@types/leaflet`. The fix is to type the `cluster` parameter as `any` instead:

```ts
const createClusterIcon = (cluster: any) => {
```

This is standard practice with `react-leaflet-cluster` since its cluster type isn't exported by `@types/leaflet`.

### 2. Remove Baños filter everywhere

The user confirmed Baños has no data in the current catalog. Remove:

- **`src/components/PropertyFilters.tsx`**: Delete `banosSelect` helper function, remove all calls to `banosSelect()` (desktop row, mobile drawer), remove `filters.banos` from `hasFilters` and `activeCount`.
- **`src/lib/types.ts`**: Remove `banos?: number` from `PropertyFilters` interface.
- **`src/hooks/useProperties.ts`**: Remove `if (filters.banos) query = query.gte("banos", filters.banos)` from `applyCommonFilters`.
- **`src/pages/Mapa.tsx`**: Remove any baños filter references in the map filter bar if present.

### 3. Clean up unused import

Remove `Bath` from lucide-react imports in `PropertyFilters.tsx` since it was for the baños filter.

