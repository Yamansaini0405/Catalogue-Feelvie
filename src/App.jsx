import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import { ROUTES } from './constants/routes'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import PublicProductDetailPage from './pages/PublicProductDetailPage'
import PublicCataloguePage from './pages/PublicCataloguePage'
import SharedProductPage from './pages/SharedProductPage'
import DashboardPage from './pages/DashboardPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AddProductPage from './pages/AddProductPage'
import AddVariantPage from './pages/AddVariantPage'
import ProfilePage from './pages/ProfilePage'
import EthnicWearQuotePage from './pages/EthnicWearQuotePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AccountDeletePage from './pages/AccountDeletePage'
import ChatBot from './pages/ChatBot'
import NotFoundPage from './pages/NotFoundPage'
import CatalogueProductDetailPage from './pages/CatalogueProductDetailPage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.REGISTER} replace />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.PRODUCTS_PUBLIC} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCT_PUBLIC()} element={<PublicProductDetailPage />} />
        <Route path="/product/:id/share" element={<SharedProductPage />} />
        <Route path={ROUTES.CATALOGUE_PUBLIC()} element={<PublicCataloguePage />} />
        <Route path="/catalogue/:id" element={<CatalogueProductDetailPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL()} element={<ProductDetailPage />} />
          <Route path={ROUTES.ADD_PRODUCT} element={<AddProductPage />} />
          <Route path={ROUTES.ADD_VARIANT} element={<AddVariantPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route path={ROUTES.ASK_QUOTE} element={<EthnicWearQuotePage />} />
        <Route path={ROUTES.CHAT} element={<ChatBot />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.DELETE_ACCOUNT} element={<AccountDeletePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
