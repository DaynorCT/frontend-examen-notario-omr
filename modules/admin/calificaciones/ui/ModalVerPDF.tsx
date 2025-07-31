import React from 'react'
import { Dialog, DialogActions, Button, Typography } from '@mui/material'

interface ModalVerPDFProps {
  open: boolean
  pdfUrl: string | null
  onClose: () => void
}

export const ModalVerPDF: React.FC<ModalVerPDFProps> = ({ open, pdfUrl, onClose }) => {
  return (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {pdfUrl ? (
        <div style={{ width: '100%', height: '900px'}}>
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          >
            <p>Tu navegador no puede mostrar el PDF directamente. 
              <br />
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                Haz clic aquí para abrirlo en una nueva pestaña
              </a>
            </p>
          </object>
        </div>
      ) : (
        <Typography>Cargando PDF...</Typography>
      )}
    <DialogActions>
      <Button 
      onClick={onClose} 
      color="error"
      variant="outlined"
      >
        Cerrar
      </Button>
      </DialogActions>
    </Dialog>
  )
}