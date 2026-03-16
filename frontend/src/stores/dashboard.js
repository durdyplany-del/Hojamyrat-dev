import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import { useSocket } from '@/composables/useSocket'

const { on, connect } = useSocket()

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {},
    dailyStats: {},
    weeklyStats: {},
    productStats: [],
    loading: false,
    error: null
  }),
  
  actions: {
    initSocket() {
      const socket = connect()
      
      on('saleCreated', () => {
        this.fetchDashboardStats()
      })
      
      on('productUpdated', () => {
        this.fetchDashboardStats()
      })
      
      on('productCreated', () => {
        this.fetchDashboardStats()
      })
    },
    
    async fetchDashboardStats() {
      this.loading = true
      try {
        const [statsRes, dailyRes, weeklyRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/sales/daily'),
          api.get('/sales/weekly')
        ])
        
        const statsData = statsRes.data.data || statsRes.data
        this.stats = {
          total_products: statsData.totalProducts,
          total_sold: statsData.totalSold,
          total_remaining: statsData.totalRemaining,
          total_sold_amount: statsData.totalSoldAmount,
          stock_value: statsData.stockValue,
          profit: statsData.profit
        }
        
        const dailyData = dailyRes.data.data || dailyRes.data
        this.dailyStats = {
          total_sales: dailyData.totalSales,
          total_amount: dailyData.totalAmount,
          profit: dailyData.profit
        }
        
        const weeklyData = weeklyRes.data.data || weeklyRes.data
        this.weeklyStats = {
          total_sales: weeklyData.totalSales,
          total_amount: weeklyData.totalAmount,
          profit: weeklyData.profit
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async fetchProductStats() {
      try {
        const response = await api.get('/dashboard/products')
        this.productStats = response.data.data || response.data
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
