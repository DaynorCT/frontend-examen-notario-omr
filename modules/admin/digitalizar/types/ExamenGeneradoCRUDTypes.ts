// CRUD de usuarios

export interface ExamenGeneradoCRUDType {
  id: string
  codigo?: string
  grupo?: string
  hojaRespuesta?: string
  hojaPreguntas?: string
  hojaSobre?: string
  observacion?: string
  estado?: string
}


export interface CrearEditarExamenGeneradoType {
  id?: string
  codigo?: string
  grupo?: string
  hojaRespuesta?: string
  hojaPreguntas?: string
  hojaSobre?: string
  observacion?: string
  estado?: string
}

