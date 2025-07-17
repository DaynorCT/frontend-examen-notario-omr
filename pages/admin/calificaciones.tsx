import type { NextPage } from 'next'
import {
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Box,
  Divider,
  Paper, // <--- Agregado
  Alert, // <--- Agregado
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
import { CriterioOrdenType } from '../../common/types/ordenTypes'
import { ordenFiltrado } from '../../common/utils/orden'
import { BotonAgregar } from '../../common/components/ui/BotonAgregar'
import { imprimir } from '../../common/utils/imprimir'
import { ModalVerPDF } from '../../modules/admin/digitalizar/ui/ModalVerPDF'
import { ExamenGeneradoCRUDType } from '../../modules/admin/digitalizar/types/ExamenGeneradoCRUDTypes'
import React, {useRef} from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
const Calificar = () => {
  // data de exámenes generados
  const [examenGeneradoData, setExamenGeneradoData] = useState<ExamenGeneradoCRUDType[]>([])

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
  
  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'codigo', nombre: 'Código', ordenar: true },
    { campo: 'grupo', nombre: 'Grupo', ordenar: true },
    { campo: 'hojaSobre', nombre: 'Hoja Sobre', ordenar: true },
    { campo: 'hojaPreguntas', nombre: 'Hoja Preguntas', ordenar: true },
    { campo: 'hojaRespuesta', nombre: 'Hoja Respuesta', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = examenGeneradoData.map(
    (examenGenerado, indexExamenGenerado) => [
      <Typography
        key={`${examenGenerado.id}-${indexExamenGenerado}-codigo`}
        variant={'body2'}
      >
        {examenGenerado.codigo}
      </Typography>,
      <Typography
        key={`${examenGenerado.id}-${indexExamenGenerado}-grupo`}
        variant={'body2'}
      >
        {examenGenerado.grupo}
      </Typography>,
      <IconoTooltip
        key={`${examenGenerado.id}-${indexExamenGenerado}-hojaSobre`}
        id={`hojaSobre-${examenGenerado.id}`}
        titulo="Ver Hoja Sobre"
        color="info"
        accion={() => abrirPDFsobre(examenGenerado.id)}
        icono="contact_mail"
        name="hojaSobre"
      />,
      <Typography
        key={`${examenGenerado.id}-${indexExamenGenerado}-hojaPreguntas`}
        variant={'body2'}
      >
        {examenGenerado.hojaPreguntas}
      </Typography>,
      <IconoTooltip
        key={`${examenGenerado.id}-${indexExamenGenerado}-hojaRespuesta`}
        id={`hojaPregunta-${examenGenerado.id}`}
        titulo="Ver Hoja Respuesta"
        color="primary"
        accion={() => abrirPDF(examenGenerado.id)}
        icono="description"
        name="hojaRespuesta"
      />,
      <CustomMensajeEstado
        key={`${examenGenerado.id}-${indexExamenGenerado}-estado`}
        titulo={examenGenerado.estado}
        descripcion={examenGenerado.estado}
        color={
          examenGenerado.estado == 'COMPLETADO'
            ? 'success'
            : examenGenerado.estado == 'ERROR'
            ? 'error'
            : 'info'
        }
      />,
    ]
  )
  
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [archivos, setArchivos] = useState<File[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [mensajeSubida, setMensajeSubida] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null)

  // Handler para seleccionar archivos/carpeta
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    const imagenes = Array.from(files).filter(file =>
      file.type === 'image/png' || file.type === 'image/jpeg'
    )
    setArchivos(imagenes)
  }

  // Handler para drag & drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files).filter(file =>
      file.type === 'image/png' || file.type === 'image/jpeg'
    )
    setArchivos(files)
  }


  const subirArchivos = async () => {
    setSubiendo(true);
    setMensajeSubida(null);
    const formData = new FormData();
    archivos.forEach((img) => {
      formData.append('file', img);
    });
    try {
      await sesionPeticion({
        url: `${Constantes.baseUrl}/imagen/upload`,
        tipo: 'post',
        body: formData,
      });
      setMensajeSubida({ tipo: 'success', texto: 'Imágenes subidas correctamente' });
      setArchivos([]);
      obtenerExameGenePeticion();
    } catch (error) {
      setMensajeSubida({ tipo: 'error', texto: 'Error al subir imágenes' });
    } finally {
      setSubiendo(false);
    }
  };

  

  const agregarEvaluacionModal = async () => {
    try {
      // setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/generar`,
        tipo: 'post',
        body: {},
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerExameGenePeticion()
    } catch (e) {
      imprimir(`Error al Generar evaluación: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } 
  }

  const obtenerExameGenePeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
      })
      setExamenGeneradoData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorExamenGeneradoData(null)
    } catch (e) {
      imprimir(`Error al obtener parametros`, e)
      setErrorExamenGeneradoData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const abrirPDF = async (id: string) => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/${id}/pdf`,
        tipo: 'get',
      });
      // El backend devuelve un objeto con base64 en respuesta.datos
      if (respuesta?.datos?.base64) {
        // Convertir base64 a data URL
        const dataUrl = `data:application/pdf;base64,${respuesta.datos.base64}`;
        setPdfUrl(dataUrl);
        setOpenDialog(true);
      } else {
        throw new Error('No se recibió el contenido del PDF');
      }
    } catch (e: any) {
      let mensajeError = 'Error al abrir el PDF'
    
      Alerta({ mensaje: mensajeError, variant: 'error' })
    }
  }
  
  const abrirPDFsobre = async (id: string) => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/${id}/sobre`,
        tipo: 'get',
      });
      // El backend devuelve un objeto con base64 en respuesta.datos
      if (respuesta?.datos?.base64) {
        // Convertir base64 a data URL
        const dataUrl = `data:application/pdf;base64,${respuesta.datos.base64}`;
        setPdfUrl(dataUrl);
        setOpenDialog(true);
      } else {
        throw new Error('No se recibió el contenido del PDF');
      }
    } catch (e: any) {
      let mensajeError = 'Error al abrir el PDF'
    
      Alerta({ mensaje: mensajeError, variant: 'error' })
    }
  }

 
  useEffect(() => {
    if (estaAutenticado) obtenerExameGenePeticion().finally(() => {})   
  },[
    estaAutenticado,
    pagina,
    limite,
    // eslint-disble-nest-line react-ooks/exaustive-deps
    JSON.stringify(ordenCriterios)
  ])

  // const ordenCriteriosString = JSON.stringify(ordenCriterios)
  // useEffect(() => {
  //   if (estaAutenticado) obtenerExameGenePeticion().finally(() => {})   
  // }, [
  //   estaAutenticado,
  //   pagina,
  //   limite,
  //   ordenCriteriosString,
  //   obtenerExameGenePeticion
  // ])

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
          // Limpiar la URL para evitar memory leaks
          setPdfUrl(null);
        }}
      />
<LayoutUser title={`Calificaciones - ${siteName()}`}>
  <Typography variant="h5" mb={2}>Calificaciones</Typography>
  <Box
    display="flex"
    flexDirection={{ xs: 'column', md: 'row' }}
    alignItems="flex-start"
    gap={3}
    mb={3}
  >
    {/* Área de subida */}
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: 340,
        minHeight: 180,
        bgcolor: '#f5faff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: { xs: 2, md: 0 }
      }}
    >
      <Box
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        sx={{
          border: '2.5px dashed #1976d2',
          borderRadius: 2,
          p: 2,
          width: '100%',
          minHeight: 100,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: 'inherit'
        }}
        onClick={() => inputFileRef.current?.click()}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          multiple
          ref={inputFileRef}
          onChange={handleFileChange}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
        <Typography fontWeight={600} color="#1976d2">
          Subir imágenes o carpeta
        </Typography>
        <Typography variant="caption" color="text.secondary" mb={1}>
          Arrastra aquí o haz click para seleccionar<br />
          (JPG o PNG, puedes subir una carpeta completa)
        </Typography>
      </Box>
      {archivos.length > 0 && (
        <List dense sx={{ mt: 1, maxHeight: 90, overflow: 'auto', width: '100%' }}>
          {archivos.map((file, idx) => (
            <ListItem
              key={file.name + idx}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={e => {
                  e.stopPropagation()
                  setArchivos(archivos.filter((_, i) => i !== idx))
                }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={subirArchivos}
        disabled={archivos.length === 0 || subiendo}
        sx={{ mt: 2, width: '100%' }}
      >
        {subiendo ? <CircularProgress size={24} /> : 'Subir imágenes'}
      </Button>
      {mensajeSubida && (
        <Alert severity={mensajeSubida.tipo} sx={{ mt: 2, width: '100%' }}>
          {mensajeSubida.texto}
        </Alert>
      )}
    </Paper>
    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
    {/* Contenedor de tabla y acciones */}
    <Box sx={{ flex: 1, width: '100%' }}>
      {/* Botones de acción */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
        <BotonAgregar
          id={'agregarExamenGenerado'}
          key={'agregarExamenGenerado'}
          texto={'Generar reporte de calificaciones'}
          descripcion={'Generar'}
          accion={() => {
            agregarEvaluacionModal()
          }}
        />
        <IconoTooltip
          id={'actualizarExamenGenerado'}
          titulo={'Actualizar lista'}
          key={`accionActualizarExamenGenerado`}
          accion={async () => {
            await obtenerExameGenePeticion()
          }}
          icono={'refresh'}
          name={'Actualizar lista de exámenes'}
        />
      </Box>
      <CustomDataTable
        error={!!errorExamenGeneradoData}
        cargando={loading}
        acciones={[]}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
      />
    </Box>
  </Box>
</LayoutUser>
    </>
  )
}


export default Calificar