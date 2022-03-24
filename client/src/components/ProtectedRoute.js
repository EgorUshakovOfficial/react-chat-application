import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
    user,
    redirectPath = "/"
}) => {
    console.log(user);
    if (!user) {
        return <Navigate to={redirectPath} replace /> 
    }
    return <Navigate to="/profile" replace />
}

export default ProtectedRoute; 
