import type { NextPage } from 'next'
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  MenuItem,
  Box,
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
import { CriterioOrdenType } from '../../common/types/ordenTypes'
import { ordenFiltrado } from '../../common/utils/orden'
import { BotonAgregar } from '../../common/components/ui/BotonAgregar'
import { imprimir } from '../../common/utils/imprimir'
import { VistaModalPregunta } from '../../modules/admin/preguntas/ui'
import { PreguntaCRUDType } from '../../modules/admin/preguntas/types/preguntasCRUDTypes'
import { CategoriaCRUDType } from '../../modules/admin/categoria/types/categoriaCRUDTypes'
const Preguntas: NextPage = () => {
  // data de preguntas
  const [preguntasData, setPreguntasData] = useState<PreguntaCRUDType[]>([])

  const [categoriaData, setCategoriaData] = useState<CategoriaCRUDType[]>([]);

  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  /// Indicador de error en una petición
  const [errorPreguntasData, setErrorPreguntasData] = useState<any>()

    /// Indicador de error en una peticionc ategoria
    const [errorCategoriaData, setErrorCategoriaData] = useState<any>()

  /// Indicador para mostrar una ventana modal de preguntas
  const [modalPreguntas, setModalPreguntas] = useState(false)

  // variable que contiene la pregunta que está editando
  const [preguntaEdicion, setPreguntaEdicion] = useState<PreguntaCRUDType | undefined | null>()

  // Variables de paginado
  const [limite, setLimite] = useState<number>(20)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

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

  // router para conocer la ruta actual
  const router = useRouter()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<Array<CriterioOrdenType>>([
    { campo: 'descripcion', nombre: 'Pregunta', ordenar: true },
    { campo: 'opciones', nombre: 'Opciones', ordenar: false },
    { campo: 'categoria', nombre: 'Categoría', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = preguntasData.map(
    (preguntasData, indexPreguntas) => [
      // Pregunta
      <Typography key={`${preguntasData.id}-${indexPreguntas}-descripcion`} variant={'body2'}>
        {preguntasData.descripcion}
      </Typography>,

      // Opciones
      <Box key={`${preguntasData.id}-${indexPreguntas}-opciones`}>
        {(preguntasData.opciones || []).map((op, idx) => (
          <Typography
            key={op.id}
            variant="body2"
            color={op.correcto ? 'success.main' : undefined}
          >
            {String.fromCharCode(97 + idx)}) {op.descripcion}
            {op.correcto && ' ✔'}
          </Typography>
        ))}
      </Box>,

      // Categoría
      <Typography key={`${preguntasData.id}-${indexPreguntas}-categoria`} variant={'body2'}>
        {preguntasData.categoria?.descripcion || preguntasData.categoriaDescripcion || preguntasData.idCategoria || ''}
      </Typography>,

      // Estado
      <CustomMensajeEstado
        key={`${preguntasData.id}-${indexPreguntas}-estado`}
        titulo={preguntasData.estado}
        descripcion={preguntasData.estado}
        color={
          preguntasData.estado === 'ACTIVO'
            ? 'success'
            : preguntasData.estado === 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,

      // Acciones
      <Grid key={`${preguntasData.id}-acciones`}>
        {permisos.update && (
          <IconoTooltip
            id={`editarPregunta-${preguntasData.id}`}
            name={'Editar'}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, preguntasData)
              editarPreguntaModal(preguntasData)
            }}
            icono={'edit'}
          />
        )}
      </Grid>,
    ]
  )

  // Acciones de la tabla
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const acciones: Array<ReactNode> = [
    <TextField
      select
      label="Selecciona una categoría"
      value={categoriaSeleccionada}
      onChange={e => {
        setCategoriaSeleccionada(e.target.value);
        setPagina(1); // Opcional: reinicia a la primera página
        obtenerPreguntasPeticion(); // Llama a la función de filtrado
      }}
      sx={{ width: 250, mt: 2, mb: 2 }}
      key="dropdown-categoria"
    >
      {categoriaData.map(cat => (
        <MenuItem key={cat.id} value={cat.id}>
          {cat.descripcion}
        </MenuItem>
      ))}
    </TextField>,
    permisos.create && (
      <BotonAgregar
        id={'agregarPregunta'}
        key={'agregarPregunta'}
        texto={'Agregar Preguntas'}
        descripcion={'Agregar pregunta'}
        accion={() => {
          agregarPreguntaModal()
        }}
      />
    ),
  ];

  // Petición para obtener preguntas
  const obtenerPreguntasPeticion = async () => {
    try {
      setLoading(true);
      const params: any = {
        pagina,
        limite,
        ...(ordenFiltrado(ordenCriterios).length > 0
          ? { orden: ordenFiltrado(ordenCriterios).join(',') }
          : {}),
      };
      if (categoriaSeleccionada) {
        params.idCategoria = categoriaSeleccionada;
      }
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas/con-opciones`,
        params,
      });
      setPreguntasData(respuesta.datos?.filas);
      setTotal(respuesta.datos?.total);
      setErrorPreguntasData(null);
    } catch (e) {
      imprimir(`Error al obtener preguntas`, e);
      setErrorPreguntasData(e);
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Petición para obtener Categorias
  const obtenerCategoriaPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria`,
        params: {
          pagina: pagina,
          limite: limite,
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

  // Función para agregar pregunta
  const agregarPreguntaModal = () => {
    setPreguntaEdicion(undefined)
    setModalPreguntas(true)
  }

  // Función para editar pregunta
  const editarPreguntaModal = (pregunta: PreguntaCRUDType) => {
    setPreguntaEdicion(pregunta)
    setModalPreguntas(true)
  }

  // Función para cerrar modal
  const cerrarModalPreguntas = async () => {
    setModalPreguntas(false)
    await delay(500)
    setPreguntaEdicion(undefined)
  }

  // Función para definir permisos
  const definirPermisos = async () => {
    setPermisos(await permisoUsuario(router.pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
  }, [estaAutenticado])

  useEffect(() => {
    if (estaAutenticado) obtenerPreguntasPeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    JSON.stringify(ordenCriterios),
  ])

  useEffect(() => {
    if (estaAutenticado) obtenerCategoriaPeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    JSON.stringify(ordenCriterios),
  ])


  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )
  return (
    <>
      <CustomDialog
        isOpen={modalPreguntas}
        handleClose={cerrarModalPreguntas}
        title={preguntaEdicion ? 'Editar pregunta' : 'Nueva pregunta'}
      >
        <VistaModalPregunta
          categorias={categoriaData}
          pregunta={preguntaEdicion ? {
            id:preguntaEdicion.id,
            idCategoria: preguntaEdicion.idCategoria,
            descripcion: preguntaEdicion.descripcion,
            opciones: (preguntaEdicion.opciones || []).map(op => ({
              id: op.id,
              descripcion: op.descripcion,
              correcto: op.correcto
            })),
          } : undefined}
          accionCorrecta={() => {
            cerrarModalPreguntas().finally()
            obtenerPreguntasPeticion().finally()
          }}
          accionCancelar={cerrarModalPreguntas}
        />
      </CustomDialog>
      <LayoutUser title={`Preguntas - ${siteName()}`}> 
        <CustomDataTable
          titulo={'Preguntas'}
          error={!!errorPreguntasData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
        />
      </LayoutUser>
    </>
  )
}

export default Preguntas 
