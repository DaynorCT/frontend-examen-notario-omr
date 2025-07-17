// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'
import { CustomDataTable, IconoTooltip } from '../../../common/components/ui'
import { Grid, Typography } from '@mui/material'
import { ColumnaType } from '../../../common/types'
import { ReactNode } from 'react'
import { Paginacion } from '../../../common/components/ui/Paginacion'

export default {
  title: 'Componentes/CustomDataTable',
  component: CustomDataTable,
  //   argTypes: {
  //     // children: {
  //     //   description: 'ReactNode',
  //     //   control: 'text',
  //     // },
  //     columnas: {
  //       description: 'Array<ColumnaType>',
  //     },
  //   },
  // parameters: {
  //   accion: {
  //     handles: ['mouseover', 'CLICK aqui'],
  //   },
  // },
} as Meta<typeof CustomDataTable>

// const eventsFromNames = actions('accion')

// replica del componente
const Template: StoryFn<typeof CustomDataTable> = (args) => (
  <CustomDataTable {...args} />
)
export const TablaVacia = Template.bind({})
TablaVacia.storyName = 'Tabla vacía'
TablaVacia.args = {
  titulo: 'Tabla mundiales de Bolivia',
  error: false,
  acciones: [],
  contenidoTabla: [],
}

/// Columnas para data table
const columnas: Array<ColumnaType> = [
  { campo: 'nombre', nombre: 'Nombre' },
  { campo: 'resumen', nombre: 'Resumen' },
  { campo: 'fechaPublicacion', nombre: 'Fecha Publicación' },
  { campo: 'observacion', nombre: 'Observaciones' },
  { campo: 'acciones', nombre: 'Eventos' },
]
const solicitudesData: any[] = [
  {
    nombre: 'En busca del tiempo perdido',
    resumen:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.   into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    fechaPublicacion: '02/11/1904',
    observacion: 'Escritor Frances',
  },
]

const contenidoTabla: Array<Array<ReactNode>> = solicitudesData.map(
  (solicitudData, index) => [
    <Typography key={`${solicitudData.id}-${index}-nombre`} variant={'body2'}>
      {`${solicitudData.nombre}`}
    </Typography>,

    <Typography key={`${solicitudData.id}-${index}-resumen`} variant={'body2'}>
      {`${solicitudData.resumen}`}
    </Typography>,

    <Typography
      key={`${solicitudData.id}-${index}-fechaEntrega`}
      variant={'body2'}
    >
      {solicitudData.fechaPublicacion}
    </Typography>,

    <Typography
      key={`${solicitudData.id}-${index}-obervacion`}
      variant={'body2'}
    >
      {solicitudData.observacion ?? ''}
    </Typography>,

    <Grid key={`${solicitudData.id}-${index}-acciones`}>
      <>
        <IconoTooltip
          id={'editarLibro'}
          titulo={'Editar libro'}
          color={'success'}
          accion={() => {}}
          icono={'edit'}
          name={'Editar libro'}
        />
        <IconoTooltip
          id={'verLibro'}
          titulo={'Ver libro'}
          color={'info'}
          accion={() => {}}
          icono={'visibility'}
          name={'Ver libro'}
        />
        <IconoTooltip
          id={'eliminarLibro'}
          titulo={'Eliminar libro'}
          color={'warning'}
          accion={() => {}}
          icono={'delete'}
          name={'Eliminar libro'}
        />
      </>
    </Grid>,
  ]
)
export const Columnas = Template.bind({})

Columnas.args = {
  titulo: 'Tabla Libros',
  error: false,
  acciones: [],
  columnas: columnas,
  contenidoTabla: contenidoTabla,
}

const acciones: Array<ReactNode> = [
  <IconoTooltip
    id={'buscarProyecto'}
    titulo={'Buscar proyecto'}
    key={`BuscarProyecto`}
    accion={() => {}}
    icono={'search'}
    name={'buscarProyecto'}
  />,
  <IconoTooltip
    id={'actualizarProyecto'}
    titulo={'Actualizar proyecto'}
    key={`accionActualizarProyecto`}
    accion={() => {}}
    icono={'refresh'}
    name={'actualizarProyecto'}
  />,
  <IconoTooltip
    id={'agregarProyecto'}
    titulo={'Agregar proyecto'}
    key={`accionAgregarProyecto`}
    accion={() => {}}
    icono={'add_circle_outline'}
    name={'agregarProyecto'}
  />,
]

export const Acciones = Template.bind({})

Acciones.args = {
  ...Columnas.args,
  acciones: acciones,
}
/// Variable con parámetros de paginación
const paginacion = (
  <Paginacion
    pagina={1}
    limite={20}
    total={500}
    cambioPagina={() => {}}
    cambioLimite={() => {}}
  />
)

export const SB_PAGINACION = Template.bind({})
SB_PAGINACION.storyName = 'Paginación'
SB_PAGINACION.args = {
  ...Columnas.args,
  acciones: acciones,
  paginacion: paginacion,
}

export const Cargando = Template.bind({})
Cargando.storyName = 'Tabla cargando'
Cargando.args = {
  ...Columnas.args,
  acciones: acciones,
  cargando: true,
}

// // click en componenete
// storiesOf('CustomDialog', module).add('Cerrado', () => (
//   <CustomDialog
//     title="Modal cerrado"
//     isOpen={false}
//     handleClose={() => {}}
//   ></CustomDialog>
// ))
// export const Titulo = Template.bind({})
// Titulo.storyName = 'Icono tooltip'
// Titulo.args = {
//   titulo: 'Mensaje tooltip para iconos',
//   icono: 'savings',
//   accion: action('()=>{console.log("Click en IconoTooltip")}'),
//   name: 'IconToolTip',
// }
