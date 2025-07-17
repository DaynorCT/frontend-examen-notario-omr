// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'
import ProgresoLineal from '../../../common/components/ui/ProgresoLineal'
export default {
  title: 'Componentes/ProgresoLineal',
  component: ProgresoLineal,
} as Meta<typeof ProgresoLineal>

const Template: StoryFn<typeof ProgresoLineal> = (args) => (
  <ProgresoLineal {...args} />
)

export const Activo = Template.bind({})
Activo.storyName = 'Progreso lineal activo'
Activo.args = {
  mostrar: true,
}
export const Inactivo = Template.bind({})
Inactivo.storyName = 'Progreso lineal Inactivo'
Inactivo.args = {
  mostrar: false,
}
