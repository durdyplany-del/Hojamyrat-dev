<template>
  <div class="products-page">
    <div class="page-header">
      <div class="header-left">
        <h2>Products</h2>
        <p>List of all products</p>
      </div>
      <button class="btn-primary" @click="openModal()">
        <span>➕</span> Add Product
      </button>
    </div>
    
    <div class="card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>
      
      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No Products</h3>
        <p>Add your first product</p>
        <button class="btn-primary" @click="openModal()">
          <span>➕</span> Add Product
        </button>
      </div>
      
      <div v-else class="products-grouped">
        <div v-for="group in groupedProducts" :key="group.date" class="date-group">
          <div class="group-header">
            <span class="group-date">📅 {{ group.date === 'belli-emes' ? 'No Date' : formatDate(group.date) }}</span>
            <span class="group-count">{{ group.products.length }} products</span>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>Quantity</th>
                  <th>Profit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in group.products" :key="product.id">
                  <td class="id-cell">#{{ product.id }}</td>
                  <td class="name-cell">
                    <div class="product-info">
                      <span class="product-icon">📦</span>
                      {{ product.name }}
                    </div>
                  </td>
                  <td class="price-cell">{{ formatNumber(product.buyPrice) }} TMT</td>
                  <td class="price-cell">{{ formatNumber(product.sellPrice) }} TMT</td>
                  <td>
                    <span :class="['badge', product.quantity > 10 ? 'success' : product.quantity > 0 ? 'warning' : 'danger']">
                      {{ product.quantity }} {{ getUnitLabel(product.unit) }}
                    </span>
                  </td>
                  <td class="profit-cell">
                    <span :class="['profit', getProfit(product) > 0 ? 'positive' : 'negative']">
                      {{ getProfit(product) > 0 ? '+' : '' }}{{ formatNumber(getProfit(product)) }} TMT
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon edit" @click="openModal(product)" title="Üýtget">
                        ✏️
                      </button>
                      <button class="btn-icon delete" @click="handleDelete(product.id)" title="Poçel">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="form-group">
              <label>Product Name *</label>
              <input 
                v-model="form.name" 
                type="text" 
                class="form-input" 
                placeholder="Product name"
                required
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Buy Price (TMT) *</label>
                <input 
                  v-model.number="form.buyPrice" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                >
              </div>
              
              <div class="form-group">
                <label>Sell Price (TMT) *</label>
                <input 
                  v-model.number="form.sellPrice" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Unit</label>
                <select v-model="form.unit" class="form-input">
                  <option value="st">Count (st)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="l">Liter (l)</option>
                  <option value="meter">Meter (m)</option>
                  <option value="pak">Pack (pak)</option>
                  <option value="quti">Box (quti)</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Quantity *</label>
                <input 
                  v-model.number="form.quantity" 
                  type="number" 
                  class="form-input" 
                  placeholder="0"
                  min="0"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label>Purchase Date</label>
              <input 
                v-model="form.purchaseDate" 
                type="date" 
                class="form-input" 
              >
            </div>
            
            <div v-if="form.buyPrice && form.sellPrice" class="profit-preview">
              <span>Estimated Profit:</span>
              <span :class="form.sellPrice - form.buyPrice > 0 ? 'positive' : 'negative'">
                {{ formatNumber(form.sellPrice - form.buyPrice) }} TMT ({{ Math.round((form.sellPrice - form.buyPrice) / form.buyPrice * 100) }}%)
              </span>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner"></span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useDashboardStore } from '@/stores/dashboard'

const productStore = useProductStore()
const dashboardStore = useDashboardStore()

const showModal = ref(false)
const editingProduct = ref(null)
const submitting = ref(false)

const form = ref({
  name: '',
  buyPrice: 0,
  sellPrice: 0,
  quantity: 0,
  purchaseDate: '',
  unit: 'st'
})

const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)

const groupedProducts = computed(() => {
  const sortedProducts = [...products.value].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })
  
  const groups = {}
  sortedProducts.forEach(product => {
    const dateKey = product.purchaseDate || 'belli-emes'
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        products: []
      }
    }
    groups[dateKey].products.push(product)
  })
  return Object.values(groups).sort((a, b) => {
    if (a.date === 'belli-emes') return 1
    if (b.date === 'belli-emes') return -1
    return new Date(b.date) - new Date(a.date)
  })
})

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tk-TM')
}

const getProfit = (product) => {
  return (product.sellPrice || 0) - (product.buyPrice || 0)
}

const getUnitLabel = (unit) => {
  const labels = {
    'st': 'sany',
    'kg': 'kg',
    'l': 'l',
    'meter': 'm',
    'pak': 'pak',
    'quti': 'quti'
  }
  return labels[unit] || 'sany'
}

const openModal = (product = null) => {
  editingProduct.value = product
  if (product) {
    form.value = { 
      name: product.name,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      quantity: product.quantity,
      purchaseDate: product.purchaseDate || '',
      unit: product.unit || 'st'
    }
  } else {
    form.value = { name: '', buyPrice: 0, sellPrice: 0, quantity: 0, purchaseDate: '', unit: 'st' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, form.value)
    } else {
      await productStore.createProduct(form.value)
    }
    await dashboardStore.fetchDashboardStats()
    closeModal()
  } catch (error) {
    alert('Säwlik boldy!')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  if (confirm('Poçelemse?')) {
    await productStore.deleteProduct(id)
    await dashboardStore.fetchDashboardStats()
  }
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<style scoped>
.products-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  padding: 0.75rem 1.25rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.loading-state,
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

.products-grouped {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.date-group {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.group-header {
  background: #f1f5f9;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.group-date {
  font-weight: 600;
  color: #1e293b;
}

.group-count {
  font-size: 0.85rem;
  color: #64748b;
}

.date-group .table-wrapper {
  margin: 0;
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
  font-size: 0.9rem;
}

tr:hover {
  background: #f8fafc;
}

.id-cell {
  color: #94a3b8;
  font-weight: 600;
}

.name-cell .product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.product-icon {
  font-size: 1.25rem;
}

.price-cell {
  font-weight: 600;
  color: #1e293b;
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

.profit-cell .profit {
  font-weight: 600;
}

.profit.positive {
  color: #22c55e;
}

.profit.negative {
  color: #dc2626;
}

.date-cell {
  color: #94a3b8;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-icon.edit {
  background: #fef3c7;
}

.btn-icon.edit:hover {
  background: #fde68a;
}

.btn-icon.delete {
  background: #fee2e2;
}

.btn-icon.delete:hover {
  background: #fecaca;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #64748b;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.profit-preview {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.profit-preview .positive {
  color: #22c55e;
  font-weight: 600;
}

.profit-preview .negative {
  color: #dc2626;
  font-weight: 600;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
