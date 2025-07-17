import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { TransitionZoom } from './Animations'

interface Props {
  isOpen: boolean
  titulo: string
  texto: string
}

export const AlertDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  titulo,
  texto,
  children,
}) => {
  return (
    <Dialog open={isOpen} TransitionComponent={TransitionZoom}>
      <DialogTitle sx={{ m: 1, p: 2 }}>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={'span'}>{texto}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  )
}
