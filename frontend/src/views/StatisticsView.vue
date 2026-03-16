<template>
  <div class="statistics-page">
    <div class="page-header">
      <div class="header-left">
        <h2>Statistics</h2>
        <p>Sales and revenue statistics</p>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3>📊 Product Statistics</h3>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>
      
      <div v-else-if="productStats.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <p>No data</p>
      </div>
      
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold</th>
              <th>Remaining</th>
              <th>Revenue</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in productStats" :key="stat.product_id">
              <td class="name-cell">
                <span class="product-icon">📦</span>
                {{ stat.product_name }}
              </td>
              <td>
                <span class="badge success">{{ stat.total_sold }}</span>
              </td>
              <td>
                <span :class="['badge', stat.remaining > 0 ? 'warning' : 'danger']">
                  {{ stat.remaining }}
                </span>
              </td>
              <td class="revenue-cell">{{ formatNumber(stat.total_revenue) }} TMT</td>
              <td>
                <div class="progress-bar">
                  <div 
                    class="progress" 
                    :style="{ width: getPercentage(stat.total_revenue) + '%' }"
                  ></div>
                </div>
                <span class="percentage">{{ getPercentage(stat.total_revenue) }}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="charts-grid">
      <div class="card">
        <div class="card-header">
          <h3>📈 Hepdelik statistika</h3>
        </div>
        <div class="chart-container">
          <canvas ref="weeklyChartRef"></canvas>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>🥧 Girdeji paýlanmasy</h3>
        </div>
        <div class="chart-container">
          <canvas ref="revenueChartRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useDashboardStore } from '@/stores/dashboard'

Chart.register(...registerables)

const dashboardStore = useDashboardStore()

const weeklyChartRef = ref(null)
const revenueChartRef = ref(null)
let weeklyChart = null
let revenueChart = null

const productStats = computed(() => dashboardStore.productStats)
const weeklyStats = computed(() => dashboardStore.weeklyStats)
const loading = computed(() => dashboardStore.loading)

const totalRevenue = computed(() => {
  return productStats.value.reduce((sum, p) => sum + p.total_revenue, 0)
})

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getPercentage = (value) => {
  if (totalRevenue.value === 0) return 0
  return Math.round((value / totalRevenue.value) * 100)
}

const renderCharts = async () => {
  await nextTick()
  
  // Weekly Chart
  if (weeklyChartRef.value) {
    if (weeklyChart) weeklyChart.destroy()
    
    weeklyChart = new Chart(weeklyChartRef.value, {
      type: 'bar',
      data: {
        labels: ['Hepdelik statistika'],
        datasets: [
          {
            label: 'Jemi (TMT)',
            data: [weeklyStats.value.total_amount || 0],
            backgroundColor: '#6366f1',
            borderRadius: 8
          },
          {
            label: 'Peýda (TMT)',
            data: [weeklyStats.value.profit || 0],
            backgroundColor: '#22c55e',
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
  
  // Revenue Distribution Chart
  if (revenueChartRef.value && productStats.value.length > 0) {
    if (revenueChart) revenueChart.destroy()
    
    const colors = [
      '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6',
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ]
    
    revenueChart = new Chart(revenueChartRef.value, {
      type: 'doughnut',
      data: {
        labels: productStats.value.map(p => p.product_name),
        datasets: [{
          data: productStats.value.map(p => p.total_revenue),
          backgroundColor: colors.slice(0, productStats.value.length),
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              usePointStyle: true
            }
          }
        },
        cutout: '60%'
      }
    })
  }
}

onMounted(async () => {
  await dashboardStore.fetchProductStats()
  await dashboardStore.fetchDashboardStats()
  renderCharts()
})
</script>

<style scoped>
.statistics-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  margin-bottom: 1.5rem;
}

.header-left h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.header-left p {
  color: #64748b;
  font-size: 0.9rem;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.loading-state {
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.product-icon {
  font-size: 1.25rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.success {
  background: #dcfce7;
  color: #16a34a;
}

.badge.warning {
  background: #fef3c7;
  color: #d97706;
}

.badge.danger {
  background: #fee2e2;
  color: #dc2626;
}

.revenue-cell {
  font-weight: 600;
  color: #1e293b;
}

.progress-bar {
  width: 100px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.percentage {
  font-size: 0.8rem;
  color: #64748b;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  padding: 1.5rem;
  height: 300px;
}
</style>
