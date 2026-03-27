import apiClient, { extractData } from './api/client'

const authService = {
  signup: async (payload) => extractData(await apiClient.post('/auth/signup', payload)),
  login: async (payload) => extractData(await apiClient.post('/auth/login', payload)),
  getCurrentUser: async () => extractData(await apiClient.get('/auth/me')),
}

export default authService
