import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./page/Landing";
import DashboardNews from "./page/news/DashboardNews";
import NewsDetail from "./page/news/NewsDetail";
import AdminLogin from "./page/admin/AdminLogin";
import AdminNews from "./page/admin/AdminNews";
import NewsForm from "./page/admin/NewsForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/news" element={<DashboardNews />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <AdminNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/new"
          element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/:id/edit"
          element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
