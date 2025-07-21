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
import { imprimir } from '../../common/utils/imprimir'
import { PreguntaCRUDType } from '../../modules/admin/preguntas/types/preguntasCRUDTypes'
import { CategoriaCRUDType } from '../../modules/admin/categoria/types/categoriaCRUDTypes'
import Checkbox from '@mui/material/Checkbox'
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
  const [errorPreguntaData, setErrorPeguntaData] = useState<any>()


  // Variables de paginado
  const [limite, setLimite] = useState<number>(30)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Estado para IDs de preguntas seleccionadas
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<string[]>([])
  // Estado para mostrar solo seleccionadas
  const [mostrarSoloSeleccionadas, setMostrarSoloSeleccionadas] = useState(false)
  // Estado para preguntas seleccionadas del backend
  const [preguntasSeleccionadasBackend, setPreguntasSeleccionadasBackend] = useState<PreguntaCRUDType[]>([]);

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
    { campo: 'seleccionar', nombre: '', ordenar: false },
    { campo: 'nro', nombre: 'N°', ordenar: false },
    { campo: 'descripcion', nombre: 'Pregunta', ordenar: true },
    { campo: 'opciones', nombre: 'Opciones', ordenar: false },
    { campo: 'categoria', nombre: 'Categoría', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
  ])

  /// Contenido del data table
  const preguntasParaMostrar = mostrarSoloSeleccionadas
    ? preguntasSeleccionadasBackend
    : preguntasData

  const contenidoTabla: Array<Array<ReactNode>> = preguntasParaMostrar.map(
    (preguntasData, indexPreguntas) => [
      // Checkbox de selección
      <Checkbox
        key={`checkbox-${preguntasData.id}`}
        checked={preguntasSeleccionadas.includes(preguntasData.id ?? '')}
        onChange={async e => {
          const id = preguntasData.id ?? '';
          if (!id) return;
          if (e.target.checked) {
            await seleccionarPregunta(id); // Llama al backend
            setPreguntasSeleccionadas(prev => [...prev, id]);
          } else {
            await desmarcarPregunta(id); // Llama al backend
            setPreguntasSeleccionadas(prev => prev.filter(pid => pid !== id));
          }
        }}
        color="primary"
      />,
      <Typography
        key={`${preguntasData.id}-${indexPreguntas}-nro`}
        variant={'body2'}
      >
        {(pagina - 1) * limite + indexPreguntas + 1}
      </Typography>,
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
    ]
  )

  // Acciones de la tabla
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  const acciones: Array<ReactNode> = [
    <TextField
      select
      label="Selecciona una categoría"
      value={categoriaSeleccionada}
      onChange={(e) => {
        setCategoriaSeleccionada(e.target.value)
        setPagina(1) // Opcional: reinicia a la primera página
      }}
      sx={{ width: 250, mt: 2, mb: 2 }}
      key="dropdown-categoria"
    >
      <MenuItem value="">
        <em>Todas las categorías</em>
      </MenuItem>
      {categoriaData.map((cat) => (
        <MenuItem key={cat.id} value={cat.id}>
          {cat.descripcion}
        </MenuItem>
      ))}
    </TextField>,
    <Button
      key="ver-seleccionadas"
      variant={mostrarSoloSeleccionadas ? 'outlined' : 'contained'}
      color="secondary"
      sx={{ ml: 2, mt: 2, mb: 2 }}
      disabled={preguntasSeleccionadas.length === 0}
      onClick={async () => {
        if (!mostrarSoloSeleccionadas) {
          await obtenerPreguntasSeleccionadas();
        }
        setMostrarSoloSeleccionadas(!mostrarSoloSeleccionadas);
      }}
    >
      {mostrarSoloSeleccionadas ? 'Ver todas' : 'Ver seleccionadas'}
    </Button>,
  ];

  // Función para marcar pregunta como seleccionada
  const seleccionarPregunta = async (id: string) => {
    await sesionPeticion({
      url: `${Constantes.baseUrl}/preguntas/${id}/seleccionar`,
      tipo: 'patch',
    });
  };

  // Función para desmarcar pregunta como seleccionada
  const desmarcarPregunta = async (id: string) => {
    await sesionPeticion({
      url: `${Constantes.baseUrl}/preguntas/${id}/deseleccionar`,
      tipo: 'patch',
    });
  };
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

    // Petición para obtener preguntas seleccionados del backend
  const obtenerPreguntasSeleccionadas = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas/seleccionadas`,
        params: {
          pagina,
          limite,
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
        tipo: 'get',
      })
      setPreguntasSeleccionadasBackend(respuesta.datos?.filas || respuesta.datos || [])
      setPreguntasSeleccionadas(
        (respuesta.datos?.filas || respuesta.datos || []).map((p: any) => p.id)
      )
      setErrorPreguntasData(null)
    } catch (e) {
      imprimir(`Error al obtener preguntas seleccionadas`, e)
      setErrorPreguntasData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

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
      setErrorPeguntaData(null)
    } catch (e) {
      imprimir(`Error al obtener parametros`, e)
      setErrorPeguntaData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
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
    categoriaSeleccionada,
  ])

  useEffect(() => {
    if (estaAutenticado) obtenerCategoriaPeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    JSON.stringify(ordenCriterios),
  ])
  
  useEffect(() => {
    if (estaAutenticado) {
      obtenerPreguntasPeticion().finally(() => {});
      obtenerPreguntasSeleccionadas().finally(() => {});
    }
  }, [
    estaAutenticado,
    pagina,
    limite,
    JSON.stringify(ordenCriterios),
    categoriaSeleccionada,
  ]);

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
      <LayoutUser title={`Elegir Preguntas - ${siteName()}`}> 
        <CustomDataTable
          titulo={'Elegir Preguntas'}
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
