import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import { useThemeContext } from '../../../context/ui/ThemeContext'

interface ThemeSwitcherButtonProps extends IconButtonProps {}

const ThemeSwitcherButton = ({ ...rest }: ThemeSwitcherButtonProps) => {
  const { themeMode, toggleTheme } = useThemeContext()
  return (
    <Tooltip
      title={
        themeMode === 'light' ? `Cambiar a modo oscuro` : `Cambiar a modo claro`
      }
    >
      <IconButton {...rest} onClick={toggleTheme}>
        {themeMode === 'light' ? (
          <LightModeOutlinedIcon color={'primary'} />
        ) : (
          <DarkModeOutlinedIcon color={'primary'} />
        )}
      </IconButton>
    </Tooltip>
  )
}
export default ThemeSwitcherButton
