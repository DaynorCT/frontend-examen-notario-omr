// CRUD de usuarios
// Interfaces para postulantes con puntaje de examen

export interface PostulanteConPuntajeType {
  id: string
  nombrecompleto: string
  ci: string
  estado: string
  idexamen: string // ID del examen generado
  codigo: string           // Código del examen
  puntaje: number | null   // Puntaje obtenido
  puntajeformateado: string // "15/35" o "Sin procesar"
  hojarespuestapintada: string | null // Ruta del PDF pintado
  rutaimagen: string | null // Ruta de la imagen
}

export interface ResultadoExamenType {
  id: string
  nombrecompleto: string
  ci: string
  estado: string
  idexamen: string // ID del examen generado
  codigo: string // Código del examen
  puntaje: number | null // Puntaje obtenido
  puntajeformateado: string // "15/35" o "Sin procesar"
  hojarespuestapintada: string | null // Ruta del PDF pintado
  rutaimagen: string | null // Ruta de la imagen
  fechaExamen?: string
  respuestas?: any // JSON con respuestas individuales
}
// Interfaces existentes (para referencia)
export interface PostulanteCRUDType {
  id: string
  nombrecompleto: string
  ci: string
  estado: string
}

export interface CrearEditarPostulanteType {
  id?: string
  nombrecompleto: string
  ci: string
  estado?: string
}