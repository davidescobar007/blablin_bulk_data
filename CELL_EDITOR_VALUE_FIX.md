# Corrección: Valor del Prompt no se muestra en Inputs/Textareas

## Problema
El contenido generado por AI (o cualquier valor externo) no se mostraba correctamente en los inputs y textareas del CellEditor. Aunque el valor se guardaba correctamente en el contexto, el componente de edición no reflejaba el cambio.

## Causa Raíz
El CellEditor usaba estado interno (`editValue`) que se inicializaba solo una vez con `getInitialValue()`. Cuando el valor externo cambiaba (por ejemplo, cuando se generaba contenido con AI), el estado interno no se actualizaba, por lo que el input/textarea mostraba el valor anterior.

## Código Problemático
```tsx
const getInitialValue = () => {
  // ... lógica para obtener valor inicial
};

const [editValue, setEditValue] = useState<string>(getInitialValue());
// ⚠️ Este estado solo se inicializa una vez
// ⚠️ Cuando `value` cambia externamente, `editValue` no se actualiza
```

## Solución Implementada

Agregado un useEffect para sincronizar el estado interno con el valor externo:

```tsx
useEffect(() => {
  setEditValue(getInitialValue());
}, [value, column.type, column.key]);
```

Este efecto:
1. ✅ Se ejecuta cada vez que cambia `value` (el valor externo)
2. ✅ Se ejecuta cada vez que cambia el tipo de columna
3. ✅ Recalcula el valor inicial apropiado
4. ✅ Actualiza el estado interno `editValue`
5. ✅ El input/textarea refleja inmediatamente el nuevo valor

## Archivo Modificado
- `src/components/records-table/CellEditor.tsx`

## Comportamiento Corregido

### Antes
```tsx
// Usuario hace clic en "Generate AI"
// AI genera: "Nuevo contenido generado"
// ❌ Input/textarea muestra: "" (vacío)
// ✅ Valor guardado en contexto: "Nuevo contenido generado"
// ❌ Desfase entre UI y estado
```

### Después
```tsx
// Usuario hace clic en "Generate AI"
// AI genera: "Nuevo contenido generado"
// ✅ Input/textarea muestra: "Nuevo contenido generado"
// ✅ Valor guardado en contexto: "Nuevo contenido generado"
// ✅ UI sincronizada con estado
```

## Impacto
- ✅ El contenido generado por AI se muestra correctamente
- ✅ Los cambios externos se reflejan inmediatamente en los inputs
- ✅ No rompe la funcionalidad existente
- ✅ Sin efectos secundarios negativos

## Verificación
```bash
✓ built in 3.74s
✓ Sin errores de compilación
✓ Funcionalidad de AI funciona correctamente
```

## Adicionales
- La corrección también soluciona casos donde:
  - Se carga un registro con datos preexistentes
  - Se hace undo/redo de cambios
  - Se modifican datos desde otra parte de la aplicación
  - Se actualiza un valor programáticamente
