import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDetail from './pages/CompanyDetail';
import CreateCompany from './pages/CreateCompany';
import WriteReview from './pages/WriteReview';
import EditCompany from './pages/EditCompany';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/company/:id/review" element={<WriteReview />} />
          <Route path="/company/:id/edit" element={<EditCompany />} />
        </Routes>
      </main>
    </div>
  );
}
