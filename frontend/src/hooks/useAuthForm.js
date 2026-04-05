import { useReducer } from 'react'
import {
  AUTH_INITIAL_VALUES,
  mapAuthServerError,
  normalizeAuthValues,
  validateLoginValues,
  validateSignupValues,
} from '../utils/validation/authValidation'

const buildInitialState = (mode) => ({
  detailMessages: [],
  errors: {},
  formError: '',
  isSubmitting: false,
  values: { ...AUTH_INITIAL_VALUES[mode] },
})

function authFormReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_FIELD':
      return {
        ...state,
        detailMessages: [],
        errors: {
          ...state.errors,
          [action.name]: '',
        },
        formError: '',
        values: {
          ...state.values,
          [action.name]: action.value,
        },
      }
    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        detailMessages: [],
        errors: action.payload,
        formError: '',
      }
    case 'SUBMIT_START':
      return {
        ...state,
        detailMessages: [],
        errors: {},
        formError: '',
        isSubmitting: true,
      }
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        detailMessages: action.payload.detailMessages,
        errors: action.payload.fieldErrors,
        formError: action.payload.formError,
        isSubmitting: false,
      }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
      }
    default:
      return state
  }
}

export function useAuthForm({ mode, onSubmit, onSuccess }) {
  const [state, dispatch] = useReducer(authFormReducer, mode, buildInitialState)

  const validate = mode === 'signup' ? validateSignupValues : validateLoginValues

  const handleChange = (event) => {
    const { name, value } = event.target

    dispatch({
      type: 'CHANGE_FIELD',
      name,
      value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextValues = normalizeAuthValues(mode, state.values)
    const validationErrors = validate(nextValues)

    if (Object.keys(validationErrors).length > 0) {
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        payload: validationErrors,
      })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      await onSubmit(nextValues)
      dispatch({ type: 'SUBMIT_SUCCESS' })
      onSuccess?.()
    } catch (error) {
      dispatch({
        type: 'SUBMIT_FAILURE',
        payload: mapAuthServerError(error),
      })
    }
  }

  return {
    detailMessages: state.detailMessages,
    errors: state.errors,
    formError: state.formError,
    handleChange,
    handleSubmit,
    isSubmitting: state.isSubmitting,
    values: state.values,
  }
}
