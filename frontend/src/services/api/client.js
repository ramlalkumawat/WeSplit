import axios from 'axios'
import { clearStoredToken, getStoredToken } from '../../utils/authStorage'

const DEFAULT_API_BASE_PATH = '/api'
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
const CSRF_COOKIE_NAME = import.meta.env.VITE_CSRF_COOKIE_NAME || 'wesplit_csrf'
const SAFE_HTTP_METHODS = new Set(['get', 'head', 'options'])

const normalizeApiBaseUrl = (value) => {
  const rawValue = String(value || '').trim()

  if (!rawValue) {
    return DEFAULT_API_BASE_PATH
  }

  if (rawValue.startsWith('/')) {
    return rawValue.replace(/\/+$/, '') || DEFAULT_API_BASE_PATH
  }

  try {
    const url = new URL(rawValue)
    const normalizedPathname = url.pathname.replace(/\/+$/, '')

    url.pathname =
      !normalizedPathname || normalizedPathname === '/' ? DEFAULT_API_BASE_PATH : normalizedPathname

    return url.toString().replace(/\/+$/, '')
  } catch (_error) {
    return rawValue.replace(/\/+$/, '') || DEFAULT_API_BASE_PATH
  }
}

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

const readCookie = (cookieName) => {
  if (typeof document === 'undefined') {
    return ''
  }

  const escapedCookieName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedCookieName}=([^;]*)`))

  return match ? decodeURIComponent(match[1]) : ''
}

export function getCsrfToken() {
  return readCookie(CSRF_COOKIE_NAME)
}

export async function ensureCsrfToken() {
  const existingToken = getCsrfToken()

  if (existingToken) {
    return existingToken
  }

  const response = await apiClient.get('/auth/csrf-token')
  return response.data?.data?.csrfToken || getCsrfToken() || ''
}

const shouldAttachCsrfHeader = (config) => {
  const method = String(config.method || 'get').toLowerCase()
  return !SAFE_HTTP_METHODS.has(method)
}

apiClient.interceptors.request.use(async (config) => {
  config.headers = config.headers || {}

  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (shouldAttachCsrfHeader(config)) {
    const csrfToken = getCsrfToken() || (await ensureCsrfToken())

    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(buildApiError(error)),
)

export const extractData = (response) => response.data.data

export default apiClient
