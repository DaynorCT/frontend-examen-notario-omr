import React from 'react'

import { Meta, StoryFn } from '@storybook/react'

import { AlertDialog } from '../../../common/components/ui'
import { action } from '@storybook/addon-actions'
import Button from '@mui/material/Button'

export default {
  title: 'Componentes/AlertDialog',
  component: AlertDialog,
  argTypes: {
    children: {
      description: 'ReactNode',
      control: 'text',
    },
  },
} as Meta<typeof AlertDialog>

// replica del componente
const Template: StoryFn<typeof AlertDialog> = (args) => (
  <AlertDialog {...args} />
)
export const Alerta = Template.bind({})
Alerta.storyName = 'Modal Alerta'
Alerta.args = {
  isOpen: true,
  titulo: 'Modal de alerta',
  texto: 'Esto es un modal de alerta',
}
export const ComponeneteHijo = Template.bind({})
ComponeneteHijo.args = {
  isOpen: true,
  titulo: 'Modal de alerta',
  texto: 'Esto es un modal de alerta',
  children: <div>React node children</div>,
}

export const AccionesComponeneteHijo = Template.bind({})
AccionesComponeneteHijo.args = {
  ...Alerta.args,
  children: (
    <div>
      {' '}
      <Button onClick={action('Cancelar accion')}>Cancelar</Button>{' '}
      <Button onClick={action('Aceptar accion')}>Aceptar</Button>{' '}
    </div>
  ),
}
