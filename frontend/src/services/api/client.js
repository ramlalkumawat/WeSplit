import axios from 'axios'
import { clearStoredToken, getStoredToken } from '../../utils/authStorage'

const DEFAULT_API_BASE_PATH = '/api'
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
const CSRF_COOKIE_NAME = import.meta.env.VITE_CSRF_COOKIE_NAME || 'wesplit_csrf'
const SAFE_HTTP_METHODS = new Set(['get', 'head', 'options'])
const CSRF_ERROR_MESSAGE = 'CSRF token validation failed'

let csrfTokenCache = ''
let csrfTokenRequest = null

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
    clearCsrfToken()
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

const setCsrfToken = (value) => {
  csrfTokenCache = typeof value === 'string' ? value : ''
  return csrfTokenCache
}

const updateCsrfTokenFromResponse = (response) => {
  const responseToken = response?.data?.data?.csrfToken

  if (responseToken) {
    return setCsrfToken(responseToken)
  }

  return ''
}

export function clearCsrfToken() {
  setCsrfToken('')
}

export function getCsrfToken() {
  return csrfTokenCache || readCookie(CSRF_COOKIE_NAME)
}

export async function ensureCsrfToken(forceRefresh = false) {
  const existingToken = getCsrfToken()

  if (!forceRefresh && existingToken) {
    return existingToken
  }

  if (!csrfTokenRequest) {
    csrfTokenRequest = apiClient
      .get('/auth/csrf-token', {
        _skipCsrfRetry: true,
        withCredentials: true,
      })
      .then((response) => updateCsrfTokenFromResponse(response) || getCsrfToken() || '')
      .finally(() => {
        csrfTokenRequest = null
      })
  }

  return csrfTokenRequest
}

const shouldAttachCsrfHeader = (config) => {
  const method = String(config.method || 'get').toLowerCase()
  return !SAFE_HTTP_METHODS.has(method)
}

apiClient.interceptors.request.use(async (config) => {
  config.headers = config.headers || {}
  config.withCredentials = true

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
  async (response) => {
    updateCsrfTokenFromResponse(response)
    return response
  },
  async (error) => {
    const originalConfig = error.config || {}
    const method = String(originalConfig.method || 'get').toLowerCase()
    const shouldRetryCsrfRequest =
      error.response?.status === 403 &&
      error.response?.data?.message === CSRF_ERROR_MESSAGE &&
      !SAFE_HTTP_METHODS.has(method) &&
      !originalConfig._csrfRetry &&
      !originalConfig._skipCsrfRetry

    if (shouldRetryCsrfRequest) {
      clearCsrfToken()

      const csrfToken = await ensureCsrfToken(true)

      originalConfig._csrfRetry = true
      originalConfig.headers = originalConfig.headers || {}
      originalConfig.withCredentials = true

      if (csrfToken) {
        originalConfig.headers['x-csrf-token'] = csrfToken
      }

      return apiClient(originalConfig)
    }

    return Promise.reject(buildApiError(error))
  },
)

export const extractData = (response) => response.data.data

export default apiClient
