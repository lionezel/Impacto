import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CatalogPage, HomePage, LoginPage } from './page';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog/:slug" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
