import { useEffect, useState } from 'react'
import expenseService from '../services/expenseService'
import groupService from '../services/groupService'
import { useAuth } from './useAuth'

const emptyOverview = {
  groupCount: 0,
  totalOwed: 0,
  totalOwe: 0,
  netBalance: 0,
}

const emptyGroupDetail = null

const normalizeGroupDetail = (data) => ({
  group: data.group,
  expenses: data.expenses || [],
  balances: data.balances || [],
  settlements: data.settlements || [],
  summary: data.summary || {
    totalExpenses: 0,
    totalMembers: 0,
    yourBalance: 0,
    yourOwed: 0,
    yourOwe: 0,
  },
})

export function useDashboardData() {
  const { isAuthenticated } = useAuth()
  const [groups, setGroups] = useState([])
  const [overview, setOverview] = useState(emptyOverview)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroupDetail, setSelectedGroupDetail] = useState(emptyGroupDetail)
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
  const [isLoadingGroupDetail, setIsLoadingGroupDetail] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null)
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    let isMounted = true

    const fetchGroups = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setGroups([])
          setOverview(emptyOverview)
          setSelectedGroupId('')
          setSelectedGroupDetail(emptyGroupDetail)
          setIsLoadingGroups(false)
        }
        return
      }

      setIsLoadingGroups(true)

      try {
        const data = await groupService.listGroups()

        if (!isMounted) {
          return
        }

        setGroups(data.groups || [])
        setOverview(data.overview || emptyOverview)

        if (!data.groups?.length) {
          setSelectedGroupId('')
          setSelectedGroupDetail(emptyGroupDetail)
          return
        }

        const groupStillExists = data.groups.some((group) => group.id === selectedGroupId)
        const nextSelectedGroupId = groupStillExists ? selectedGroupId : data.groups[0].id
        setSelectedGroupId(nextSelectedGroupId)
      } catch (error) {
        if (isMounted) {
          setFeedback({
            type: 'error',
            message: error.message,
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingGroups(false)
        }
      }
    }

    fetchGroups()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, refreshKey, selectedGroupId])

  useEffect(() => {
    let isMounted = true

    const fetchGroupDetail = async () => {
      if (!isAuthenticated || !selectedGroupId) {
        if (isMounted) {
          setSelectedGroupDetail(emptyGroupDetail)
        }
        return
      }

      setIsLoadingGroupDetail(true)

      try {
        const data = await groupService.getGroup(selectedGroupId)

        if (isMounted) {
          setSelectedGroupDetail(normalizeGroupDetail(data))
        }
      } catch (error) {
        if (isMounted) {
          setSelectedGroupDetail(emptyGroupDetail)
          setFeedback({
            type: 'error',
            message: error.message,
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingGroupDetail(false)
        }
      }
    }

    fetchGroupDetail()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, selectedGroupId, refreshKey])

  const refreshDashboard = () => {
    setRefreshKey((currentValue) => currentValue + 1)
  }

  const createGroup = async (values) => {
    setIsMutating(true)

    try {
      const data = await groupService.createGroup(values)
      setSelectedGroupId(data.group.id)
      setSelectedGroupDetail(normalizeGroupDetail(data))
      setFeedback({
        type: 'success',
        message: 'Group created successfully.',
      })
      refreshDashboard()
      return data
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  const addMember = async (email) => {
    setIsMutating(true)

    try {
      const data = await groupService.addMember(selectedGroupId, { email })
      setSelectedGroupDetail(normalizeGroupDetail(data))
      setFeedback({
        type: 'success',
        message: 'Member added successfully.',
      })
      refreshDashboard()
      return data
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  const removeMember = async (memberId) => {
    setIsMutating(true)

    try {
      const data = await groupService.removeMember(selectedGroupId, memberId)
      setSelectedGroupDetail(normalizeGroupDetail(data))
      setFeedback({
        type: 'success',
        message: 'Member removed successfully.',
      })
      refreshDashboard()
      return data
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  const addExpense = async (values) => {
    setIsMutating(true)

    try {
      const data = await expenseService.createExpense(selectedGroupId, values)
      setSelectedGroupDetail(normalizeGroupDetail(data))
      setFeedback({
        type: 'success',
        message: 'Expense added successfully.',
      })
      refreshDashboard()
      return data
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  return {
    addExpense,
    addMember,
    createGroup,
    feedback,
    groups,
    isLoadingGroupDetail,
    isLoadingGroups,
    isMutating,
    overview,
    refreshDashboard,
    removeMember,
    selectedGroupDetail,
    selectedGroupId,
    setFeedback,
    setSelectedGroupId,
  }
}
