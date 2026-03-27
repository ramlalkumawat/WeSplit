import apiClient, { extractData } from './api/client'

const expenseService = {
  createExpense: async (groupId, payload) =>
    extractData(await apiClient.post(`/groups/${groupId}/expenses`, payload)),
  listExpenses: async (groupId) =>
    extractData(await apiClient.get(`/groups/${groupId}/expenses`)),
}

export default expenseService
