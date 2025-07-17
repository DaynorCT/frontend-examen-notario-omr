/// Vista modal de filtro de usuarios
import React from 'react'
import { useForm } from 'react-hook-form'

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText } from '../../../../common/components/ui/form'
import { FiltroModalPostulanteType, FiltroPostulanteType } from './FiltroAsignar'

export const FiltroModalUsuarios = ({
  filtroNombre,
  filtroCI,
  accionCorrecta,
}: FiltroModalPostulanteType) => {
  const { handleSubmit, control } = useForm<FiltroPostulanteType>({
    defaultValues: {
      ci:   filtroCI,
      nombreCompleto: filtroNombre,
    },
  })

  return (
    <form onSubmit={handleSubmit(accionCorrecta)}>
      <DialogContent>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Box height={'10px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
          <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'nombreCompleto'}
                name={'nombreCompleto'}
                control={control}
                label={'Nombre Completo'}
                bgcolor={'background.paper'}
                clearable
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'ci'}
                name="ci"
                control={control}
                label="C.I."
                bgcolor={'background.paper'}
                clearable
              />
            </Grid>
          </Grid>
          <Box height={'30px'} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: {
            xs: 'center',
          },
        }}
      >
        <Button variant={'contained'} type={'submit'}>
          Aplicar
        </Button>
      </DialogActions>
    </form>
  )
}
