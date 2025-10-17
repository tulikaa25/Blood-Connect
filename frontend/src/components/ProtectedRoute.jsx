import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, adminOnly = false, children }) => {
  if (!user) return <Navigate to="/login" />; // not logged in
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />; // non-admin trying admin route
  return children;
};

export default ProtectedRoute;
