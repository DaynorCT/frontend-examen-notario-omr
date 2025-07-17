import Icon from '@mui/material/Icon'

import { FC, PropsWithChildren } from 'react'
import { OverridableStringUnion } from '@mui/types'
import { IconPropsSizeOverrides } from '@mui/material/Icon/Icon'

interface Props {
  color?:
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  fontSize?: OverridableStringUnion<
    'inherit' | 'large' | 'medium' | 'small',
    IconPropsSizeOverrides
  >
}

export const Icono: FC<PropsWithChildren<Props>> = ({
  color = 'primary',
  fontSize = 'medium',
  children,
}) => {
  return (
    <Icon
      fontSize={fontSize}
      color={`${color}`}
      className={'material-icons-outlined'}
    >
      {children}
    </Icon>
  )
}
