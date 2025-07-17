// import React from 'react'

import { StoryFn, Meta } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { FormInputText } from '../../../../common/components/ui/form'
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

export interface PersonaType {
  id: number
  nombre: string
  apellido: string
  carnet: string
  edad: number
  historialCriminal: string
}
export default {
  title: 'Form/FormInputText',
  component: FormInputText,
  argTypes: {
    onChange: { type: 'function', control: () => {} },
    // control: { type: 'function', description: 'Control<any>' },
  },

  parameters: {
    docs: {
      description: {
        component:
          // 'Form - _FormInputtext_' +
          '\n#### Información sobre  - _FormInputtext_. ' +
          '\n> Para los componentes **_form_** se utiliza [***UseFormHook***](https://react-hook-form.com/api/usecontroller/controller "Ir a la documentación") para su manipulación. \n' +
          '\n```ts' +
          '\nconst {control, handleSubmit} useForm<PersonaType>({' +
          '\n   defaultValues: {' +
          '\n     id: 12,' +
          "\n     nombre: 'Pedro'," +
          "\n     apellido: 'Picapiedra'," +
          "\n     carnet: '9999999'," +
          '\n     edad: 32,' +
          "\n     historialCriminal: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry." +
          "\n                         Lorem Ipsum has been the industry's standard dummy text ever since the 1500s," +
          '\n                         when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into' +
          "\n                         electronic typesetting, remaining essentially unchanged.'," +
          '\n   }' +
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
// storiesOf('Form/FormInputText', module).add('Click', () => (
//   <FormInputText id={'123123'} name="apellido" control={}></FormInputText>
// ))
// replica del componente
const Template: StoryFn<typeof FormInputText> = (args) => {
  const { control } = useForm<PersonaType>({
    defaultValues: {
      id: 12,
      nombre: 'Pedro',
      apellido: 'Picapiedra',
      edad: 32,
      carnet: '9999999',
      historialCriminal: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
      electronic typesetting, remaining essentially unchanged.`,
    },
  })

  return (
    <FormInputText
      {...args}
      control={control}
      name={args.name as Path<PersonaType>}
    />
  )
}

export const SB_Apellido = Template.bind({})
SB_Apellido.storyName = 'name:apellido'
SB_Apellido.args = {
  label: 'Apellido Paterno',
  id: 'textfield-form-1',
  name: 'apellido',
}

export const SB_Nombre = Template.bind({})
SB_Nombre.storyName = 'name:nombre'
SB_Nombre.args = {
  label: 'Nombre Completo',
  id: 'textfield-form-1',
  name: 'nombre',
}

export const SB_multilinea = Template.bind({})
SB_multilinea.storyName = 'Multilinea'
SB_multilinea.args = {
  label: 'Historial Criminal',
  id: 'textfield-form-1',
  multiline: true,
  rows: 6,
  name: 'historialCriminal',
}

export const SB_Disabled = Template.bind({})
SB_Disabled.storyName = 'Deshabilitado'
SB_Disabled.args = {
  name: 'carnet',
  label: 'Carnet de identificación',
  id: 'textfield-form-1',
  disabled: true,
}
export const SB_TipoNumber = Template.bind({})
SB_TipoNumber.storyName = 'Tipo number'
SB_TipoNumber.args = {
  name: 'edad',
  label: 'Edad en number',
  id: 'textfield-form-1',
  type: 'Number',
}

export const SB_Password = Template.bind({})
SB_Password.storyName = 'Tipo password'
SB_Password.args = {
  name: 'apellido',
  label: 'Apellido como password',
  id: 'textfield-form-1',
  type: 'password',
}

export const SB_Requerido = Template.bind({})
SB_Requerido.storyName = 'Campo Requerido'
SB_Requerido.parameters = {
  docs: {
    description: {
      story:
        'Antes de enviar el formulario UseForm nos pedirá llenar el campo vacio',
    },
  },
}
SB_Requerido.args = {
  name: 'nombre',
  label: 'Nombre',
  id: 'textfield-form-1',
  rules: { required: 'Este campo es requerido' },
}

export const SB_OnChange = Template.bind({})
SB_OnChange.storyName = 'Escuchar cambios'
SB_OnChange.parameters = {
  docs: {
    description: {
      story: 'UseForm también escucha los cambios',
    },
  },
}
SB_OnChange.args = {
  name: 'apellido',
  label: 'Buscar',
  id: 'textfield-form-1',
  type: 'search',
  onChange: action('Valor modificado'),
}

export const SB_Variant = Template.bind({})
SB_Variant.storyName = 'Variant'
SB_Variant.args = {
  name: 'apellido',
  label: 'Apellido como password',
  id: 'textfield-form-1',

  variant: 'filled',
}

export const SB_LabelVariant = Template.bind({})
SB_LabelVariant.storyName = 'Label Variant'
SB_LabelVariant.args = {
  name: 'apellido',
  label: 'Apellido como password',
  id: 'textfield-form-1',

  labelVariant: 'h5',
}
