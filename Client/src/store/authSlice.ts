import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface AuthState {
  userData: object,
  status: boolean
}

const initialState: AuthState = {
  userData: {},
  status: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<object>) => {
        state.userData = action.payload
        state.status = true
    },
    logout: (state) => {
        state.userData = {}
        state.status = false
    }
  },
})

export const { login, logout } = authSlice.actions

export const userStatus = (state: RootState) => state.auth.status

export default authSlice.reducer