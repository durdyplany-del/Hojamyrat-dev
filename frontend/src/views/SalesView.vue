<template>
  <div class="sales-page">
    <div class="page-header">
      <div class="header-left">
        <h2>Sales</h2>
        <p>List of all sales</p>
      </div>
      <button class="btn-primary" @click="showModal = true">
        <span>💰</span> New Sale
      </button>
    </div>
    
    <div class="card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>
      
      <div v-else-if="sales.length === 0" class="empty-state">
        <div class="empty-icon">💰</div>
        <h3>No Sales</h3>
        <p>Create your first sale</p>
        <button class="btn-primary" @click="showModal = true">
          <span>💰</span> New Sale
        </button>
      </div>
      
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Profit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale.id">
              <td class="id-cell">#{{ sale.id }}</td>
              <td class="name-cell">
                <div class="product-info">
                  <span class="product-icon">📦</span>
                  {{ sale.product?.name || '-' }}
                </div>
              </td>
              <td>
                <span class="quantity-badge">{{ sale.quantity }}</span>
              </td>
              <td class="price-cell">{{ formatNumber(sale.totalPrice / sale.quantity) }} TMT</td>
              <td class="total-cell">{{ formatNumber(sale.totalPrice) }} TMT</td>
              <td>
                <span :class="['profit', getProfit(sale) > 0 ? 'positive' : 'negative']">
                  {{ getProfit(sale) > 0 ? '+' : '' }}{{ formatNumber(getProfit(sale)) }} TMT
                </span>
              </td>
              <td class="date-cell">{{ formatDate(sale.soldAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>New Sale</h3>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="form-group">
              <label>Product *</label>
              <select v-model="form.productId" class="form-select" required>
                <option value="">Select product</option>
                <option 
                  v-for="product in availableProducts" 
                  :key="product.id" 
                  :value="product.id"
                >
                  {{ product.name }} ({{ product.quantity }} {{ getUnitLabel(product.unit) }} - {{ formatNumber(product.sellPrice) }} TMT)
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Quantity *</label>
              <input 
                v-model.number="form.quantity" 
                type="number" 
                class="form-input" 
                placeholder="0"
                min="1"
                required
              >
            </div>
            
            <div v-if="selectedProduct" class="sale-summary">
              <div class="summary-row">
                <span>Haryt:</span>
                <strong>{{ selectedProduct.name }}</strong>
              </div>
              <div class="summary-row">
                <span>Satış bahasy:</span>
                <strong>{{ formatNumber(selectedProduct.sellPrice) }} TMT</strong>
              </div>
              <div class="summary-row">
                <span>Sany:</span>
                <strong>{{ form.quantity }}</strong>
              </div>
              <div class="summary-row total">
                <span>Jemi:</span>
                <strong>{{ formatNumber((selectedProduct.sellPrice || 0) * (form.quantity || 0)) }} TMT</strong>
              </div>
              <div class="summary-row profit">
                <span>Görlüşi peýda:</span>
                <strong :class="getProfitFromProduct(selectedProduct) > 0 ? 'positive' : 'negative'">
                  {{ formatNumber(getProfitFromProduct(selectedProduct) * (form.quantity || 0)) }} TMT
                </strong>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner"></span>
              <span v-else>Create Sale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSaleStore } from '@/stores/sale'
import { useProductStore } from '@/stores/product'
import { useDashboardStore } from '@/stores/dashboard'

const saleStore = useSaleStore()
const productStore = useProductStore()
const dashboardStore = useDashboardStore()

const showModal = ref(false)
const submitting = ref(false)

const form = ref({
  productId: '',
  quantity: 1
})

const sales = computed(() => saleStore.sales)
const loading = computed(() => saleStore.loading)
const products = computed(() => productStore.products)

const availableProducts = computed(() => 
  products.value.filter(p => p.quantity > 0)
)

const selectedProduct = computed(() => 
  products.value.find(p => p.id === form.value.productId)
)

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('tk-TM')
}

const getProfit = (sale) => {
  if (!sale.product) return 0
  return (sale.totalPrice / sale.quantity) - sale.product.buyPrice
}

const getProfitFromProduct = (product) => {
  if (!product) return 0
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

const handleSubmit = async () => {
  if (!form.value.productId || form.value.quantity < 1) return
  
  submitting.value = true
  try {
    const result = await saleStore.createSale(form.value)
    if (result.success) {
      await productStore.fetchProducts()
      await dashboardStore.fetchDashboardStats()
      showModal.value = false
      form.value = { productId: '', quantity: 1 }
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('Säwlik boldy!')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  saleStore.fetchSales()
  productStore.fetchProducts()
})
</script>

<style scoped>
.sales-page {
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
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

.btn-secondary {
  padding: 0.75rem 1.25rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
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
  border-top-color: #22c55e;
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

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.product-icon {
  font-size: 1.25rem;
}

.quantity-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 20px;
  font-weight: 600;
}

.price-cell {
  font-weight: 500;
}

.total-cell {
  font-weight: 700;
  color: #1e293b;
}

.profit {
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
  font-size: 0.85rem;
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
}

.modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #22c55e;
}

.sale-summary {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.summary-row.total {
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
}

.summary-row.profit {
  color: #64748b;
}

.summary-row .positive {
  color: #22c55e;
}

.summary-row .negative {
  color: #dc2626;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
