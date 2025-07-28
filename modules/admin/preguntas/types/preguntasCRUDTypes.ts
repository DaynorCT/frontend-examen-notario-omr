import { CategoriaCRUDType } from '../../categoria/types/categoriaCRUDTypes'
// Tipo para una opción de pregunta
export interface OpcionPreguntaType {
  id?: string
  descripcion: string
  nota: string
  correcto: boolean
  orden: number
  estado?: string
}

// Tipo para crear o editar una pregunta con opciones
export interface CrearEditarPreguntaConOpcionesType {
  id?: string                // Solo para editar, opcional
  descripcion: string  
  nota: string // nota de la pregunta
  idCategoria: string        // ID de la categoría seleccionada
  opciones: OpcionPreguntaType[] // Array de opciones (a, b, c, d)
  orden?: number             // Opcional, si usas orden de preguntas
  estado?: string
}

// Tipo para mostrar una pregunta (por ejemplo, en una tabla)
export interface PreguntaCRUDType {
  id?: string
  descripcion: string
  nota: string
  idCategoria: string
  categoriaDescripcion?: string
  estado: string
  estadoPregunta?: string // <-- ahora es opcional
  opciones?: OpcionPreguntaType[]
  categoria?: CategoriaCRUDType // <-- Agregado para reflejar la respuesta del backend
}