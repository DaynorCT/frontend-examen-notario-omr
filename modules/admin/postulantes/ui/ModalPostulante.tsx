/// Vista modal de usuario
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CrearEditarPostulanteType,
  PostulanteCRUDType,
} from '../types/postulanteCRUDTypes'
import { delay, InterpreteMensajes } from '../../../../common/utils'
import { Constantes } from '../../../../config'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material'
import {
  FormInputText,
} from '../../../../common/components/ui/form'
import ProgresoLineal from '../../../../common/components/ui/ProgresoLineal'
import { useAlerts, useSession } from '../../../../common/hooks'
import { imprimir } from '../../../../common/utils/imprimir'

export interface ModalUsuarioType {
  postulante?: PostulanteCRUDType | undefined | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalPostulante = ({
  postulante,
  accionCorrecta,
  accionCancelar,
}: ModalUsuarioType) => {
  // Flag que índica que hay un proceso en ventana modal cargando visualmente
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarPostulanteType>({
    defaultValues: {
      id: postulante?.id ,
      nombreCompleto: postulante?.nombreCompleto,
      ci: postulante?.ci,
    },
  })

  const guardarActualizarPostulante = async (
    data: CrearEditarPostulanteType
  ) => {
    await guardarActualizarPostulantePeticion(data)
  }

  const guardarActualizarPostulantePeticion = async (
    postulante: CrearEditarPostulanteType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/postulante${
          postulante.id ? `/${postulante.id}` : ''
        }`,
        tipo: !!postulante.id ? 'patch' : 'post',
        body: {
          ...postulante,
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar Postulante: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarPostulante)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'nombreCompleto'}
                control={control}
                name="nombreCompleto"
                label="Nombre Completo"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'ci'}
                control={control}
                name="ci"
                label="C.I"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'10px'} />
          <ProgresoLineal mostrar={loadingModal} />
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
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
