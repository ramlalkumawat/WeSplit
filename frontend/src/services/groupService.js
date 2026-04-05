import apiClient, { extractData } from './api/client'

const groupService = {
  listGroups: async () => extractData(await apiClient.get('/groups')),
  createGroup: async (payload) => extractData(await apiClient.post('/groups', payload)),
  getGroup: async (groupId) => extractData(await apiClient.get(`/groups/${groupId}`)),
  addMember: async (groupId, payload) =>
    extractData(await apiClient.post(`/groups/${groupId}/members`, payload)),
  removeMember: async (groupId, memberId) =>
    extractData(await apiClient.delete(`/groups/${groupId}/members/${memberId}`)),
  createSettlement: async (groupId, payload) =>
    extractData(await apiClient.post(`/groups/${groupId}/settlements`, payload)),
  getSettlements: async (groupId) =>
    extractData(await apiClient.get(`/groups/${groupId}/settlements`)),
}

export default groupService
