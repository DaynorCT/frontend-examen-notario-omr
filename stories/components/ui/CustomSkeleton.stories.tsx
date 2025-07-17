// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'
import { TableSkeleton } from '../../../common/components/ui'

export default {
  title: 'Componentes/TableSkeleton',
  component: TableSkeleton,
  argTypes: {
    accion: { type: 'function', control: () => {} },
  },
  // parameters: {
  //   accion: {
  //     handles: ['mouseover', 'CLICK aqui'],
  //   },
  // },
} as Meta<typeof TableSkeleton>

// const eventsFromNames = actions('accion')

// click en componenete
// storiesOf('TableSkeleton', module).add('Click', () => (
//   <TableSkeleton
//     name="HOla"
//     titulo="ACCION ICONO"
//     icono="face"
//     accion={action('HOLA MUNDO ')}
//   ></TableSkeleton>
// ))
// replica del componente
const Template: StoryFn<typeof TableSkeleton> = (args) => (
  <TableSkeleton {...args} />
)

export const SB_Formato = Template.bind({})
SB_Formato.storyName = 'Cantidad'
SB_Formato.args = {
  columnas: 4,
  filas: 5,
}
