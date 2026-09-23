import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AgencyMap from './components/AgencyMap';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import AgencyDetailPage from './pages/AgencyDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import InstallPrompt from './components/InstallPrompt';

function Layout({ children, noFooter }) {
  return (
    <div className="app-shell">
      <Header />
      {children}
      {!noFooter && <Footer />}
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/carte"
            element={
              <Layout noFooter>
                <AgencyMap />
              </Layout>
            }
          />
          <Route
            path="/calculatrice"
            element={
              <Layout>
                <CalculatorPage />
              </Layout>
            }
          />
          <Route
            path="/a-propos"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/agences/:id"
            element={
              <Layout>
                <AgencyDetailPage />
              </Layout>
            }
          />
          <Route
            path="/admin/login"
            element={
              <Layout noFooter>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
