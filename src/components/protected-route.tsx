import { useSelector } from "react-redux"
import { selectIsAuthenticated } from "../authSlicer"
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />
}

export default ProtectedRoute;