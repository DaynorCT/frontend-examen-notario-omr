// CRUD de Asignar

export interface CodigoExamenType {
  id: string
  codigo: string
}

export interface PostulanteSelectType {
  id: string
  ci: string
}

export interface AsignarPostulantePayload {
  id: string
  idPostulante: string
}

export interface PostulanteCodigoCRUDType {
  ci: string;
  nombrecompleto: string
  idpostulante: string
  codigo: string;
  fechamodificacion: string
  estado: string
}

