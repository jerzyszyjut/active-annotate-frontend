import { useSelector } from "react-redux"
import { selectIsAuthenticated } from "../utils/authSlicer"
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />
}

export default ProtectedRoute;