// import React from 'react'

import { StoryFn, Meta } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { Path, useForm } from 'react-hook-form'
import { FormInputDropdown } from '../../../../common/components/ui/form'

import {
  ArgsTable,
  Description,
  Primary,
  PRIMARY_STORY,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs'

export interface PersonaType {
  id: number
  nombre: string
  apellido: string
  carnet: string
  fechaNacimiento: string
  edad: number
  idPeliculaFavorita: number
}
export default {
  title: 'Form/FormInputDropdown',
  component: FormInputDropdown,
  argTypes: {
    // onChange: { type: 'function', control: () => {} },
    // control: { type: 'function', description: 'Control<any>' },
  },

  parameters: {
    docs: {
      description: {
        component:
          // 'Form - _FormInputDropdown_' +
          '\n#### Información sobre  - _FormInputDropdown_. ' +
          '\n> Para los componentes **_form_** se utiliza [***UseFormHook***](https://react-hook-form.com/api/usecontroller/controller "Ir a la documentación") para su manipulación. \n' +
          '\n```ts' +
          '\nconst {control, handleSubmit} useForm<PersonaType>({' +
          '\n   defaultValues: {' +
          '\n     id: 12,' +
          "\n     nombre: 'Pedro'," +
          "\n     apellido: 'Picapiedra'," +
          '\n     edad: 32,' +
          '\n     fechaNacimiento: 05-21-1984,' +
          '\n     idPeliculaFavorita: 2,' +
          '\n})' +
          '\n```' +
          '\n> Donde ***`const control`*** lo enviaremos a todos nuestros componentes form.' +
          '\n> y ***`name`*** hace referencia al valor.',
      },
      page: () => (
        <>
          <Description />
          <Title />
          <Subtitle />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
  // parameters: {
  //   accion: {
  //     handles: ['mouseover', 'CLICK aqui'],
  //   },
  // },
} as Meta

// const eventsFromNames = actions('accion')

// click en componenete
// storiesOf('FormInputDropdown', module).add('Click', () => (
//   <FormInputDropdown
//     name="HOla"
//     titulo="ACCION ICONO"
//     icono="face"
//     accion={action('HOLA MUNDO ')}
//   ></FormInputDropdown>
// ))
// replica del componente
const Template: StoryFn<typeof FormInputDropdown> = (args) => {
  const { control } = useForm<PersonaType>({
    defaultValues: {
      id: 12,
      nombre: 'Pedro',
      apellido: 'Picapiedra',
      edad: 32,
      fechaNacimiento: '05-21-1984',
      idPeliculaFavorita: 2,
    },
  })

  return (
    <FormInputDropdown
      {...args}
      control={control}
      name={args.name as Path<PersonaType>}
    />
  )
}

const peliculas = [
  { id: 1, nombre: 'Toy Story' },
  { id: 2, nombre: 'Bichos: Una aventura en miniatura' },
  { id: 3, nombre: 'Toy Story 2' },
  { id: 4, nombre: 'Monsters, Inc.' },
  { id: 5, nombre: 'Buscando a Nemo' },
  { id: 6, nombre: 'Los Increibles' },
  { id: 7, nombre: 'Cars' },
]
// export const SB_Requerido = Template.bind({})
// SB_Requerido.storyName = 'Campo Requerido'
// SB_Requerido.parameters = {
//   docs: {
//     description: {
//       story:
//         'Antes de enviar el FormInputDate UseForm nos pedirá llenar el campo vacio',
//     },
//   },
// }
// SB_Requerido.args = {
//   name: 'fechaNacimiento',
//   label: 'Fecha de Nacimiento',
//   id: 'textfield-form-1',
// }

export const SB_Vacio = Template.bind({})
SB_Vacio.storyName = 'Vacío'
SB_Vacio.args = {
  id: '1232131',
  label: 'Película favorita',
  name: 'idPeliculaFavorita',
  options: peliculas.map((item) => ({
    key: item.id + '',
    value: item.id + '',
    label: item.nombre,
  })),
  onChange: action('Cambio del valor'),
}
