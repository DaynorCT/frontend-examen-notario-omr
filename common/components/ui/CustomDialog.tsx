import {
  Box,
  Breakpoint,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  PaperProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { BaseSyntheticEvent, FC, PropsWithChildren } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { TransitionSlide, TransitionZoom } from './Animations'

interface Props {
  isOpen: boolean
  handleClose: () => void
  title?: string
  fullScreen?: boolean
  maxWidth?: Breakpoint | undefined
  paperProps?: Partial<PaperProps>
  disableBackdropClick?: boolean
  disableEscapeKeyDown?: boolean
  scroll?: 'body' | 'paper'
  noTitle?: boolean
}

export const CustomDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  handleClose,
  title,
  children,
  fullScreen = false,
  maxWidth,
  paperProps,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  scroll = 'body',
  noTitle = false,
}) => {
  const theme = useTheme()
  let dsm = useMediaQuery(theme.breakpoints.down('sm'))

  const cerrarDialog = (event: BaseSyntheticEvent, reason: string) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return false
    }
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return false
    }
    handleClose()
  }
  return (
    <Dialog
      PaperProps={paperProps}
      fullScreen={fullScreen || dsm}
      fullWidth={true}
      maxWidth={maxWidth}
      open={isOpen}
      TransitionComponent={dsm ? TransitionSlide : TransitionZoom}
      onClose={cerrarDialog}
      scroll={scroll}
    >
      {noTitle ? (
        <Box />
      ) : (
        <DialogTitle>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {title ? (
              <Typography sx={{ fontWeight: 'medium', fontSize: 18 }}>
                {title}
              </Typography>
            ) : (
              <Box />
            )}
            <IconButton onClick={handleClose} color={'primary'}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
      )}

      {children}
    </Dialog>
  )
}
