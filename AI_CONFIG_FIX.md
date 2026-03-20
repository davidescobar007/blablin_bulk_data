# Corrección: Funcionalidad de Configuración AI en Headers

## Problema
Después de la refactorización, el botón de configuración AI (icono de varita mágica) en los headers de las columnas no funcionaba correctamente.

## Causa
El código del botón Wand2 estaba intentando obtener el config de AI dentro de un callback usando `usePocketBase()`, lo cual no está permitido por las reglas de React Hooks.

## Solución Implementada

### 1. Obtener funciones del contexto al inicio del componente
```tsx
const {
  // ... otras propiedades
  getAIConfig,
  setAIConfig,
} = usePocketBase();
```

### 2. Crear handler especializado para mostrar el dialog de configuración AI
```tsx
const handleShowAIColumnConfig = useCallback((columnName: string) => {
  if (selectedCollection) {
    const config = getAIConfig(selectedCollection.name, columnName);
    setConfiguringColumn(columnName);
    setAiConfig(config);
    setShowAIColumnConfig(true);
  }
}, [selectedCollection, getAIConfig, setShowAIColumnConfig]);
```

### 3. Corregir el handler de guardar configuración AI
```tsx
const handleSaveAIConfig = useCallback((config: AIColumnConfig | null) => {
  if (selectedCollection && configuringColumn) {
    setAIConfig(selectedCollection.name, configuringColumn, config);
  }
}, [selectedCollection, configuringColumn, setAIConfig]);
```

### 4. Conectar el botón Wand2 al handler correcto
```tsx
<button
  onClick={() => handleShowAIColumnConfig(header.column.id)}
  className="ml-1 p-1 rounded hover:bg-purple-100 text-slate-400 hover:text-purple-600 transition-colors"
  title="Configure AI for this column"
>
  <Wand2 className="w-3 h-3" />
</button>
```

### 5. Limpiar el estado al cerrar el dialog
```tsx
<AIColumnConfigDialog
  isOpen={showAIColumnConfig}
  onClose={() => {
    setShowAIColumnConfig(false);
    setConfiguringColumn(null);
  }}
  columnName={configuringColumn || ""}
  collectionSchema={selectedCollection?.schema}
  config={aiConfig}
  onSave={handleSaveAIConfig}
/>
```

## Archivos Modificados
- `src/components/organisms/RecordsTable/RecordsTable.tsx`

## Resultados
✅ Botón de configuración AI funciona correctamente en headers de columnas
✅ Configuración de AI se carga correctamente al abrir el dialog
✅ Configuración de AI se guarda correctamente
✅ Estado se limpia correctamente al cerrar el dialog
✅ No hay errores de compilación
✅ No hay errores de linting

## Verificación
```bash
✓ built in 4.49s
✓ Sin errores de TypeScript
✓ Sin errores de linting en RecordsTable
```
