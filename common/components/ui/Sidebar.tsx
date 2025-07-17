import { useEffect, useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { useRouter } from 'next/router'
import { useFullScreenLoading, useSidebar } from '../../../context/ui'
import Toolbar from '@mui/material/Toolbar'
import { useAuth } from '../../../context/auth'
import { imprimir } from '../../utils/imprimir'
import { Icono } from './Icono'
import { ModuloType } from '../../../modules/login/types/loginTypes'
import { versionNumber } from '../../utils'

const drawerWidth = 240

export const Sidebar = () => {
  const { sideMenuOpen, closeSideMenu, openSideMenu } = useSidebar()

  const { usuario, rolUsuario, estaAutenticado, progresoLogin } = useAuth()

  const [modulos, setModulos] = useState<ModuloType[]>([])

  const theme = useTheme()
  const router = useRouter()

  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const md = useMediaQuery(theme.breakpoints.only('md'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { estadoFullScreen } = useFullScreenLoading()

  const interpretarModulos = () => {
    imprimir(`Cambio en módulos`)

    const rolSeleccionado = usuario?.roles.find(
      (itemRol) => itemRol.idRol == rolUsuario?.idRol
    )

    imprimir(`rolSeleccionado`, rolSeleccionado)

    let modulosUsuario = rolSeleccionado?.modulos ?? []
    
    // Debug: Ver la estructura que llega del backend
    imprimir('Estructura original de módulos:', modulosUsuario)
    
    // Convertir estructura del backend si es necesario
    modulosUsuario = modulosUsuario.map(modulo => {
      imprimir(`Procesando módulo: ${modulo.nombre}`, modulo)
      
      // Si el módulo tiene subMenus en lugar de subModulo, convertirlo
      if (modulo.subMenus && !modulo.subModulo) {
        imprimir(`Convirtiendo subMenus a subModulo para: ${modulo.nombre}`)
        return {
          ...modulo,
          subModulo: modulo.subMenus.map((subMenu: any) => ({
            id: subMenu.nombre,
            label: subMenu.label,
            url: subMenu.url,
            nombre: subMenu.nombre,
            propiedades: {
              icono: subMenu.propiedades?.icono || 'list',
              descripcion: subMenu.propiedades?.descripcion || '',
              orden: subMenu.propiedades?.orden || 1
            },
            estado: 'ACTIVO'
          }))
        }
      }
      return modulo
    })

    imprimir('Módulos procesados:', modulosUsuario)
    setModulos(modulosUsuario)
  }

  const rutaActiva = (routeName: string, currentRoute: string) =>
    currentRoute.includes(routeName, 0)

  const navigateTo = async (url: string) => {
    if (sm || xs || md) {
      closeSideMenu()
    }
    await router.push(url)
  }

  useEffect(() => {
    if (sm || xs || md) {
      closeSideMenu()
    } else {
      openSideMenu()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sm, xs, md])

  useEffect(() => {
    imprimir(`reinterpretando módulos`)
    interpretarModulos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  return (
    <Drawer
      variant={sm || xs || md ? 'temporary' : 'persistent'}
      open={
        sideMenuOpen &&
        estaAutenticado &&
        modulos.length > 0 &&
        !progresoLogin &&
        !estadoFullScreen &&
        modulos.some((moduloGrupo) =>
          moduloGrupo.subModulo.some((modulo) =>
            router.pathname.includes(modulo.url, 0)
          )
        )
      }
      onClose={closeSideMenu}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: sideMenuOpen ? drawerWidth : `0`,
        border: 'none',
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          borderWidth: 0.0,
          boxSizing: 'border-box',
        },
        transition: 'all 0.1s ease-out',
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {modulos.map((modulo, index) => (
          <div key={`div-${index}`}>
            <Box
              sx={{
                display: 'flex',
                m: 0,
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  m: 0,
                  borderRadius: 1,
                  alignItems: 'center',
                  margin: '16px 6px',
                }}
              >
                <Box width={'20px'} />
                <Typography
                  variant={'body2'}
                  color={'text.secondary'}
                >{`${modulo.label}`}</Typography>
              </Box>
            </Box>

            <List
              key={`submodulos-${index}`}
              component="ul"
              style={{ cursor: 'pointer' }}
              sx={{ pt: 0, pb: 0 }}
            >
              {modulo.subModulo.map((subModuloItem, indexSubModulo) => (
                <ListItemButton
                  id={`submodulo-${index}-${indexSubModulo}`}
                  key={`submodulo-${index}-${indexSubModulo}`}
                  component="li"
                  selected={rutaActiva(subModuloItem.url, router.pathname)}
                  onClick={() => navigateTo(subModuloItem.url)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      m: 0,
                      borderRadius: 1,
                      alignItems: 'center',
                    }}
                  >
                    <Box width={'20px'} />
                    <Icono>{subModuloItem.propiedades.icono}</Icono>

                    <Box width={'20px'} />
                    <Typography
                      variant={'body2'}
                    >{`${subModuloItem.label}`}</Typography>
                  </Box>
                </ListItemButton>
              ))}
            </List>
          </div>
        ))}
      </Box>
      <Box sx={{ pb: 2 }} display="flex" flex="1" justifyContent="space-around">
        <Box sx={{ alignSelf: 'flex-end' }}>
          <Typography
            color="text.secondary"
            variant={'body2'}
          >{`v${versionNumber()}`}</Typography>
        </Box>
      </Box>
    </Drawer>
  )
}
