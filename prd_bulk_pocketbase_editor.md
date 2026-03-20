# PRD: Bulk Editor & Creator para PocketBase (React)

## 1. Resumen Ejecutivo
Esta aplicación es una herramienta de administración masiva para PocketBase. Permite a los usuarios crear o editar múltiples registros simultáneamente mediante una interfaz de tabla dinámica. Cada campo de la tabla se adapta automáticamente al tipo de dato definido en la colección de PocketBase, facilitando la carga de datos gramaticales de forma estructurada y rápida.

## 2. Objetivo del Producto
Optimizar el flujo de trabajo de carga de datos permitiendo:
- Crear múltiples registros a la vez.
- Editar registros existentes en bloque.
- Garantizar que los datos ingresados coincidan con el esquema de PocketBase (validación de tipos).

## 3. Alcance del Producto
### Incluye
- Conexión dinámica a colecciones de PocketBase.
- Interfaz de tabla (Data Grid) para entrada de datos masiva.
- Soporte para tipos de datos específicos: Texto, Enriquecido (Markdown/HTML), Booleano, Fecha, y Relaciones.
- Función "Añadir N filas" para creación rápida.
- Sincronización masiva (Bulk Save) con manejo de errores por fila.

### No incluye
- Generación de contenido por IA.
- Gestión de archivos adjuntos complejos (imágenes/documentos) en esta fase inicial.
- Dashboard de analíticas.

## 4. Arquitectura Técnica
- **Frontend:** React + TanStack Table (o similar) para el manejo de la cuadrícula.
- **Componentes de UI:** Shadcn/UI o MUI para inputs especializados (Datepickers, Selects).
- **Cliente API:** SDK oficial de PocketBase para JavaScript.

## 5. Flujo del Usuario
1. **Configuración:** El usuario ingresa la URL de PocketBase y las credenciales de Admin.
2. **Selección:** Se elige la colección (ej. "temas_gramaticales").
3. **Carga:** La app descarga los registros actuales y los muestra en la tabla.
4. **Edición/Creación:** 
   - El usuario edita celdas existentes.
   - El usuario hace clic en "Añadir filas" para insertar nuevos registros al final de la tabla.
5. **Validación:** Los inputs restringen el tipo de dato (ej. solo números en campos numéricos).
6. **Sincronización:** El usuario presiona "Guardar Cambios" y la app procesa los `create` y `update` pendientes.

## 6. Requerimientos Funcionales
- **RF1: Renderizado Dinámico:** La tabla debe generar columnas basadas en el esquema de la colección seleccionada.
- **RF2: Inputs Especializados:** 
  - Campos de texto -> Textarea/Input.
  - Campos select/radio -> Basados en las opciones de PocketBase.
  - Campos fecha -> Selector de fecha.
- **RF3: Creación Múltiple:** Opción para definir cuántas filas nuevas añadir de un solo golpe.
- **RF4: Estado de Sincronización:** Indicadores visuales para filas modificadas, nuevas o con errores de validación.
- **RF5: Persistencia:** Botón de guardado masivo que ejecute las promesas de forma eficiente.

## 7. Requerimientos No Funcionales
- **RNF1: Rendimiento:** La tabla debe soportar al menos 100 filas editables simultáneamente sin lag en los inputs.
- **RNF2: Seguridad:** Las credenciales de PocketBase se manejan en memoria o LocalStorage cifrado, nunca se envían a servidores externos.
- **RNF3: UX:** Atajos de teclado básicos (Tab para navegar entre celdas).

## 8. Interfaz Sugerida
- **Header:** Selector de colección y estado de conexión.
- **Main:** Tabla con scroll horizontal/vertical.
- **Footer:** Botones de acción (Añadir Fila, Descartar Cambios, Guardar Todo).

## 9. Roadmap
- **Fase 1:** Conexión básica y lectura de esquema.
- **Fase 2:** Implementación de la tabla editable con inputs básicos.
- **Fase 3:** Lógica de guardado masivo y manejo de errores de API.
- **Fase 4:** Inputs avanzados (fechas, relaciones y booleanos).
