import { Button, useMediaQuery, useTheme } from '@mui/material'
import { IconoTooltip } from './IconoTooltip'

interface BotonAgregarParams {
  id: string
  texto: string
  descripcion: string
  accion: () => void
  deshabilitado?: boolean
}

export const BotonAgregar = ({
  id,
  texto,
  descripcion,
  accion,
  deshabilitado = false,
}: BotonAgregarParams) => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  return xs ? (
    <IconoTooltip
      id={id}
      titulo={descripcion}
      accion={deshabilitado ? undefined : () => {
        accion()
      }}
      icono={'add_circle_outline'}
      name={texto}
      desactivado={deshabilitado}
    />
  ) : (
    <Button
      id={id}
      variant={'contained'}
      sx={{ ml: 1, mr: 1, textTransform: 'none' }}
      size={'small'}
      disabled={deshabilitado}
      onClick={() => {
        accion()
      }}
    >
      {texto}
    </Button>
  )
}
