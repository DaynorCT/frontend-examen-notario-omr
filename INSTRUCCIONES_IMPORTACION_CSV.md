# Instrucciones para Importación de Preguntas desde CSV

## Descripción
Esta funcionalidad permite importar múltiples preguntas desde un archivo CSV, facilitando la carga masiva de preguntas al sistema.

## Formato del Archivo CSV

El archivo CSV debe tener las siguientes columnas en el orden especificado:

| Columna | Descripción | Requerido | Ejemplo |
|---------|-------------|-----------|---------|
| `categoria` | Nombre de la categoría a la que pertenece la pregunta | Sí | "Derecho Civil" |
| `descripcion` | Texto de la pregunta | Sí | "¿Cuál es la edad mínima para contraer matrimonio?" |
| `opcion_a` | Primera opción de respuesta | Sí | "18 años" |
| `opcion_b` | Segunda opción de respuesta | Sí | "16 años" |
| `opcion_c` | Tercera opción de respuesta | Sí | "21 años" |
| `opcion_d` | Cuarta opción de respuesta | Sí | "14 años" |
| `correcta` | Letra de la opción correcta (a, b, c, o d) | Sí | "a" |

## Ejemplo de Archivo CSV

```csv
categoria,descripcion,opcion_a,opcion_b,opcion_c,opcion_d,correcta
Derecho Civil,¿Cuál es la edad mínima para contraer matrimonio en Bolivia?,18 años,16 años,21 años,14 años,a
Derecho Civil,¿Qué es un contrato de compraventa?,Un acuerdo de voluntades,Un documento notarial,Una sentencia judicial,Un acto administrativo,a
Derecho Mercantil,¿Cuál es el plazo para presentar una demanda mercantil?,2 años,1 año,5 años,6 meses,a
```

## Instrucciones de Uso

1. **Preparar el archivo CSV**:
   - Asegúrate de que el archivo tenga la extensión `.csv`
   - Verifica que todas las columnas estén presentes y en el orden correcto
   - La primera fila debe contener los nombres de las columnas
   - Las categorías deben existir previamente en el sistema

2. **Importar el archivo**:
   - Ve a la página de "Preguntas" en el panel de administración
   - Haz clic en el botón "Importar CSV"
   - Selecciona tu archivo CSV
   - El sistema procesará automáticamente el archivo

3. **Verificar la importación**:
   - Después de la importación, las preguntas aparecerán en la lista
   - Revisa que todas las preguntas se hayan importado correctamente
   - Verifica que las opciones y respuestas correctas estén bien asignadas

## Consideraciones Importantes

- **Categorías**: Las categorías mencionadas en el CSV deben existir previamente en el sistema
- **Formato de respuestas**: La columna `correcta` debe contener solo una letra: a, b, c, o d
- **Codificación**: El archivo debe estar en codificación UTF-8 para caracteres especiales
- **Separadores**: Usa comas como separadores de columnas
- **Comillas**: Si el texto contiene comas, enciérralo entre comillas dobles

## Manejo de Errores

- Si el archivo no es un CSV válido, se mostrará un mensaje de error
- Si faltan columnas requeridas, la importación fallará
- Si una categoría no existe, la pregunta no se importará
- Si el formato de la respuesta correcta es inválido, se mostrará un error

## Archivo de Ejemplo

Puedes descargar el archivo `ejemplo_importacion_preguntas.csv` como referencia para crear tu propio archivo de importación. 