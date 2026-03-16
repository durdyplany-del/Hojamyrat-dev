import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getProducts: (state) => state.products,
    getProductById: (state) => (id) => state.products.find(p => p.id === id)
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/products')
        this.products = response.data.data || response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async createProduct(productData) {
      try {
        const response = await api.post('/products', productData)
        this.products.push(response.data.data || response.data)
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to create product' 
        }
      }
    },
    
    async updateProduct(id, productData) {
      try {
        const response = await api.put(`/products/${id}`, productData)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data.data || response.data
        }
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to update product' 
        }
      }
    },
    
    async deleteProduct(id) {
      try {
        await api.delete(`/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to delete product' 
        }
      }
    }
  }
})
