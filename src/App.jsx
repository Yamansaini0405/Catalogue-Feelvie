import { Navigate, Route, Routes } from 'react-router-dom'
import SidebarLayout from './components/SidebarLayout'
import AddProductPage from './pages/AddProductPage'
import AddVariantPage from './pages/AddVariantPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetailPage'
import RegisterPage from './pages/RegisterPage'

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