import axios from 'axios'
import { clearStoredToken, getStoredToken } from '../../utils/authStorage'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const buildApiError = (error) => {
  if (error.response?.status === 401) {
    clearStoredToken()
    window.dispatchEvent(new Event('wesplit:auth-expired'))
  }

  const normalizedError = new Error(
    error.response?.data?.message || error.message || 'Something went wrong.',
  )

  normalizedError.statusCode = error.response?.status
  normalizedError.details = error.response?.data?.details || null
  normalizedError.fieldMessages = error.response?.data?.details?.fields || []

  return normalizedError
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(buildApiError(error)),
)

export const extractData = (response) => response.data.data

export default apiClient
