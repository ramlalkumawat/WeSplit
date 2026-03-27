const TOKEN_STORAGE_KEY = 'wesplit-auth-token'

export const getStoredToken = () => window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''

export const setStoredToken = (token) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const clearStoredToken = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export { TOKEN_STORAGE_KEY }
