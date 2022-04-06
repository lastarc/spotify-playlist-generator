import * as React from 'react'
import Link from '@mui/material/Link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { UserProfile } from '../interfaces'

type Props = {
  user?: UserProfile
}

const NavBar = ({ user }: Props) => {
  console.log(user)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link
            href="/"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              ':hover': { textDecoration: 'none' },
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: 'flex' }}
            >
              Spotify Playlist Generator
            </Typography>
          </Link>

          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user.display_name || user.email || user.id}
                  src={user.images.length > 0 ? user.images[0].url : '-'}
                />
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link
                    href="/api/logout"
                    underline="none"
                    color="inherit"
                    variant="inherit"
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" href="/api/login">
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
