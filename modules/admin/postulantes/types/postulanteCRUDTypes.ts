// CRUD de usuarios

export interface PostulanteCRUDType {
  id: string
  nombreCompleto: string
  ci: string
  estado: string
}


export interface CrearEditarPostulanteType {
  id?: string
  nombreCompleto: string
  ci: string
  estado?: string
}

