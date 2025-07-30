import type { NextPage } from 'next'
import {
  Typography,
  useMediaQuery,
  useTheme,
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
import { BotonAgregar } from '../../common/components/ui/BotonAgregar'
import { imprimir } from '../../common/utils/imprimir'
import { ModalVerPDF } from '../../modules/admin/digitalizar/ui/ModalVerPDF'
import { ExamenGeneradoCRUDType } from '../../modules/admin/digitalizar/types/ExamenGeneradoCRUDTypes'

const Digitalizar: NextPage = () => {
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
  const [limite, setLimite] = useState<number>(100)
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
    { campo: 'codigo', nombre: 'Código', ordenar: true },
    // { campo: 'grupo', nombre: 'Grupo', ordenar: true },
    { campo: 'hojaPreguntas', nombre: 'Hoja Preguntas', ordenar: true },
    { campo: 'hojaRespuesta', nombre: 'Hoja Respuesta', ordenar: true },
    { campo: 'hojaSobre', nombre: 'Hoja Sobre', ordenar: true },
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
      // <Typography
      //   key={`${examenGenerado.id}-${indexExamenGenerado}-grupo`}
      //   variant={'body2'}
      // >
      //   {examenGenerado.grupo}
      // </Typography>,
       <IconoTooltip
       key={`${examenGenerado.id}-${indexExamenGenerado}-hojaPreguntas`}
       id={`hojaPreguntas-${examenGenerado.id}`}
       titulo="Ver Hoja Preguntas"
       color="primary"
       accion={() => abrirPDFPreguntas(examenGenerado.id)}
       icono="list_alt"
       name="hojaPreguntas"
     />,
      <IconoTooltip
        key={`${examenGenerado.id}-${indexExamenGenerado}-hojaRespuesta`}
        id={`hojaPregunta-${examenGenerado.id}`}
        titulo="Ver Hoja Respuesta"
        color="primary"
        accion={() => abrirPDFRespuesta(examenGenerado.id)}
        icono="description"
        name="hojaRespuesta"
      />,
      <IconoTooltip
      key={`${examenGenerado.id}-${indexExamenGenerado}-hojaSobre`}
      id={`hojaSobre-${examenGenerado.id}`}
      titulo="Ver Hoja Sobre"
      color="info"
      accion={() => abrirPDFsobre(examenGenerado.id)}
      icono="contact_mail"
      name="hojaSobre"
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
    <IconoTooltip
      id={'actualizarExamenGenerado'}
      titulo={'Actualizar'}
      key={`accionActualizarExamenGenerado`}
      accion={async () => {
        await obtenerExameGenePeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de exámenes'}
    />,
    <BotonAgregar
        id={'agregarExamenGenerado'}
        key={'agregarExamenGenerado'}
        texto={'Generar Evaluación'}
        descripcion={'Agregar'}
        accion={() => {
          agregarEvaluacionModal()
        }}
    />
  ]

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
      console.log(respuesta.datos?.filas, '+++++++++++++++++++++++++++++++++++++++++++++')
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
  const abrirPDFPreguntas = async (id: string) => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/examen-generado/${id}/preguntas`,
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
  
  const abrirPDFRespuesta = async (id: string) => {
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
      <LayoutUser title={`Digitalizar - ${siteName()}`}>
        <CustomDataTable
          titulo={'Digitalizar'}
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
  )
}

export default Digitalizar
