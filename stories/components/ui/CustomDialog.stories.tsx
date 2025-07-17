// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { CustomDialog } from '../../../common/components/ui'

export default {
  title: 'Componentes/CustomDialog',
  component: CustomDialog,
  argTypes: {
    children: {
      description: 'ReactNode',
      control: 'text',
    },
  },
  // parameters: {
  //   accion: {
  //     handles: ['mouseover', 'CLICK aqui'],
  //   },
  // },
} as Meta<typeof CustomDialog>

// const eventsFromNames = actions('accion')

// replica del componente
const Template: StoryFn<typeof CustomDialog> = (args) => (
  <CustomDialog {...args} />
)
export const Activo = Template.bind({})
Activo.storyName = 'Modal activo'
Activo.args = {
  isOpen: true,
  fullScreen: false,
  maxWidth: 'md',
  title: 'Titulo de modal',
  handleClose: action('handleClose: ()=>{console.log("Cerrar Modal")}'),
}
export const FullWidth = Template.bind({})
FullWidth.storyName = 'Modal pantalla completa'
FullWidth.args = {
  ...Activo.args,
  fullScreen: true,
}

export const ComponeneteHijo = Template.bind({})
ComponeneteHijo.storyName = 'Componenete hijo para modal'
ComponeneteHijo.args = {
  ...Activo.args,
  fullScreen: false,
  children: (
    <div>
      <h3>Componente React...</h3>
      <h6> React node</h6>
    </div>
  ),
}

export const MaxWidth = Template.bind({})
MaxWidth.storyName = 'Tamaño para modal'
MaxWidth.args = {
  ...Activo.args,
  maxWidth: 'xs',
  children: (
    <div>
      <h3>Componente React...</h3>
      <h6> React node</h6>
    </div>
  ),
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
