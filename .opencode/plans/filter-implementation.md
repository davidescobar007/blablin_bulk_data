# Plan de Implementación: Sistema de Filtros para la Tabla

## Resumen
Implementar un sistema completo de filtros que permita búsqueda global y filtros específicos por columna, presentados en un drawer lateral.

## Requisitos
- Búsqueda global de texto en todas las columnas visibles
- Filtros específicos por columna según tipo de dato
- Interfaz en drawer lateral (slide-out panel)
- Soporte para todos los tipos: Texto, Numérico, Fecha, Select/Enum, Relaciones
- Persistencia de filtros (opcional)

## Arquitectura

### 1. Tipos y Definiciones (nuevo archivo: `src/components/records-table/filter-types.ts`)

```typescript
// Operadores de filtro por tipo de dato
export enum FilterOperator {
  // Texto
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",

  // Numérico
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  GREATER_EQUAL = "greater_equal",
  LESS_EQUAL = "less_equal",

  // Fecha
  EQUALS = "equals",
  BEFORE = "before",
  AFTER = "after",
  BETWEEN = "between",

  // Select/Enum
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  IN = "in",
  NOT_IN = "not_in",

  // Relación
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
}

export interface ColumnFilter {
  columnKey: string;
  operator: FilterOperator;
  value: unknown;
  // Para rangos (fecha, número)
  valueTo?: unknown;
}

export interface FilterState {
  globalSearch: string;
  columnFilters: Record<string, ColumnFilter>;
  showFilterDrawer: boolean;
}

export interface FilterOperatorsMap {
  [type: string]: FilterOperator[];
}
```

### 2. Hook Personalizado: `useTableFilters` (nuevo archivo: `src/components/records-table/hooks/useTableFilters.ts`)

**Responsabilidades:**
- Gestionar estado de filtros (global + por columna)
- Aplicar lógica de filtrado a los registros
- Guardar/cargar filtros desde localStorage (opcional)
- Proporcionar métodos para agregar/eliminar/actualizar filtros

**Interface:**
```typescript
interface UseTableFiltersReturn {
  filters: FilterState;
  filteredRecords: TrackedRecord[];
  setGlobalSearch: (value: string) => void;
  setColumnFilter: (columnKey: string, filter: ColumnFilter | null) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}
```

**Lógica de filtrado:**
- Búsqueda global: busca en todas las columnas visibles (case-insensitive)
- Filtros por columna: aplica operador específico según tipo de dato
- AND lógico entre filtros activos

### 3. Componentes UI

#### 3.1 Drawer Component (nuevo archivo: `src/components/atoms/Drawer/Drawer.tsx`)

**Responsabilidades:**
- Drawer lateral slide-in/out
- Panel con overlay backdrop
- Contenido scrollable
- Header con título y botón de cerrar

**Props:**
```typescript
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: "left" | "right";
  width?: string;
}
```

#### 3.2 FilterRow Component (nuevo archivo: `src/components/records-table/FilterRow.tsx`)

**Responsabilidades:**
- Mostrar selector de operadores según tipo de dato
- Mostrar input de valor correspondiente al tipo
- Inputs específicos: text, number, date, select, relation
- Botón para remover filtro

**Props:**
```typescript
interface FilterRowProps {
  column: Column;
  filter: ColumnFilter | null;
  onFilterChange: (filter: ColumnFilter | null) => void;
  relationOptions?: Record<string, unknown[]>;
}
```

**Estructura:**
- Header: nombre de columna + botón remover
- Row 1: selector de operador + input valor
- Row 2 (opcional): segundo input valor para rangos (entre fechas, números)

#### 3.3 FilterDrawer Component (nuevo archivo: `src/components/records-table/FilterDrawer.tsx`)

**Responsabilidades:**
- Drawer principal que contiene todos los filtros
- Sección de búsqueda global
- Lista de filtros por columna (uno por cada columna visible)
- Botones: Limpiar todos, Aplicar

**Props:**
```typescript
interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onGlobalSearchChange: (value: string) => void;
  onColumnFilterChange: (columnKey: string, filter: ColumnFilter | null) => void;
  onClearAll: () => void;
  displayColumns: Column[];
  relationOptions?: Record<string, unknown[]>;
}
```

**Estructura:**
```
┌─ Filter Drawer ──────────────────────────┐
│ [X]  Filters                              │
├──────────────────────────────────────────┤
│ 📌 Global Search                          │
│ [_________________________]              │
│                                          │
│ 📊 Column Filters                         │
│                                          │
│ Name                    [remove ▼]       │
│ Operator: [contains ▼] Value: [______]  │
│                                          │
│ Age                     [remove ▼]       │
│ Operator: [greater_than ▼] Value: [____]│
│                                          │
│ Status                  [remove ▼]       │
│ Operator: [equals ▼] Value: [active ▼] │
│                                          │
├──────────────────────────────────────────┤
│ [Clear All]                    [Close]  │
└──────────────────────────────────────────┘
```

#### 3.4 FilterButton Component (nuevo archivo: `src/components/records-table/FilterButton.tsx`)

**Responsabilidades:**
- Botón para abrir drawer de filtros
- Badge con contador de filtros activos
- Indicador visual cuando hay filtros activos

**Props:**
```typescript
interface FilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}
```

### 4. Integración con RecordsTable

#### 4.1 Modificar `RecordsTable.tsx`

**Cambios:**
1. Importar y usar hook `useTableFilters`
2. Pasar `filteredRecords` en lugar de `trackedRecords` a la tabla
3. Renderizar `FilterButton` en `TableActions`
4. Renderizar `FilterDrawer` al mismo nivel que otros modales/dialogs

```typescript
// En RecordsTable.tsx
const {
  filters,
  filteredRecords,
  setGlobalSearch,
  setColumnFilter,
  clearAllFilters,
  hasActiveFilters,
  activeFilterCount,
} = useTableFilters(trackedRecords, displayColumns);

// Actualizar uso de la tabla
const table = useReactTable({
  data: filteredRecords, // Cambio: usar filteredRecords
  columns: columnDefinitions,
  // ...
});

// En TableActions
<TableActions
  // ...
  onShowFilters={() => setFilters(prev => ({ ...prev, showFilterDrawer: true }))}
  activeFilterCount={activeFilterCount}
  hasActiveFilters={hasActiveFilters}
/>

// Renderizar FilterDrawer
<FilterDrawer
  isOpen={filters.showFilterDrawer}
  onClose={() => setFilters(prev => ({ ...prev, showFilterDrawer: false }))}
  filters={filters}
  onGlobalSearchChange={setGlobalSearch}
  onColumnFilterChange={setColumnFilter}
  onClearAll={clearAllFilters}
  displayColumns={displayColumns}
  relationOptions={relationOptions}
/>
```

#### 4.2 Modificar `TableActions.tsx`

**Cambios:**
1. Agregar prop `onShowFilters`
2. Agregar prop `activeFilterCount`
3. Agregar prop `hasActiveFilters`
4. Renderizar `FilterButton` junto a otros botones

```typescript
interface TableActionsProps {
  // ... props existentes
  onShowFilters?: () => void;
  activeFilterCount?: number;
  hasActiveFilters?: boolean;
}

export function TableActions({
  // ... props existentes
  onShowFilters,
  activeFilterCount = 0,
  hasActiveFilters = false,
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* botones existentes */}
        <FilterButton
          onClick={onShowFilters}
          activeFilterCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
        />
        {/* ... */}
      </div>
    </div>
  );
}
```

### 5. Utilidades de Filtrado (nuevo archivo: `src/components/records-table/filter-utils.ts`)

**Funciones:**
- `getOperatorsForType(columnType: string): FilterOperator[]`
- `applyTextFilter(value: unknown, operator: FilterOperator, filterValue: unknown): boolean`
- `applyNumberFilter(value: unknown, operator: FilterOperator, filterValue: unknown): boolean`
- `applyDateFilter(value: unknown, operator: FilterOperator, filterValue: unknown, filterValueTo?: unknown): boolean`
- `applySelectFilter(value: unknown, operator: FilterOperator, filterValue: unknown): boolean`
- `applyRelationFilter(value: unknown, operator: FilterOperator, filterValue: unknown): boolean`
- `applyGlobalSearch(record: TrackedRecord, searchTerm: string, columns: Column[]): boolean`

### 6. Estilos y UX

**Colores:**
- Filtro activo: badge azul en el botón de filtros
- Input con filtro activo: borde azul
- Drawer: slide desde derecha, width: 400px (responsive: 300px móvil)

**Interacciones:**
- Debounce de 300ms para búsqueda global
- Aplicar filtros inmediatamente al cambiar inputs
- Tecla Escape para cerrar drawer
- Click fuera para cerrar drawer

**Responsive:**
- En móvil: drawer ocupa 100% del ancho
- En tablet: drawer ocupa 80% del ancho
- En desktop: drawer fijo de 400px

## Orden de Implementación

### Fase 1: Infraestructura
1. Crear tipos y definiciones (`filter-types.ts`)
2. Crear utilidades de filtrado (`filter-utils.ts`)
3. Crear componente Drawer genérico (`atoms/Drawer/Drawer.tsx`)

### Fase 2: Lógica de Filtros
4. Implementar hook `useTableFilters`
5. Escribir tests de filtrado (opcional)

### Fase 3: Componentes de UI
6. Crear `FilterRow` con soporte para todos los tipos
7. Crear `FilterDrawer` integrando `FilterRow`
8. Crear `FilterButton` con badge

### Fase 4: Integración
9. Modificar `TableActions` para incluir botón de filtros
10. Modificar `RecordsTable` para usar filtros
11. Probar integración completa

### Fase 5: Mejoras Opcionales
12. Persistencia de filtros en localStorage
13. Presets de filtros comunes
14. Exportar/importar filtros
15. Atajos de teclado para filtros

## Archivos a Crear
1. `src/components/atoms/Drawer/Drawer.tsx` - Componente drawer genérico
2. `src/components/atoms/Drawer/index.ts` - Export del drawer
3. `src/components/records-table/filter-types.ts` - Tipos para filtros
4. `src/components/records-table/filter-utils.ts` - Utilidades de filtrado
5. `src/components/records-table/FilterRow.tsx` - Filtro individual por columna
6. `src/components/records-table/FilterDrawer.tsx` - Drawer de filtros
7. `src/components/records-table/FilterButton.tsx` - Botón para abrir filtros
8. `src/components/records-table/hooks/useTableFilters.ts` - Hook de filtros

## Archivos a Modificar
1. `src/components/records-table/RecordsTable.tsx` - Integrar lógica de filtros
2. `src/components/records-table/TableActions.tsx` - Agregar botón de filtros
3. `src/components/records-table/TableBody.tsx` - Actualizar para manejar filteredRecords
4. `src/components/records-table/index.ts` - Exportar nuevos componentes

## Consideraciones Técnicas

### Performance
- Usar `useMemo` para filtrado de registros
- `useCallback` para handlers de eventos
- Evitar re-renders innecesarios

### Accesibilidad
- Labels descriptivos para inputs de filtro
- Focus management en drawer
- Soporte para navegación por teclado
- ARIA labels apropiados

### Internacionalización
- Considerar soporte para i18n en el futuro
- Labels de operadores localizables

### Edge Cases
- Manejar valores null/undefined
- Validar tipos de datos antes de filtrar
- Manejar fechas inválidas
- Manejar arrays en filters (para operator IN/NOT_IN)

## Testing (Opcional pero recomendado)

### Unit Tests
- Testear funciones de filtrado individualmente
- Testear lógica de operadores para cada tipo
- Testear edge cases

### Integration Tests
- Verificar que filtros funcionen con la tabla
- Verificar que múltiples filtros funcionen juntos
- Verificar persistencia (si se implementa)

## Dependencias Existentes Utilizadas
- `lucide-react` - Iconos
- `clsx` y `tailwind-merge` - Utilidades de clases
- `date-fns` - Ya existe en package.json para manejo de fechas

No se requieren nuevas dependencias externas.
