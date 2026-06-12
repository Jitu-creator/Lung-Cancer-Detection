import { Navigate } from 'react-router-dom';

// function RootGateway({ isLoggedIn }) {
//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace={true} />;
//   }

//   return <h1>Welcome to the Secret Dashboard</h1>;
// }

function ProtectedPage() {
  const isLoggedIn = localStorage.getItem("token") !== null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Navigate to="/home" replace={true} />;
}

export default ProtectedPage;
