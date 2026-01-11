import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CatalogPage, Checkout, HomePage } from './page';
import { AuthProvider } from './auth/AuthProvider';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { ProductDetail } from './page/productDetail';
import { AlertProvider } from './context/AlertContext';
import { LoginPage } from './page/auth/login';
import { ProfilePage } from './page/auth/profile';
import { Success } from './page/checkout/page/success';
import { VerifyPage } from './page/auth';
import { Failure, Pending } from './page/checkout/page';
import { LoadingProvider } from './context/LoadingContext';
import './App.css';

function App() {
  initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY!);
  return (
    <LoadingProvider>
      <AlertProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/catalog/:slug" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
              <Route path="/pending" element={<Pending />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AlertProvider>
    </LoadingProvider>
  );
}

export default App;
