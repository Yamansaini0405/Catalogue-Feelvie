import { Navigate, Route, Routes } from 'react-router-dom'
import SidebarLayout from './components/SidebarLayout'
import AddProductPage from './pages/AddProductPage'
import AddVariantPage from './pages/AddVariantPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import RegisterPage from './pages/RegisterPage'
import SharedProductPage from './pages/SharedProductPage'

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
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/products' element={<ProductsPage />} />
      <Route path='/product/:id' element={<SharedProductPage />} />
      <Route
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path='/home' element={<HomePage />} />
        <Route path='/view-products' element={<DashboardPage />} />
        <Route path='/products/:id' element={<ProductDetailPage />} />
        <Route path='/add-product' element={<AddProductPage />} />
        <Route path='/add-variant' element={<AddVariantPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/register' replace />} />
    </Routes>
  )
}

export default App