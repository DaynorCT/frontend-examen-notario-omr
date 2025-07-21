// CRUD de usuarios

export interface CategoriaCRUDType {
  id: string
  descripcion: string
  cantidad: number
  seleccionable: number
  estado?: string
}


export interface CrearEditarCategoriaType {
  id?: string
  descripcion: string
  cantidad: number
  seleccionable: number
  estado?: string
}

