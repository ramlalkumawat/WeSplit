import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingScreen from '../ui/LoadingScreen'

export default function PublicOnlyRoute() {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return <LoadingScreen label="Checking your Wesplit session..." />
  }

  if (isAuthenticated) {
    const redirectPath = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
