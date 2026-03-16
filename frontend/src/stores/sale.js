import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useSaleStore = defineStore('sale', {
  state: () => ({
    sales: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getSales: (state) => state.sales
  },
  
  actions: {
    async fetchSales() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/sales')
        this.sales = response.data.data || response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async createSale(saleData) {
      try {
        const response = await api.post('/sales', saleData)
        this.sales.unshift(response.data.data || response.data)
        return { success: true, data: response.data.data || response.data }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to create sale' 
        }
      }
    }
  }
})
