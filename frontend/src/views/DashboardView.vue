<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in mainStats" :key="stat.label" class="stat-card" :class="stat.class">
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <h3>Today's Statistics</h3>
          <span class="badge-today">🏆</span>
        </div>
        <div class="mini-stats">
          <div class="mini-stat">
            <span class="mini-label">Sales Count</span>
            <span class="mini-value">{{ dailyStats.total_sales || 0 }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">Total</span>
            <span class="mini-value currency">{{ formatNumber(dailyStats.total_amount) }} TMT</span>
          </div>
          <div class="mini-stat highlight">
            <span class="mini-label">Profit</span>
            <span class="mini-value currency">{{ formatNumber(dailyStats.profit) }} TMT</span>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Weekly Statistics</h3>
          <span class="badge-today">📅</span>
        </div>
        <div class="mini-stats">
          <div class="mini-stat">
            <span class="mini-label">Sales Count</span>
            <span class="mini-value">{{ weeklyStats.total_sales || 0 }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">Total</span>
            <span class="mini-value currency">{{ formatNumber(weeklyStats.total_amount) }} TMT</span>
          </div>
          <div class="mini-stat highlight">
            <span class="mini-label">Profit</span>
            <span class="mini-value currency">{{ formatNumber(weeklyStats.profit) }} TMT</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="action-buttons">
        <router-link to="/products" class="action-btn primary">
          <span class="action-icon">➕</span>
          <span>Add Product</span>
        </router-link>
        <router-link to="/sales" class="action-btn success">
          <span class="action-icon">💰</span>
          <span>New Sale</span>
        </router-link>
        <router-link to="/statistics" class="action-btn info">
          <span class="action-icon">📊</span>
          <span>Statistics</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

const stats = computed(() => dashboardStore.stats)
const dailyStats = computed(() => dashboardStore.dailyStats)
const weeklyStats = computed(() => dashboardStore.weeklyStats)

const mainStats = computed(() => [
  {
    label: 'Total Products',
    value: stats.value.total_products || 0,
    icon: '📦',
    class: 'primary'
  },
  {
    label: 'Products Sold',
    value: stats.value.total_sold || 0,
    icon: '✅',
    class: 'success'
  },
  {
    label: 'Remaining Products',
    value: stats.value.total_remaining || 0,
    icon: '📋',
    class: 'warning'
  },
  {
    label: 'Sold (TMT)',
    value: formatNumber(stats.value.total_sold_amount),
    icon: '💵',
    class: 'info'
  },
  {
    label: 'Stock Value (TMT)',
    value: formatNumber(stats.value.stock_value),
    icon: '🏷️',
    class: 'secondary'
  },
  {
    label: 'Total Profit (TMT)',
    value: formatNumber(stats.value.profit),
    icon: '📈',
    class: 'success'
  }
])

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(() => {
  dashboardStore.initSocket()
  dashboardStore.fetchDashboardStats()
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.stat-card.primary .stat-icon { background: #e0e7ff; }
.stat-card.success .stat-icon { background: #dcfce7; }
.stat-card.warning .stat-icon { background: #fef3c7; }
.stat-card.info .stat-icon { background: #dbeafe; }
.stat-card.secondary .stat-icon { background: #f3e8ff; }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.badge-today {
  font-size: 1.5rem;
}

.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.mini-stat {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.mini-stat.highlight {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.mini-stat.highlight .mini-label,
.mini-stat.highlight .mini-value {
  color: white;
}

.mini-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.mini-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.mini-value.currency::before {
  content: 'TMT ';
  font-size: 0.9rem;
}

.quick-actions h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.action-btn.success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.action-btn.info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.action-icon {
  font-size: 1.25rem;
}
</style>
