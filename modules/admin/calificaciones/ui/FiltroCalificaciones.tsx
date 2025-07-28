import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Grid } from '@mui/material'
import {
  FormInputText,
} from '../../../../common/components/ui/form'

import { useDebouncedCallback } from 'use-debounce'

export interface FiltroPostulanteType {
  nombreCompleto: string
  ci: string
}

export interface FiltroModalPostulanteType {
  filtroNombre: string
  filtroCI: string
  accionCorrecta: (filtros: FiltroPostulanteType) => void
  accionCerrar: () => void
}

export const FiltroPostulante = ({
  filtroNombre,
  filtroCI,
  accionCorrecta,
}: FiltroModalPostulanteType) => {
  const { control, watch } = useForm<FiltroPostulanteType>({
    defaultValues: {
      nombreCompleto: filtroNombre,
      ci: filtroCI,
    },
  })

  const filtroNombreWatch: string = watch('nombreCompleto')
  const filtroCIWatch: string = watch('ci')

  const debounced = useDebouncedCallback(
    // function
    (filtros: FiltroPostulanteType) => {
      accionCorrecta(filtros)
    },
    // delay in ms
    1000
  )

  const actualizacionFiltros = (filtros: FiltroPostulanteType) => {
    debounced(filtros)
  }

  useEffect(() => {
    actualizacionFiltros({
      nombreCompleto: filtroNombreWatch,
      ci: filtroCIWatch,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroNombreWatch, filtroCIWatch])

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
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
    </Box>
  )
}
