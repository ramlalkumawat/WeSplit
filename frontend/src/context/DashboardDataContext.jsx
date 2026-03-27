import { useEffect, useReducer, useRef, useState } from 'react'
import expenseService from '../services/expenseService'
import groupService from '../services/groupService'
import { useAuth } from '../hooks/useAuth'
import { DashboardDataContext } from './dashboardDataContext.js'

const emptyOverview = {
  groupCount: 0,
  totalOwed: 0,
  totalOwe: 0,
  netBalance: 0,
}

const emptyGroupDetail = null

const initialState = {
  feedback: null,
  groups: [],
  isLoadingGroupDetail: false,
  isLoadingGroups: false,
  isMutating: false,
  overview: emptyOverview,
  selectedGroupDetail: emptyGroupDetail,
  selectedGroupId: '',
}

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

function dashboardDataReducer(state, action) {
  switch (action.type) {
    case 'RESET_STATE':
      return initialState
    case 'GROUPS_REQUEST':
      return {
        ...state,
        isLoadingGroups: true,
      }
    case 'GROUPS_SUCCESS':
      return {
        ...state,
        groups: action.payload.groups,
        isLoadingGroups: false,
        overview: action.payload.overview,
        selectedGroupDetail: action.payload.selectedGroupId ? state.selectedGroupDetail : null,
        selectedGroupId: action.payload.selectedGroupId,
      }
    case 'GROUPS_FAILURE':
      return {
        ...state,
        isLoadingGroups: false,
      }
    case 'SET_SELECTED_GROUP_ID':
      if (action.payload === state.selectedGroupId) {
        return state
      }

      return {
        ...state,
        selectedGroupDetail: null,
        selectedGroupId: action.payload,
      }
    case 'GROUP_DETAIL_REQUEST':
      return {
        ...state,
        isLoadingGroupDetail: true,
      }
    case 'GROUP_DETAIL_SUCCESS':
      return {
        ...state,
        isLoadingGroupDetail: false,
        selectedGroupDetail: action.payload,
      }
    case 'GROUP_DETAIL_FAILURE':
      return {
        ...state,
        isLoadingGroupDetail: false,
        selectedGroupDetail: null,
      }
    case 'MUTATION_START':
      return {
        ...state,
        isMutating: true,
      }
    case 'MUTATION_END':
      return {
        ...state,
        isMutating: false,
      }
    case 'SET_FEEDBACK':
      return {
        ...state,
        feedback: action.payload,
      }
    case 'CLEAR_FEEDBACK':
      return {
        ...state,
        feedback: null,
      }
    default:
      return state
  }
}

export function DashboardDataProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [state, dispatch] = useReducer(dashboardDataReducer, initialState)
  const [refreshKey, setRefreshKey] = useState(0)
  const selectedGroupIdRef = useRef(state.selectedGroupId)

  useEffect(() => {
    selectedGroupIdRef.current = state.selectedGroupId
  }, [state.selectedGroupId])

  useEffect(() => {
    if (!state.feedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_FEEDBACK' })
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [state.feedback])

  useEffect(() => {
    let isMounted = true

    const fetchGroups = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          dispatch({ type: 'RESET_STATE' })
        }

        return
      }

      dispatch({ type: 'GROUPS_REQUEST' })

      try {
        const data = await groupService.listGroups()

        if (!isMounted) {
          return
        }

        const groups = data.groups || []
        const nextSelectedGroupId = groups.some(
          (group) => group.id === selectedGroupIdRef.current,
        )
          ? selectedGroupIdRef.current
          : groups[0]?.id || ''

        dispatch({
          type: 'GROUPS_SUCCESS',
          payload: {
            groups,
            overview: data.overview || emptyOverview,
            selectedGroupId: nextSelectedGroupId,
          },
        })
      } catch (error) {
        if (isMounted) {
          dispatch({ type: 'GROUPS_FAILURE' })
          dispatch({
            type: 'SET_FEEDBACK',
            payload: {
              type: 'error',
              message: error.message,
            },
          })
        }
      }
    }

    fetchGroups()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, refreshKey])

  useEffect(() => {
    let isMounted = true

    const fetchGroupDetail = async () => {
      if (!isAuthenticated || !state.selectedGroupId) {
        if (isMounted) {
          dispatch({ type: 'GROUP_DETAIL_FAILURE' })
        }

        return
      }

      dispatch({ type: 'GROUP_DETAIL_REQUEST' })

      try {
        const data = await groupService.getGroup(state.selectedGroupId)

        if (isMounted) {
          dispatch({
            type: 'GROUP_DETAIL_SUCCESS',
            payload: normalizeGroupDetail(data),
          })
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: 'GROUP_DETAIL_FAILURE' })
          dispatch({
            type: 'SET_FEEDBACK',
            payload: {
              type: 'error',
              message: error.message,
            },
          })
        }
      }
    }

    fetchGroupDetail()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, refreshKey, state.selectedGroupId])

  const refreshDashboard = () => {
    setRefreshKey((currentValue) => currentValue + 1)
  }

  const setFeedback = (payload) => {
    dispatch({
      type: 'SET_FEEDBACK',
      payload,
    })
  }

  const setSelectedGroupId = (groupId) => {
    dispatch({
      type: 'SET_SELECTED_GROUP_ID',
      payload: groupId,
    })
  }

  const createGroup = async (values) => {
    dispatch({ type: 'MUTATION_START' })

    try {
      const data = await groupService.createGroup(values)

      dispatch({
        type: 'SET_SELECTED_GROUP_ID',
        payload: data.group.id,
      })
      dispatch({
        type: 'GROUP_DETAIL_SUCCESS',
        payload: normalizeGroupDetail(data),
      })
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
      dispatch({ type: 'MUTATION_END' })
    }
  }

  const addMember = async (email) => {
    dispatch({ type: 'MUTATION_START' })

    try {
      const data = await groupService.addMember(state.selectedGroupId, { email })

      dispatch({
        type: 'GROUP_DETAIL_SUCCESS',
        payload: normalizeGroupDetail(data),
      })
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
      dispatch({ type: 'MUTATION_END' })
    }
  }

  const removeMember = async (memberId) => {
    dispatch({ type: 'MUTATION_START' })

    try {
      const data = await groupService.removeMember(state.selectedGroupId, memberId)

      dispatch({
        type: 'GROUP_DETAIL_SUCCESS',
        payload: normalizeGroupDetail(data),
      })
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
      dispatch({ type: 'MUTATION_END' })
    }
  }

  const addExpense = async (values) => {
    dispatch({ type: 'MUTATION_START' })

    try {
      const data = await expenseService.createExpense(state.selectedGroupId, values)

      dispatch({
        type: 'GROUP_DETAIL_SUCCESS',
        payload: normalizeGroupDetail(data),
      })
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
      dispatch({ type: 'MUTATION_END' })
    }
  }

  return (
    <DashboardDataContext.Provider
      value={{
        ...state,
        addExpense,
        addMember,
        createGroup,
        refreshDashboard,
        removeMember,
        setFeedback,
        setSelectedGroupId,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  )
}
