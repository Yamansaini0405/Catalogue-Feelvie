import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import SidebarLayout from './components/SidebarLayout'
import AddProductPage from './pages/AddProductPage'
import AddVariantPage from './pages/AddVariantPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetailPage'
import PublicProductDetailPage from './pages/PublicProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import RegisterPage from './pages/RegisterPage'
import SharedProductPage from './pages/SharedProductPage'
import EthnicWearQuotePage from './pages/EthnicWearQuotePage'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to='/login' replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/register' replace />} />
      <Route path='/register' element={<><ScrollToTop /><RegisterPage /></>} />
      <Route path='/login' element={<><ScrollToTop /><LoginPage /></>} />
      <Route path='/products' element={<><ScrollToTop /><ProductsPage /></>} />
      <Route path='/product/:id' element={<><ScrollToTop /><PublicProductDetailPage /></>} />
      <Route path='/product/:ask-quoteid' element={<><ScrollToTop /><SharedProductPage /></>} />
      <Route
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path='/home' element={<><ScrollToTop /><HomePage /></>} />
        <Route path='/view-products' element={<><ScrollToTop /><DashboardPage /></>} />
        <Route path='/products/:id' element={<><ScrollToTop /><ProductDetailPage /></>} />
        <Route path='/add-product' element={<><ScrollToTop /><AddProductPage /></>} />
        <Route path='/add-variant' element={<><ScrollToTop /><AddVariantPage /></>} />
        
      </Route>
      <Route path='/ask-quote' element={<><ScrollToTop /><EthnicWearQuotePage /></>} />
      <Route path='*' element={<Navigate to='/register' replace />} />
    </Routes>
  )
}

export default App