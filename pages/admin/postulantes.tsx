import type { NextPage } from 'next'
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { LayoutUser } from '../../common/components/layouts'
import {
  AlertDialog,
  CustomDataTable,
  CustomDialog,
  IconoTooltip,
} from '../../common/components/ui'
import { ReactNode, useEffect, useState } from 'react'
import { CasbinTypes } from '../../common/types'
import { Constantes } from '../../config'
import {
  delay,
  InterpreteMensajes,
  siteName,
  titleCase,
} from '../../common/utils'
import { useAuth } from '../../context/auth'
import { Paginacion } from '../../common/components/ui/Paginacion'
import { useRouter } from 'next/router'
import { useAlerts, useSession } from '../../common/hooks'
import CustomMensajeEstado from '../../common/components/ui/CustomMensajeEstado'
import { BotonOrdenar } from '../../common/components/ui/BotonOrdenar'
import { BotonBuscar } from '../../common/components/ui/BotonBuscar'
import { CriterioOrdenType } from '../../common/types/ordenTypes'
import { ordenFiltrado } from '../../common/utils/orden'
import { BotonAgregar } from '../../common/components/ui/BotonAgregar'
import { PostulanteCRUDType } from '../../modules/admin/postulantes/types/postulanteCRUDTypes'
import { FiltroPostulante } from '../../modules/admin/postulantes/ui/FiltroPostulante'
import { imprimir } from '../../common/utils/imprimir'
import { VistaModalPostulante } from '../../modules/admin/postulantes/ui'

const Postulantes: NextPage = () => {
  // data de postulantes
  const [postulantesData, setPostulantesData] = useState<PostulanteCRUDType[]>([])

  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  /// Indicador de error en una petición
  const [errorPostulanteData, setErrorPostulanteData] = useState<any>()

  /// Indicador para mostrar una ventana modal de postulante
  const [modalPostulante, setModalPostulante] = useState(false)

  // Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoPostulante, setMostrarAlertaEstadoPostulante] =
   useState(false)
  
  //indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaRestablecerPostulante, setMostrarAlerRestablecerPostulante] =
   useState(false)
  
  //variable que contiene el estado del usaurio que está editando
  const [postulanteEdicion, setPostulanteEdicion] = useState<PostulanteCRUDType | undefined | null >()
  
  // Variables de paginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Filtros específicos para postulantes
  const [filtroNombre, setFiltroNombre] = useState<string>('')
  const [filtroCI, setFiltroCI] = useState<string>('')

  /// Indicador para mostrar el filtro de postulantes
  const [mostrarFiltroPostulantes, setMostrarFiltroPostulantes] = useState(false)

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { estaAutenticado, permisoUsuario } = useAuth()

  // Permisos para acciones
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  //Método que muestra alerta de cambio de estado
  const editarEstadoPostulante = async (postulantes: PostulanteCRUDType) => {
    setPostulanteEdicion(postulantes) //para mostar daos del modal en la alerta
    setMostrarAlertaEstadoPostulante(true)
  }

  //Método de cancaler 
  const cancelarAlertaEstadoPostulante = async () => {
    setMostrarAlertaEstadoPostulante(false)
    await delay(500)
    setPostulanteEdicion(null)
  }
  
  //Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoPostulante = async () => {
    setMostrarAlertaEstadoPostulante(false)
    if (postulanteEdicion) {
      await cambiarEstadoPostulantePeticion(postulanteEdicion)
    }
    setPostulanteEdicion(null)
  }
  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoPostulantePeticion = async (
    postulante: PostulanteCRUDType
  ) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/postulante/${postulante.id}/${
          postulante.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta estado parametro: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerPostulantesPeticion()
    } catch (e) {
      imprimir(`Error estado parametro`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }
  // router para conocer la ruta actual
  const router = useRouter()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nombreCompleto', nombre: 'Nombre Completo', ordenar: true },
    { campo: 'ci', nombre: 'C.I.', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = postulantesData.map(
    (postulanteData, indexPostulante) => [
      <Typography
        key={`${postulanteData.id}-${indexPostulante}-nombreCompleto`}
        variant={'body2'}
      >
      {`${postulanteData.nombreCompleto}`}
      </Typography>,
      
      <Typography
        key={`${postulanteData.id}-${indexPostulante}-ci`}
        variant={'body2'}
      >
        {`${postulanteData.ci}`}
      </Typography>,

      <CustomMensajeEstado
        key={`${postulanteData.id}-${indexPostulante}-estado`}
        titulo={postulanteData.estado}
        descripcion={postulanteData.estado}
        color={
          postulanteData.estado == 'ACTIVO'
            ? 'success'
            : postulanteData.estado == 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,
      <Grid key={`${postulanteData.id}-${indexPostulante}-acciones`}>
      {permisos.update && (
        <IconoTooltip
          id={`cambiarEstadoParametro-${postulanteData.id}`}
          titulo={postulanteData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
          color={postulanteData.estado == 'ACTIVO' ? 'success' : 'error'}
          accion={async () => {
            await editarEstadoPostulante(postulanteData)
          }}
          desactivado={postulanteData.estado == 'PENDIENTE'}
          icono={
            postulanteData.estado == 'ACTIVO' ? 'toggle_on' : 'toggle_off'
          }
          name={
            postulanteData.estado == 'ACTIVO'
              ? 'Inactivar Parámetro'
              : 'Activar Parámetro'
          }
        />
      )}

      {permisos.update && (
        <IconoTooltip
          id={`editarParametros-${postulanteData.id}`}
          name={'Parámetros'}
          titulo={'Editar'}
          color={'primary'}
          accion={() => {
            imprimir(`Editaremos`, postulanteData)
            editarPostulanteModal(postulanteData)
          }}
          icono={'edit'}
        />
      )}
    </Grid>,
    ]
  )
  
  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={'accionFiltrarPostulanteToggle'}
      key={'accionFiltrarPostulanteToggle'}
      mostrar={mostrarFiltroPostulantes}
      cambiar={setMostrarFiltroPostulantes}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarParametros'}
        key={`ordenarParametros`}
        label={'Ordenar parámetros'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarPostulante'}
      titulo={'Actualizar'}
      key={`accionActualizarPostulante`}
      accion={async () => {
        await obtenerPostulantesPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de parámetros'}
    />,
    permisos.create && (
      <BotonAgregar
        id={'agregarPostulante'}
        key={'agregarPostulante'}
        texto={'Agregar Postulante'}
        descripcion={'Agregar postulante'}
        accion={() => {
          agregarPostulanteModal()
        }}
      />
    ),
  ]
 
  const obtenerPostulantesPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/postulante`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroNombre.length > 0 ? { nombre: filtroNombre } : {}),
          ...(filtroCI.length > 0 ? { ci: filtroCI } : {}),
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
      })
      setPostulantesData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorPostulanteData(null)
    } catch (e) {
      imprimir(`Error al obtener parametros`, e)
      setErrorPostulanteData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }
  
  // Función para agregar postulante
  const agregarPostulanteModal = () => {
    setPostulanteEdicion(undefined)
    setModalPostulante(true)
  }

  // Función para editar postulante
  const editarPostulanteModal = async (postulante: PostulanteCRUDType) => {
    setPostulanteEdicion(postulante)
    setModalPostulante(true)
  }

  // Función para cerrar modal
  const cerrarModalPostulante = async () => {
    setModalPostulante(false)
    await delay(500)
    await setPostulanteEdicion(undefined)
  }

  // Función para definir permisos
  const definirPermisos = async () => {
    setPermisos(await permisoUsuario(router.pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
  }, [estaAutenticado])

  useEffect(() => {
    if (estaAutenticado) obtenerPostulantesPeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    // eslint-disble-nest-line react-ooks/exaustive-deps
    JSON.stringify(ordenCriterios),
    FiltroPostulante,
  ])

  useEffect(() => {
    if (!mostrarFiltroPostulantes) {
      setFiltroNombre('')
      setFiltroCI('')
    }
  },[mostrarFiltroPostulantes])

  const paginacion = (
    <Paginacion
      pagina ={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )
  // Función para manejar filtros del componente FiltroPostulante
  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaEstadoPostulante}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          postulanteEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el postulante: ${titleCase(postulanteEdicion?.nombreCompleto?? '')} ?`}
      >
        <Button onClick={cancelarAlertaEstadoPostulante}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoPostulante}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalPostulante}
        handleClose={cerrarModalPostulante}
        title={postulanteEdicion ? 'Editar postulante' : 'Nuevo postulante'}
      >
        <VistaModalPostulante
          postulante={postulanteEdicion}
          accionCorrecta={() => {
            cerrarModalPostulante().finally()
            obtenerPostulantesPeticion().finally()
          }}
          accionCancelar={cerrarModalPostulante}
        />
      </CustomDialog>
      <LayoutUser title={`Postulante - ${siteName()}`}>
        <CustomDataTable
          titulo={'Postulante'}
          error={!!errorPostulanteData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
          filtros={
            mostrarFiltroPostulantes && (
              <FiltroPostulante
              filtroNombre={filtroNombre}
              filtroCI={filtroCI}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroNombre(filtros.nombreCompleto)
                setFiltroCI(filtros.ci)
              }}
              accionCerrar={() => {
                imprimir(`👀 cerrar`)
              }}
            />
            )
          }
        />
      </LayoutUser>
    </>
  )
}

export default Postulantes
