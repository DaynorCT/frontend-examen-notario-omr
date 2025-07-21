/// Vista modal de filtro de usuarios
import React from 'react'
import { useForm } from 'react-hook-form'

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText } from '../../../../common/components/ui/form'
import { FiltroCategoriaType, FiltroModalCategoriaType } from './FiltroCategoria'

export const FiltroModalCategoria = ({
  filtroDescripcion,
  accionCorrecta,
}: FiltroModalCategoriaType) => {
  const { handleSubmit, control } = useForm<FiltroCategoriaType>({
    defaultValues: {
      descripcion: filtroDescripcion,
    }
  })

  return (
    <form onSubmit={handleSubmit(accionCorrecta)}>
      <DialogContent>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Box height={'10px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
          <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'descripcion'}
                name={'descripcion'}
                control={control}
                label={'Categoria'}
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
