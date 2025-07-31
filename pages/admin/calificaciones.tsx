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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { ExamenGeneradoCRUDType } from '../../modules/admin/digitalizar/types/ExamenGeneradoCRUDTypes'
import { ModalVerPDF } from '../../modules/admin/calificaciones/ui/ModalVerPDF'
import React, {useRef} from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { PostulanteConPuntajeType } from '../../modules/admin/calificaciones/types/calificacionesCRUDTypes'
const Calificar = () => {
  // data de exámenes generados
  const [notasPostulanteData, setNotaPostulanteData] = useState<PostulanteConPuntajeType[]>([])

  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  /// Indicador de error en una petición
  const [errorNoatasPostulanteData, setErrorNotasPostulanteData] = useState<any>()

  /// Indicador para mostrar una ventana modal de examen generado
  const [ ] = useState(false)

  //Indicador para abrir el pdf ModalPDF
  const [openDialog, setOpenDialog] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  //variable que contiene el estado del examen que está editando
  const [] = useState<ExamenGeneradoCRUDType | undefined | null >()
  
  // Variables de paginado
  const [limite, setLimite] = useState<number>(30)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Nuevos estados para los reportes
  const [openEstadoImagenes, setOpenEstadoImagenes] = useState(false)
  const [estadoImagenes, setEstadoImagenes] = useState<any[]>([])
  const [loadingEstadoImagenes, setLoadingEstadoImagenes] = useState(false)
  const [loadingReporte, setLoadingReporte] = useState(false)
  const [loadingReporteNombreCINota, setLoadingReporteNombreCINota] = useState(false)

  // Nuevos estados para los reportes HTML
  const [openReporteCINota, setOpenReporteCINota] = useState(false)
  const [openReporteNombreCINota, setOpenReporteNombreCINota] = useState(false)
  const [reporteHTML, setReporteHTML] = useState<string>('')
  const [reporteNombreCINotaHTML, setReporteNombreCINotaHTML] = useState<string>('')

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
    { campo: 'nombrecompleto', nombre: 'Nombre Completo', ordenar: true },
    { campo: 'ci', nombre: 'C.I', ordenar: true },
    { campo: 'puntaje', nombre: 'Puntaje', ordenar: true },
    { campo: 'puntajeformateado', nombre: 'nota/total', ordenar: true },
    { campo: 'codigo', nombre: 'Codigo Examen', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'rutaimagen', nombre: 'Imagen', ordenar: true },
    { campo: 'hojarespuestapintada', nombre: 'PDF Pintado', ordenar: true },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = notasPostulanteData.map(
    (notasPostulante, indexNotasPostulante) => [
      <Typography
        key={`${notasPostulante.id}-${indexNotasPostulante}-nombrecompleto`}
        variant={'body2'}
      >
        {notasPostulante.nombrecompleto}
      </Typography>,
      <Typography
        key={`${notasPostulante.id}-${indexNotasPostulante}-ci`}
        variant={'body2'}
      >
        {notasPostulante.ci}
      </Typography>,
      <Typography
        key={`${notasPostulante.id}-${indexNotasPostulante}-puntaje`}
        variant={'body2'}
      >
        {notasPostulante.puntaje}
      </Typography>,
       <Typography
       key={`${notasPostulante.id}-${indexNotasPostulante}-puntajeformateado`}
       variant={'body2'}
     >
       {notasPostulante.puntajeformateado}
     </Typography>,
      <Typography
      key={`${notasPostulante.id}-${indexNotasPostulante}-codigo`}
      variant={'body2'}
    >
      {notasPostulante.codigo}
    </Typography>,
      <CustomMensajeEstado
        key={`${notasPostulante.id}-${indexNotasPostulante}-estado`}
        titulo={notasPostulante.estado}
        descripcion={notasPostulante.estado}
        color={
          notasPostulante.estado == 'ACTIVO'
            ? 'success'
            : notasPostulante.estado == 'INACTIVO'
            ? 'error'
            : 'info'
        }
      />,
      <IconoTooltip
        key={`${notasPostulante.id}-${indexNotasPostulante}-rutaimagen`}
        id={`hojaPregunta-${notasPostulante.id}`}
        titulo="Ver Imagen"
        color="primary"
        accion={() => notasPostulante.rutaimagen ? verImagenesPorHash(notasPostulante.rutaimagen) : null}
        icono="image"
        name="verImagen"
      />,
      <IconoTooltip
      key={`${notasPostulante.id}-${indexNotasPostulante}-hojarespuestapintada`}
      id={`acciones-${notasPostulante.id}`}
      titulo="Ver PDF Pintado"
      color="primary"
      accion={() => verPDFPintado(notasPostulante.idexamen)}
      icono="description"
      name="verPDFPintado"
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
      obtenerCalificacionesPeticion();
    } catch (error) {
      setMensajeSubida({ tipo: 'error', texto: 'Error al subir imágenes' });
    } finally {
      setSubiendo(false);
    }
  };

 
  const obtenerCalificacionesPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/postulante/con-puntaje`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(ordenFiltrado(ordenCriterios).length > 0
            ? { orden: ordenFiltrado(ordenCriterios).join(',') }
            : {}),
        },
      })
      setNotaPostulanteData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorNotasPostulanteData(null)
    } catch (e) {
      imprimir(`Error al obtener parametros`, e)
      setErrorNotasPostulanteData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Para ver imágenes por hash
  const verImagenesPorHash = async (rutaimagen: string | null) => {
    try {
      if (!rutaimagen) {
        Alerta({ mensaje: 'No hay imagen disponible', variant: 'warning' })
        return
      }
      
      // Usar el endpoint de imagen por ruta
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/imagen/file`,
        tipo: 'get',
        params: { ruta: rutaimagen },
      });
      // El backend devuelve un objeto con base64 en respuesta.datos
      if (respuesta?.datos?.base64) {
        // Convertir base64 a data URL usando el mimeType del backend
        const mimeType = respuesta.datos.mimeType || 'image/jpeg'
        const dataUrl = `data:${mimeType};base64,${respuesta.datos.base64}`;
        setPdfUrl(dataUrl);
        setOpenDialog(true);
      } else {
        throw new Error('No se recibió el contenido de la imagen');
      }
    } catch (e: any) {
      let mensajeError = 'Error al abrir la imagen'
    
      Alerta({ mensaje: mensajeError, variant: 'error' })
    }
  }
  
  // Para ver PDF pintado directamente
  const verPDFPintado = async (idexamen: string) => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/${idexamen}/pdf-pintado`,
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

  // Función para obtener estado de imágenes
  const obtenerEstadoImagenes = async () => {
    try {
      setLoadingEstadoImagenes(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/imagen/estado-imagenes`,
        tipo: 'get',
      })
      
      // Verificar diferentes estructuras posibles de respuesta
      const datos = respuesta.datos?.filas || respuesta.datos || respuesta
      
      setEstadoImagenes(Array.isArray(datos) ? datos : [])
      setOpenEstadoImagenes(true)
    } catch (e: any) {
      Alerta({ mensaje: `Error al obtener estado de imágenes: ${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingEstadoImagenes(false)
    }
  }

  // Plantilla HTML para reportes
  const plantillaReporte = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{TITULO}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:ital,wght@0,400;0,700;1,400&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            background: white;
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
        }
        
        .report-container {
            max-width: 215.9mm;
            width: 215.9mm;
            height: 279.4mm;
            margin: 0 auto;
            background: white;
            padding: 15mm;
            border: 1px solid #000;
            box-sizing: border-box;
            position: relative;
        }
        
        /* HEADER OFICIAL */
        .official-header {
            display: flex;
            flex-direction: row !important;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            width: 100%;
            position: relative;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            width: 150px;
        }
        
        .official-logo {
            width: 150px;
            height: 150px;
            object-fit: contain;
        }
        
        .header-center {
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 20px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
        }
        
        .main-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
            white-space: normal;
            line-height: 1.3;
            letter-spacing: 1px;
            text-align: center;
            width: 100%;
            word-wrap: break-word;
        }
        
        .subtitle {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        
        .report-date {
            font-size: 12px;
            margin-top: 10px;
            font-weight: bold;
        }
        
        /* TABLA DE DATOS */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .data-table th {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            border: 1px solid #000;
            padding: 8px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .data-table td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: center;
            font-size: 11px;
            vertical-align: middle;
        }
        
        .data-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .data-table tr:nth-child(odd) {
            background-color: #ffffff;
        }
        
        .data-table tr:hover {
            background-color: #e3f2fd;
        }
        
        /* PRINT STYLES */
        @media print {
            body {
                background: white;
            }
            
            .report-container {
                box-shadow: none;
                margin: 0;
                border: none;
            }
            
            .data-table th {
                background: #2c3e50 !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }
        
        /* RESPONSIVE */
        @media (max-width: 768px) {
            .report-container {
                margin: 10px;
                padding: 15px;
            }
            
            .main-title {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <!-- HEADER OFICIAL -->
        <div class="official-header">
            <div class="header-left">
                <img src="{{LOGO_URL}}" alt="Logo" class="official-logo">
            </div>
            <div class="header-center">
                <div class="main-title">PROCESO DE SELECCIÓN Y DESIGNACIÓN
                                         DE SUMARIANTES DISCIPLINARIOS</div>
                <div class="subtitle">{{SUBTITULO}}</div>
                <div class="report-date">1 de Agosto de 2025</div>
            </div>
        </div>
        
        <!-- TABLA DE DATOS -->
        <table class="data-table">
            <thead>
                <tr>
                    {{ENCABEZADOS_TABLA}}
                </tr>
            </thead>
            <tbody>
                {{DATOS_TABLA}}
            </tbody>
        </table>
    </div>
</body>
</html>
`

  // Función para generar reporte CI y Nota
  const generarReporteCINota = (postulantes: any[], meta: any) => {
    const encabezados = '<th>CI</th><th>NOTA</th>'
    const filas = postulantes.map((item: any, index: number) => {
      const nota = item.nota !== undefined && item.nota !== null ? item.nota : (item.puntaje !== undefined && item.puntaje !== null ? item.puntaje : 'N/A')
      const notaFormateada = nota !== 'N/A' ? `${nota}/35` : 'N/A'
      
      return `<tr><td>${item.ci || 'N/A'}</td><td>${notaFormateada}</td></tr>`
    }).join('')
    
    const htmlContent = plantillaReporte
      .replace('{{TITULO}}', 'REPORTE DE NOTAS')
      .replace('{{SUBTITULO}}', 'REPORTE DE NOTAS')
      .replace('{{LOGO_URL}}', '/images/logo.png')
      .replace('{{FECHA}}', new Date().toLocaleDateString())
      .replace('{{ENCABEZADOS_TABLA}}', encabezados)
      .replace('{{DATOS_TABLA}}', filas)
      .replace('{{TOTAL_POSTULANTES}}', meta.totalPostulantes?.toString() || postulantes.length.toString())
    
    return htmlContent
  }

  // Función para generar reporte Nombre CI y Nota
  const generarReporteNombreCINota = (postulantes: any[], meta: any) => {
    const encabezados = '<th>NOMBRE COMPLETO</th><th>CI</th><th>NOTA</th>'
    const filas = postulantes.map((item: any, index: number) => {
      const nota = item.nota !== undefined && item.nota !== null ? item.nota : (item.puntaje !== undefined && item.puntaje !== null ? item.puntaje : 'N/A')
      const notaFormateada = nota !== 'N/A' ? `${nota}/35` : 'N/A'
      
      return `<tr><td>${item.nombreCompleto || 'N/A'}</td><td>${item.ci || 'N/A'}</td><td>${notaFormateada}</td></tr>`
    }).join('')
    
    const htmlContent = plantillaReporte
      .replace('{{TITULO}}', 'REPORTE GENERAL DE NOTAS')
      .replace('{{SUBTITULO}}', 'REPORTE GENERAL DE NOTAS')
      .replace('{{LOGO_URL}}', '/images/logo.png')
      .replace('{{FECHA}}', new Date().toLocaleDateString())
      .replace('{{ENCABEZADOS_TABLA}}', encabezados)
      .replace('{{DATOS_TABLA}}', filas)
      .replace('{{TOTAL_POSTULANTES}}', meta.totalPostulantes?.toString() || postulantes.length.toString())
    
    return htmlContent
  }

  // Función de fallback para usar datos locales
  const generarReporteConDatosLocales = (tipo: 'ci-nota' | 'nombre-ci-nota') => {
    const datos = {
      fecha: new Date().toLocaleDateString(),
      totalPostulantes: notasPostulanteData.length,
      titulo: tipo === 'ci-nota' ? 'REPORTE DE NOTAS' : 'REPORTE GENERAL DE NOTAS',
      postulantes: notasPostulanteData.map((item:any) => {
        return {
          ci: item.ci,
          puntaje: item.puntaje,
          nota: item.puntaje, // también mapear como nota para compatibilidad
          nombreCompleto: item.nombrecompleto
        }
      })
    }
    
    if (tipo === 'ci-nota') {
      return generarReporteCINota(datos.postulantes, datos)
    } else {
      return generarReporteNombreCINota(datos.postulantes, datos)
    }
  }

  // Función para obtener reporte CI y nota
  const obtenerReporteCINota = async () => {
    try {
      setLoadingReporte(true)
      
      // Llamar al backend para obtener datos estructurados
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/imagen/reporte/ci-nota/html`,
        tipo: 'get',
      })
      
      let htmlContent = ''
      
      if (respuesta?.datos && respuesta.datos.postulantes && respuesta.datos.postulantes.length > 0) {
        const datos = respuesta.datos
        htmlContent = generarReporteCINota(datos.postulantes, datos)
      } else {
        htmlContent = generarReporteConDatosLocales('ci-nota')
      }
      
      setReporteHTML(htmlContent)
      setOpenReporteCINota(true)
      
    } catch (e: any) {
      const htmlContent = generarReporteConDatosLocales('ci-nota')
      setReporteHTML(htmlContent)
      setOpenReporteCINota(true)
      
      Alerta({ mensaje: `Error al obtener reporte del backend, usando datos locales: ${InterpreteMensajes(e)}`, variant: 'warning' })
    } finally {
      setLoadingReporte(false)
    }
  }

  // Función para obtener reporte Nombre CI y Nota
  const obtenerReporteNombreCINota = async () => {
    try {
      setLoadingReporteNombreCINota(true)
      
      // Llamar al backend para obtener datos estructurados
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/imagen/reporte/nombre-ci-nota/html`,
        tipo: 'get',
      })
      
      let htmlContent = ''
      
      if (respuesta?.datos && respuesta.datos.postulantes && respuesta.datos.postulantes.length > 0) {
        const datos = respuesta.datos
        htmlContent = generarReporteNombreCINota(datos.postulantes, datos)
      } else {
        htmlContent = generarReporteConDatosLocales('nombre-ci-nota')
      }
      
      setReporteNombreCINotaHTML(htmlContent)
      setOpenReporteNombreCINota(true)
      
    } catch (e: any) {
      const htmlContent = generarReporteConDatosLocales('nombre-ci-nota')
      setReporteNombreCINotaHTML(htmlContent)
      setOpenReporteNombreCINota(true)
      
      Alerta({ mensaje: `Error al obtener reporte del backend, usando datos locales: ${InterpreteMensajes(e)}`, variant: 'warning' })
    } finally {
      setLoadingReporteNombreCINota(false)
    }
  }

  // Función para descargar HTML
  const descargarHTML = () => {
    if (!reporteHTML) return
    
    // Crear un blob con el HTML
    const blob = new Blob([reporteHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Crear un enlace temporal para descargar
    const link = document.createElement('a')
    link.href = url
    link.download = 'reporte-ci-nota.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    Alerta({ mensaje: 'Reporte descargado correctamente', variant: 'success' })
  }

  // Función para imprimir HTML
  const imprimirHTML = () => {
    if (!reporteHTML) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(reporteHTML)
      printWindow.document.close()
      
      // Esperar a que se carguen los estilos antes de imprimir
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  // Función para imprimir HTML del reporte nombre CI y nota
  const imprimirHTMLNombreCINota = () => {
    if (!reporteNombreCINotaHTML) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(reporteNombreCINotaHTML)
      printWindow.document.close()
      
      // Esperar a que se carguen los estilos antes de imprimir
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

 
  useEffect(() => {
    if (estaAutenticado) obtenerCalificacionesPeticion().finally(() => {})   
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
    < Paginacion
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
        onDragOver={(e:any)=> e.preventDefault()}
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
          {...{ webkitdirectory: '' }}
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
          {archivos.map((file:any, idx:any) => (
            <ListItem
              key={file.name + idx}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={(e:any) => {
                  e.stopPropagation()
                  setArchivos(archivos.filter((_, i:any) => i !== idx))
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={obtenerReporteCINota}
          disabled={loadingReporte}
        >
          {loadingReporte ? <CircularProgress size={20} /> : 'Reporte Notas'}
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<PictureAsPdfIcon />}
          onClick={obtenerReporteNombreCINota}
          disabled={loadingReporteNombreCINota}
        >
          {loadingReporteNombreCINota ? <CircularProgress size={20} /> : 'Reporte General'}
        </Button>
        <IconoTooltip
          id={'actualizarExamenGenerado'}
          titulo={'Actualizar lista'}
          key={`accionActualizarExamenGenerado`}
          accion={async () => {
            await obtenerCalificacionesPeticion()
          }}
          icono={'refresh'}
          name={'Actualizar lista de exámenes'}
        />
      </Box>
      <CustomDataTable
        error={!!errorNoatasPostulanteData}
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

      {/* Modal para Estado de Imágenes */}
      <Dialog
        open={openEstadoImagenes}
        onClose={() => setOpenEstadoImagenes(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Estado de Imágenes
          {loadingEstadoImagenes && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          {estadoImagenes.length > 0 ? (
            <List>
              {estadoImagenes.map((imagen:any, index:any) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={imagen.nombre || imagen.ruta || imagen.estado || `Imagen ${index + 1}`}
                    secondary={`Estado: ${imagen.estado || 'N/A'} | Tipo: ${imagen.tipo || 'N/A'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                No hay datos de estado de imágenes disponibles
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEstadoImagenes(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Reporte CI y Nota */}
      <Dialog
        open={openReporteCINota}
        onClose={() => setOpenReporteCINota(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {loadingReporte && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          {reporteHTML ? (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={descargarHTML}
                >
                  Descargar 
                </Button>
                <Button
                  variant="outlined"
                  onClick={imprimirHTML}
                >
                  Imprimir
                </Button>
              </Box>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: 2,
                  maxHeight: '60vh',
                  overflow: 'auto',
                  bgcolor: '#f9f9f9'
                }}
                dangerouslySetInnerHTML={{ __html: reporteHTML }}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                No hay reporte disponible
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReporteCINota(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Reporte Nombre CI y Nota */}
      <Dialog
        open={openReporteNombreCINota}
        onClose={() => setOpenReporteNombreCINota(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {loadingReporteNombreCINota && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          {reporteNombreCINotaHTML ? (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={() => {
                    const blob = new Blob([reporteNombreCINotaHTML], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'reporte-nombre-ci-nota.html';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    Alerta({ mensaje: 'Reporte descargado correctamente', variant: 'success' });
                  }}
                >
                  Descargar
                </Button>
                <Button
                  variant="outlined"
                  onClick={imprimirHTMLNombreCINota}
                >
                  Imprimir
                </Button>
              </Box>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: 2,
                  maxHeight: '60vh',
                  overflow: 'auto',
                  bgcolor: '#f9f9f9'
                }}
                dangerouslySetInnerHTML={{ __html: reporteNombreCINotaHTML }}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                No hay reporte disponible
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReporteNombreCINota(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


export default Calificar