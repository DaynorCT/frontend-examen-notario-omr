import { Button, useMediaQuery, useTheme } from '@mui/material'
import { IconoTooltip } from './IconoTooltip'

interface BotonAgregarParams {
  id: string
  texto: string
  descripcion: string
  accion: () => void
}

export const BotonAgregar = ({
  id,
  texto,
  descripcion,
  accion,
}: BotonAgregarParams) => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  return xs ? (
    <IconoTooltip
      id={id}
      titulo={descripcion}
      accion={() => {
        accion()
      }}
      icono={'add_circle_outline'}
      name={texto}
    />
  ) : (
    <Button
      id={id}
      variant={'contained'}
      sx={{ ml: 1, mr: 1, textTransform: 'none' }}
      size={'small'}
      onClick={() => {
        accion()
      }}
    >
      {texto}
    </Button>
  )
}
