// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'
import { FormInputSlider } from '../../../../common/components/ui/form'
import { Path, useForm } from 'react-hook-form'

import {
  ArgsTable,
  Description,
  Primary,
  PRIMARY_STORY,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs'
import { Typography } from '@mui/material'

export interface PersonaType {
  id: number
  nombre: string
  apellido: string
  carnet: string
  fechaNacimiento: string
  edad: number
}
export default {
  title: 'Form/FormInputSlider',
  component: FormInputSlider,
  argTypes: {
    // onChange: { type: 'function', control: () => {} },
    // control: { type: 'function', description: 'Control<any>' },
  },

  parameters: {
    docs: {
      description: {
        component:
          // 'Form - _FormInputSlider_' +
          '\n#### Información sobre  - _FormInputSlider_. ' +
          '\n> Para los componentes **_form_** se utiliza [***UseFormHook***](https://react-hook-form.com/api/usecontroller/controller "Ir a la documentación") para su manipulación. \n' +
          '\n```ts' +
          '\nconst {control, handleSubmit} useForm<PersonaType>({' +
          '\n   defaultValues: {' +
          '\n     id: 12,' +
          "\n     nombre: 'Pedro'," +
          "\n     apellido: 'Picapiedra'," +
          '\n     edad: 32,' +
          '\n     fechaNacimiento: 05-21-1984,' +
          "\n     carnet: '9999999'," +
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

const Template: StoryFn<typeof FormInputSlider> = (args) => {
  const { control, setValue, watch } = useForm<PersonaType>({
    defaultValues: {
      id: 12,
      nombre: 'Pedro',
      apellido: 'Picapiedra',
      edad: 32,
      fechaNacimiento: '05-21-1984',
      carnet: '9999999',
    },
  })

  return (
    <>
      <FormInputSlider
        {...args}
        control={control}
        setValue={setValue}
        name={args.name as Path<PersonaType>}
      />
      <Typography>{watch(args.name as Path<PersonaType>)}</Typography>
    </>
  )
}

export const SB_Slider = Template.bind({})
SB_Slider.storyName = 'Slider'
SB_Slider.parameters = {
  docs: {
    description: {
      story:
        'Antes de enviar el FormInputSlider UseForm nos pedirá llenar el campo vació',
    },
  },
}
SB_Slider.args = {
  name: 'edad',
  label: 'Edad',
  id: 'input-slider-form-',
}
