import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null
    try {
      const stored = localStorage.getItem('user')
      if (stored && stored !== 'undefined') {
        user = JSON.parse(stored)
      }
    } catch (e) {
      user = null
    }
    return {
      user,
      token: localStorage.getItem('token') || null
    }
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)
        this.token = response.data.data.token
        this.user = response.data.data.user
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        api.defaults.headers.common['Authorization'] = this.token
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Login failed' 
        }
      }
    },
    
    async register(userData) {
      try {
        await api.post('/register', userData)
        return { success: true, message: 'Registered successfully' }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Registration failed' 
        }
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
    },
    
    initialize() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = this.token
      }
    }
  }
})
