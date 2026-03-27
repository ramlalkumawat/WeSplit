import { useEffect, useState } from 'react'
import authService from '../services/authService'
import { AuthContext } from './authContext'
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/authStorage'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let isMounted = true

    const hydrateUser = async () => {
      const storedToken = getStoredToken()

      if (!storedToken) {
        if (isMounted) {
          setIsBootstrapping(false)
          setUser(null)
          setToken('')
        }

        return
      }

      try {
        const data = await authService.getCurrentUser()

        if (isMounted) {
          setToken(storedToken)
          setUser(data.user)
        }
      } catch {
        clearStoredToken()

        if (isMounted) {
          setToken('')
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false)
        }
      }
    }

    hydrateUser()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleSessionExpiry = () => {
      clearStoredToken()
      setToken('')
      setUser(null)
      setIsBootstrapping(false)
    }

    window.addEventListener('wesplit:auth-expired', handleSessionExpiry)

    return () => {
      window.removeEventListener('wesplit:auth-expired', handleSessionExpiry)
    }
  }, [])

  const completeAuth = (payload) => {
    setStoredToken(payload.token)
    setToken(payload.token)
    setUser(payload.user)
    setIsBootstrapping(false)
  }

  const signup = async (values) => {
    const data = await authService.signup(values)
    completeAuth(data)
    return data
  }

  const login = async (values) => {
    const data = await authService.login(values)
    completeAuth(data)
    return data
  }

  const logout = () => {
    clearStoredToken()
    setToken('')
    setUser(null)
    setIsBootstrapping(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isBootstrapping,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
