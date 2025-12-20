import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'

const store = configureStore({
  reducer: {
    auth: auth
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store