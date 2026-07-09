import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const isStaff = localStorage.getItem('isStaff') === 'true';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace={true} />;
  }

  if (!isStaff) {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
};

export default AdminRoute;