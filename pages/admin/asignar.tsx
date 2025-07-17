import type { NextPage } from 'next'
import {
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  Button,
  Box,
  TextField,
} from '@mui/material'
import { LayoutUser } from '../../common/components/layouts'
import {
  CustomDataTable,
  IconoTooltip,
} from '../../common/components/ui'
import { ReactNode, useEffect, useState } from 'react'
import { CasbinTypes } from '../../common/types'
import { Constantes } from '../../config'
import {
  InterpreteMensajes,
  siteName,
} from '../../common/utils'
import { useAuth } from '../../context/auth'
import { Paginacion } from '../../common/components/ui/Paginacion'
import { useRouter } from 'next/router'
import { useAlerts, useSession } from '../../common/hooks'
import CustomMensajeEstado from '../../common/components/ui/CustomMensajeEstado'
import { BotonOrdenar } from '../../common/components/ui/BotonOrdenar'
import { CriterioOrdenType } from '../../common/types/ordenTypes'
import { ordenFiltrado } from '../../common/utils/orden'
import { imprimir } from '../../common/utils/imprimir'
import { ModalVerPDF } from '../../modules/admin/digitalizar/ui/ModalVerPDF'
import { ExamenGeneradoCRUDType } from '../../modules/admin/digitalizar/types/ExamenGeneradoCRUDTypes'
import { Autocomplete } from '@mui/material'
import { AsignarPostulantePayload, CodigoExamenType, PostulanteCodigoCRUDType, PostulanteSelectType } from '../../modules/admin/asignar/types/asignarCRUDTypes'

const Asignar: NextPage = () => {
  // data de exámenes generados
  const [examenGeneradoData, setExamenGeneradoData] = useState<ExamenGeneradoCRUDType[]>([])
  const [postulanteCodigoData, setPostulanteCodigoData] = useState<PostulanteCodigoCRUDType[]>([])
  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  /// Indicador de error en una petición
  const [errorExamenGeneradoData, setErrorExamenGeneradoData] = useState<any>()

  /// Indicador para mostrar una ventana modal de examen generado
  const [ ] = useState(false)

  //Indicador para abrir el pdf ModalPDF
  const [openDialog, setOpenDialog] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  //variable que contiene el estado del examen que está editando
  const [] = useState<ExamenGeneradoCRUDType | undefined | null >()
  
  // cargar los ci y los postulantes
  const [postulantes, setPostulantes] = useState<PostulanteSelectType[]>([])
  const [codigosExamen, setCodigosExamen] = useState<CodigoExamenType[]>([])


  // Variables de paginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()
  const { estaAutenticado } = useAuth()

  // Permisos para acciones
  const [ ] = useState<CasbinTypes>({
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
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nombre', nombre: 'Nombre Completo', ordenar: true },
    { campo: 'ci', nombre: 'C.I', ordenar: true },
    { campo: 'codigo', nombre: 'Codigo Examen', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = postulanteCodigoData.map(
    (postulanteCodigo, indexPostulanteCodigo) => [
      <Typography
        key={`${postulanteCodigo.nombrecompleto}-${indexPostulanteCodigo}-nombre`}
        variant={'body2'}
      >
        {postulanteCodigo.nombrecompleto}
      </Typography>,
      <Typography
        key={`${postulanteCodigo.ci}-${indexPostulanteCodigo}-ci`}
        variant={'body2'}
      >
        {postulanteCodigo.ci}
      </Typography>,
      <Typography
        key={`${postulanteCodigo.codigo}-${indexPostulanteCodigo}-codigo`}
        variant={'body2'}
      >
        {postulanteCodigo.codigo}
      </Typography>,
      <CustomMensajeEstado
        key={`${postulanteCodigo.estado}-${indexPostulanteCodigo}-estado`}
        titulo={postulanteCodigo.estado}
        descripcion={postulanteCodigo.estado}
        color={
          postulanteCodigo.estado == 'ACTIVO'
            ? 'success'
            : postulanteCodigo.estado == 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,
    ]
  )
  
  const acciones: Array<ReactNode> = [
    xs && (
      <BotonOrdenar
        id={'ordenarExamenGenerado'}
        key={`ordenarExamenGenerado`}
        label={'Ordenar exámenes'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
  ]
  
 const obtenerPostulanteCiCodPeticion = async () => {
  try {
    setLoading(true);

    const respuesta = await sesionPeticion({
      url: `${Constantes.baseUrl}/examen-generado/listar-ci-codigo`,
      params: {
        pagina: pagina,
        limite: limite,
        ...(ordenFiltrado(ordenCriterios).length > 0
          ? { orden: ordenFiltrado(ordenCriterios).join(',') }
          : {}),
      },
    });

    setPostulanteCodigoData(respuesta.datos?.filas || []);
    setTotal(respuesta.datos?.total || 0);
    setErrorExamenGeneradoData(null);
  } catch (e) {
    imprimir(`Error al obtener parametros`, e);
    setErrorExamenGeneradoData(e);
    Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' });
  } finally {
    setLoading(false);
  }
 }
  const obtenerCiPostulante= async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/listar-ci-postulante`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
      })
      let filas = respuesta.datos?.filas;
      if (!Array.isArray(filas)) {
        filas = filas ? [filas] : [];
      }
      setPostulantes(filas);
      console.log('postulantes:', filas);
      setTotal(respuesta.datos?.total)
      setErrorExamenGeneradoData(null)
    } catch (e) {
      imprimir(`Error al obtener los CI de los postulantes`, e)
      setErrorExamenGeneradoData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const obtenerCodExamen= async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/listar-cod-examen`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
      })
      let filas = respuesta.datos?.filas;
      if (!Array.isArray(filas)) {
        filas = filas ? [filas] : [];
      }
      setCodigosExamen(filas);
      setTotal(respuesta.datos?.total)
      setErrorExamenGeneradoData(null)
    } catch (e) {
      imprimir(`Error al obtener los Codigos Examen`, e)
      setErrorExamenGeneradoData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }
  // Seleccionados
  const [ciSeleccionado, setCiSeleccionado] = useState('')
  const [codigoExamenSeleccionado, setCodigoExamenSeleccionado] = useState('')
  // Asignaciones locales
  const [asignaciones, setAsignaciones] = useState<{ci: string, codigo: string}[]>([])

  // Handler para asignar
  const handleAsignar = async () => {
    if (!ciSeleccionado || !codigoExamenSeleccionado) {
      Alerta({ mensaje: 'Seleccione CI y Código de Examen', variant: 'warning' })
      return
    }
    // Buscar el objeto postulante y examen por el valor seleccionado
    const postulante = postulantes.find(p => p.ci === ciSeleccionado);
    const examen = codigosExamen.find(e => e.codigo === codigoExamenSeleccionado);

    if (!postulante || !examen) {
      Alerta({ mensaje: 'Error al encontrar los datos seleccionados', variant: 'error' })
      return
    }

    const payload: AsignarPostulantePayload = {
      id: examen.id,           // id del examen seleccionado
      idPostulante: postulante.id // id del postulante seleccionado
    };

    try {
      await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/asignar-postulante`,
        tipo: 'post',
        body: payload
      });
      Alerta({ mensaje: 'Asignación realizada con éxito', variant: 'success' });
      setCiSeleccionado('');
      setCodigoExamenSeleccionado('');
      await obtenerPostulanteCiCodPeticion();
      await obtenerCiPostulante()
      await  obtenerCodExamen()// Recargar la tabla automáticamente
    } catch (e) {
      Alerta({ mensaje: 'Error al asignar', variant: 'error' });
    }
  }

  useEffect(() => {
    if (estaAutenticado) obtenerCiPostulante().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    // eslint-disble-nest-line react-ooks/exaustive-deps
    JSON.stringify(ordenCriterios)
  ])
  
  useEffect(() => {
    if (estaAutenticado) obtenerCodExamen().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    // eslint-disble-nest-line react-ooks/exaustive-deps
    JSON.stringify(ordenCriterios)
  ])

  useEffect(() => {
    if (estaAutenticado)obtenerPostulanteCiCodPeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    // eslint-disble-nest-line react-ooks/exaustive-deps
    JSON.stringify(ordenCriterios)
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
      {/* Modal para ver PDF */}
      <ModalVerPDF
        open={openDialog}
        pdfUrl={pdfUrl}
        onClose={() => {
          setOpenDialog(false);
          setPdfUrl(null);
        }}
      />
      <LayoutUser title={`Asignar - ${siteName()}`}>
        {/* Título principal */}
        <Typography variant="h5" mb={2}>Asignar</Typography>
        {/* Formulario de asignación */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          {/* Autocomplete para CI */}
          <FormControl sx={{ minWidth: 220 }} size="small">
            <Autocomplete
              id="ci-autocomplete"
              options={postulantes}
              getOptionLabel={option => `${option.ci}`}
              value={postulantes.find(p => p.ci === ciSeleccionado) || null}
              onChange={(_, newValue) => setCiSeleccionado(newValue ? newValue.ci : '')}
              renderInput={(params) => (
                <TextField {...params} label="CI" size="small" />
              )}
              isOptionEqualToValue={(option, value) => option.ci === value.ci}
              clearOnEscape
            />
          </FormControl>
          {/* Autocomplete para Código de Examen */}
          <FormControl sx={{ minWidth: 220 }} size="small">
            <Autocomplete
              id="cod-examen-autocomplete"
              options={codigosExamen}
              getOptionLabel={option => `${option.codigo}`}
              value={codigosExamen.find(e => e.codigo === codigoExamenSeleccionado) || null}
              onChange={(_, newValue) => setCodigoExamenSeleccionado(newValue ? newValue.codigo || '' : '')}
              renderInput={(params) => (
                <TextField {...params} label="Código Examen" size="small" />
              )}
              isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
              clearOnEscape
            />
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleAsignar}>
            Asignar
          </Button>
          <IconoTooltip
              id={'actualizarExamenGenerado'}
              titulo={'Actualizar'}
              key={`accionActualizarExamenGenerado`}
              accion={async () => {
                await obtenerCiPostulante()
                await obtenerCodExamen()
                await obtenerPostulanteCiCodPeticion() // <-- AGREGAR ESTA LÍNEA
              }}
              icono={'refresh'}
              name={'Actualizar lista de exámenes'}
            />
        </Box>
        {/* Tabla de asignaciones */}
        {asignaciones.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" mb={1}>Asignaciones realizadas</Typography>
            <CustomDataTable
              titulo="Asignaciones"
              columnas={[
                { campo: 'ci', nombre: 'C.I', ordenar: false },
                { campo: 'codigo', nombre: 'Cod Examen', ordenar: false },
              ]}
              contenidoTabla={asignaciones.map((a, i) => [
                <Typography key={`ci-${i}`}>{a.ci}</Typography>,
                <Typography key={`cod-${i}`}>{a.codigo}</Typography>,
              ])}
              cargando={false}
              acciones={[]}
              error={false}
            />
          </Box>
        )}
        {/* Tabla original */}
        <CustomDataTable
          titulo={''}
          error={!!errorExamenGeneradoData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
        />
      </LayoutUser>
    </>
  );
}

export default Asignar 
