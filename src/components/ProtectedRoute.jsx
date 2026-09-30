import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { useIsAdmin } from "../hooks/useIsAdmin";

function ProtectedRoute({ children }) {
  const session = useSession();
  const isAdmin = useIsAdmin(session);

  if (isAdmin === undefined) return <div className="min-h-screen bg-black" />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default ProtectedRoute;
