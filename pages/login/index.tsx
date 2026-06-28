import type { NextPage } from 'next'
import { LayoutLogin } from '../../common/components/layouts'
import Grid from '@mui/material/Grid'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { delay, InterpreteMensajes, siteName } from '../../common/utils'
import { Constantes } from '../../config'
import { Servicios } from '../../common/services'
import { useFullScreenLoading } from '../../context/ui'
import { useEffect } from 'react'
import { useAlerts } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import LoginRegistroTabContainer from '../../modules/login/ui/LoginRegistroContainer'

const Index: NextPage = () => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const obtenerEstado = async () => {
    try {
      mostrarFullScreen()
      await delay(1000)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/estado`,
        body: {},
        headers: {
          accept: 'application/json',
        },
      })
      imprimir(`Se obtuvo el estado 🙌`, respuesta)
    } catch (e) {
      imprimir(`Error al obtener estado`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      ocultarFullScreen()
    }
  }

  useEffect(() => {
    obtenerEstado().then(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LayoutLogin title={siteName()}>
      <Grid container justifyContent="center"  alignItems="flex-start" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={5} xl={4}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <LoginRegistroTabContainer />
          </Box>
        </Grid>
      </Grid>
    </LayoutLogin>
  )
}

export default Index
