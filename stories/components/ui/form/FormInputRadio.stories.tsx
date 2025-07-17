// import React from 'react'

import {
  ArgsTable,
  Description,
  Primary,
  PRIMARY_STORY,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs'
import { Meta, StoryFn } from '@storybook/react'
import { Path, useForm } from 'react-hook-form'
import { FormInputRadio } from '../../../../common/components/ui/form'

export interface PersonaType {
  id: number
  nombre: string
  apellido: string
  carnet: string
  fechaNacimiento: string
  edad: number
  idsPeliculasFavoritas: number[]
}
export default {
  title: 'Form/FormInputRadio',
  component: FormInputRadio,
  argTypes: {
    // onChange: { type: 'function', control: () => {} },
    // control: { type: 'function', description: 'Control<any>' },
  },

  parameters: {
    docs: {
      description: {
        component:
          // 'Form - _FormInputRadio_' +
          '\n#### Información sobre  - FormInputRadio. ' +
          '\n> Para los componentes **_form_** se utiliza [***UseFormHook***](https://react-hook-form.com/api/usecontroller/controller "Ir a la documentación") para su manipulación. \n' +
          '\n```ts' +
          '\nconst {control, handleSubmit} useForm<PersonaType>({' +
          '\n   defaultValues: {' +
          '\n     id: 12,' +
          "\n     nombre: 'Pedro'," +
          "\n     apellido: 'Picapiedra'," +
          '\n     edad: 32,' +
          '\n     fechaNacimiento: 05-21-1984,' +
          '\n     idsPeliculasFavoritas: [1,2],' +
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

const Template: StoryFn<typeof FormInputRadio> = (args) => {
  const { control } = useForm<PersonaType>({
    defaultValues: {
      id: 12,
      nombre: 'Pedro',
      apellido: 'Picapiedra',
      edad: 32,
      fechaNacimiento: '05-21-1984',
      idsPeliculasFavoritas: [1, 2],
    },
  })

  return (
    <FormInputRadio
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

export const SB_Vacio = Template.bind({})
SB_Vacio.storyName = 'Seleccionados'
SB_Vacio.args = {
  id: '1232131',
  label: 'Peliculas favoritas',
  name: 'idsPeliculasFavoritas',
  options: peliculas.map((item) => ({
    key: item.id + '',
    value: item.id + '',
    label: item.nombre,
  })),
}
