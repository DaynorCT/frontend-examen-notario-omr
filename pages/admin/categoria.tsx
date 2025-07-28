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
import { imprimir } from '../../common/utils/imprimir'
import { CategoriaCRUDType } from '../../modules/admin/categoria/types/categoriaCRUDTypes'
import { FiltroCategoria, VistaModalCategoria } from '../../modules/admin/categoria/ui'
const Categoria: NextPage = () => {
  // data de postulantes
  const [categoriaData, setCategoriaData] = useState<CategoriaCRUDType[]>([])

  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  /// Indicador de error en una petición
  const [errorCategoriaData, setErrorCategoriaData] = useState<any>()

  /// Indicador para mostrar una ventana modal de postulante
  const [modalCategoria, setModalCategoria] = useState(false)

  // Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoCategoria, setMostrarAlertaEstadoCategoria] =
   useState(false)
  
  //indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaRestablecerCagoria, setMostrarAlerRestablecerCategoria] =
   useState(false)
  
  //variable que contiene el estado del usaurio que está editando
  const [categoriaEdicion, setCategoriaEdicion] = useState<CategoriaCRUDType | undefined | null >()
  
  // Variables de paginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Filtros específicos para postulantes
  const [filtroDescripcion, setFiltroDescripcion] = useState<string>('')
 
  /// Indicador para mostrar el filtro de postulantes
  const [mostrarFiltroCategoria, setMostrarFiltroCategoria] = useState(false)

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
  const editarEstadoCategoria = async (categoria: CategoriaCRUDType) => {
    setCategoriaEdicion(categoria) //para mostar daos del modal en la alerta
    setMostrarAlertaEstadoCategoria(true)
  }

  //Método de cancaler 
  const cancelarAlertaEstadoCategoria = async () => {
    setMostrarAlertaEstadoCategoria(false)
    await delay(500)
    setCategoriaEdicion(null)
  }
  
  //Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoCategoria = async () => {
    setMostrarAlertaEstadoCategoria(false)
    if (categoriaEdicion) {
      await cambiarCategoriaPeticion(categoriaEdicion)
    }
    setCategoriaEdicion(null)
  }
  /// Petición que cambia el estado de un parámetro
  const cambiarCategoriaPeticion = async (
    categoria: CategoriaCRUDType
  ) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria/${categoria.id}/${
          categoria.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta estado categoria: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerCategoriaPeticion()
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
    { campo: 'nombre', nombre: 'Nombre', ordenar: true },
    { campo: 'cantidad', nombre: 'Ctn Preguntas', ordenar: true },
    { campo: 'seleccionable', nombre: 'Ctn Seleccionadas', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = categoriaData.map(
    (categoriaData, indexCategoria) => [
      <Typography
        key={`${categoriaData.id}-${indexCategoria}-nomnbre`}
        variant={'body2'}
      >
      {`${categoriaData.descripcion}`}
      </Typography>,
      
      <Typography
        key={`${categoriaData.id}-${indexCategoria}-cantidad`}
        variant={'body2'}
      >
        {`${categoriaData.cantidad}`}
      </Typography>,
    
       <Typography
       key={`${categoriaData.id}-${indexCategoria}-seleccionable`}
       variant={'body2'}
     >
       {`${categoriaData.seleccionable}`}
     </Typography>,

      <CustomMensajeEstado
        key={`${categoriaData.id}-${indexCategoria}-estado`}
        titulo={categoriaData.estado}
        descripcion={categoriaData.estado}
        color={
          categoriaData.estado == 'ACTIVO'
            ? 'success'
            : categoriaData.estado == 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,
      <Grid key={`${categoriaData.id}-${indexCategoria}-acciones`}>
      {permisos.update && (
        <IconoTooltip
          id={`cambiarEstadoParametro-${categoriaData.id}`}
          titulo={categoriaData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
          color={categoriaData.estado == 'ACTIVO' ? 'success' : 'error'}
          accion={async () => {
            await editarEstadoCategoria(categoriaData)
          }}
          desactivado={categoriaData.estado == 'PENDIENTE'}
          icono={
            categoriaData.estado == 'ACTIVO' ? 'toggle_on' : 'toggle_off'
          }
          name={
            categoriaData.estado == 'ACTIVO'
              ? 'Inactivar Parámetro'
              : 'Activar Parámetro'
          }
        />
      )}

      {permisos.update && (
        <IconoTooltip
          id={`editarParametros-${categoriaData.id}`}
          name={'Parámetros'}
          titulo={'Editar'}
          color={'primary'}
          accion={() => {
            imprimir(`Editaremos`, categoriaData)
            editarCategoriaModal(categoriaData)
          }}
          icono={'edit'}
        />
      )}
    </Grid>,
    ]
  )
  
  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={'accionFiltrarCategoriaToggle'}
      key={'accionFiltrarCatetgoriaToggle'}
      mostrar={mostrarFiltroCategoria}
      cambiar={setMostrarFiltroCategoria}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarCategoria'}
        key={`ordenarCategoria`}
        label={'Ordenar Categoria'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarCategoria'}
      titulo={'Actualizar'}
      key={`accionActualizarCategoria`}
      accion={async () => {
        await obtenerCategoriaPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de Categoria'}
    />,
    permisos.create && (
      <BotonAgregar
        id={'agregarCategoria'}
        key={'agregarCategoria'}
        texto={'Agregar Categoria'}
        descripcion={'Agregar categoria'}
        accion={() => {
          agregarCategoriaModal()
        }}
      />
    ),
  ]
 
  const obtenerCategoriaPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroDescripcion.length > 0 ? { nombre: filtroDescripcion } : {}),
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
      })
      setCategoriaData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorCategoriaData(null)
    } catch (e) {
      imprimir(`Error al obtener parametros`, e)
      setErrorCategoriaData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }
  
  // Función para agregar categoria
  const agregarCategoriaModal = () => {
    setCategoriaEdicion(undefined)
    setModalCategoria(true)
  }

  // Función para editar postulante
  const editarCategoriaModal = async (categoria: CategoriaCRUDType) => {
    setCategoriaEdicion(categoria)
    setModalCategoria(true)
  }

  // Función para cerrar modal
  const cerrarModalCategoria = async () => {
    setModalCategoria(false)
    await delay(500)
    await setCategoriaEdicion(undefined)
  }

  // Función para definir permisos
  const definirPermisos = async () => {
    setPermisos(await permisoUsuario(router.pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
  }, [estaAutenticado])

  useEffect(() => {
    if (estaAutenticado) obtenerCategoriaPeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    // eslint-disble-nest-line react-ooks/exaustive-deps
    JSON.stringify(ordenCriterios),
    filtroDescripcion,
  ])

  useEffect(() => {
    if (!mostrarFiltroCategoria) {
      setFiltroDescripcion('')
    }
  },[mostrarFiltroCategoria])

  const paginacion = (
    <Paginacion
      pagina ={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )
  // Función para manejar filtros del componente FiltroCategoria
  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaEstadoCategoria}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          categoriaEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el categoria: ${titleCase(categoriaEdicion?.descripcion?? '')} ?`}
      >
        <Button onClick={cancelarAlertaEstadoCategoria}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoCategoria}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalCategoria}
        handleClose={cerrarModalCategoria}
        title={categoriaEdicion ? 'Editar categoria' : 'Nuevo categoria'}
      >
        <VistaModalCategoria
          categoria={categoriaEdicion}
          accionCorrecta={() => {
            cerrarModalCategoria().finally()
            obtenerCategoriaPeticion().finally()
          }}
          accionCancelar={cerrarModalCategoria}
        />
      </CustomDialog>
      <LayoutUser title={`Examen - ${siteName()}`}>
        <CustomDataTable
          titulo={'Examen'}
          error={!!errorCategoriaData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
          filtros={
            mostrarFiltroCategoria && (
              <FiltroCategoria
              filtroDescripcion={filtroDescripcion}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroDescripcion(filtros.descripcion)
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

export default Categoria
