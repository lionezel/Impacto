import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CatalogPage, Checkout, Failure, HomePage, LoginPage, Pending, ProfilePage, Success, VerifyPage } from './page';
import './App.css';
import { AuthProvider } from './auth/AuthProvider';
import { initMercadoPago } from '@mercadopago/sdk-react';

function App() { 
  initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY!);
  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog/:slug" element={<CatalogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/checkout/success" element={<h1>Pago aprobado ✅</h1>} />
  <Route path="/checkout/failure" element={<h1>Pago rechazado ❌</h1>} />
  <Route path="/checkout/pending" element={<h1>Pago pendiente ⏳</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
