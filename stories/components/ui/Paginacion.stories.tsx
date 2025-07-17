// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { Paginacion } from '../../../common/components/ui/Paginacion'

export default {
  title: 'Componentes/Paginación',
  component: Paginacion,
  argTypes: {
    accion: { type: 'function', control: () => {} },
  },
} as Meta<typeof Paginacion>

const Template: StoryFn<typeof Paginacion> = (args) => <Paginacion {...args} />

export const SB_Paginacion = Template.bind({})
SB_Paginacion.storyName = 'Icono tooltip'
SB_Paginacion.args = {
  limite: 10,
  pagina: 2,
  total: 500,
  cambioPagina: action(
    'cambioPagina: (nuevaPagina: number) => {console.log("Se ha cambiado la página")}'
  ),
  cambioLimite: action(
    'cambioLimite: (nuevoLimite: number) => {console.log("Se ha cambiado el límite")}'
  ),
}
