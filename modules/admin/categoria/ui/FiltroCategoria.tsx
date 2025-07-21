import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Grid } from '@mui/material'
import {
  FormInputText,
} from '../../../../common/components/ui/form'

import { useDebouncedCallback } from 'use-debounce'

export interface FiltroCategoriaType {
  descripcion: string
}

export interface FiltroModalCategoriaType {
  filtroDescripcion: string
  accionCorrecta: (filtros: FiltroCategoriaType) => void
  accionCerrar: () => void
}

export const FiltroCategoria = ({
  filtroDescripcion,
  accionCorrecta,
}: FiltroModalCategoriaType) => {
  const { control, watch } = useForm<FiltroCategoriaType>({
    defaultValues: {
      descripcion: filtroDescripcion,
    },
  })

  const filtroDescripcionWatch: string = watch('descripcion')

  const debounced = useDebouncedCallback(
    // function
    (filtros: FiltroCategoriaType) => {
      accionCorrecta(filtros)
    },
    // delay in ms
    1000
  )

  const actualizacionFiltros = (filtros: FiltroCategoriaType) => {
    debounced(filtros)
  }

  useEffect(() => {
    actualizacionFiltros({
      descripcion: filtroDescripcionWatch
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroDescripcionWatch])

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
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
    </Box>
  )
}
