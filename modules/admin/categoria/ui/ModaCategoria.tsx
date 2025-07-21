/// Vista modal de usuario
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CrearEditarCategoriaType,
  CategoriaCRUDType,
} from '../types/categoriaCRUDTypes'
import { delay, InterpreteMensajes } from '../../../../common/utils'
import { Constantes } from '../../../../config'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
} from '@mui/material'
import {
  FormInputText,
} from '../../../../common/components/ui/form'
import { useAlerts, useSession } from '../../../../common/hooks'
import { imprimir } from '../../../../common/utils/imprimir'
export interface ModalCategoriaType {
  categoria?: CategoriaCRUDType | undefined | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalCategoria = ({
  categoria,
  accionCorrecta,
  accionCancelar,
}: ModalCategoriaType) => {
  // Flag que índica que hay un proceso en ventana modal cargando visualmente
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarCategoriaType>({
    defaultValues: {
      id: categoria?.id ,
      descripcion: categoria?.descripcion,
      cantidad: categoria?.cantidad,
      seleccionable: categoria?.seleccionable
    },
  })

  const guardarActualizarCategoria = async (
    data: CrearEditarCategoriaType
  ) => {
    await guardarActualizarCategoriaPeticion(
    {  ...data,
      cantidad: Number(data.cantidad),
      seleccionable: Number(data.seleccionable),
   })
  }

  const guardarActualizarCategoriaPeticion = async (
    categoria: CrearEditarCategoriaType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/categoria${
          categoria.id ? `/${categoria.id}` : ''
        }`,
        tipo: !!categoria.id ? 'patch' : 'post',
        body: {
          ...categoria,
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar Categoria: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } 
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarCategoria)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'descripcion'}
                control={control}
                name="descripcion"
                label="Categoria"
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'cantidad'}
                control={control}
                name="cantidad"
                label="Cnt. preguntas"
                type='number'
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'seleccionable'}
                control={control}
                name="seleccionable"
                label="Cnt. Seleccionadas"
                type='number'
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'10px'} />
          <Box height={'5px'} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'}  type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
