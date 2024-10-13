
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { isSessionExpired } from "./session";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');

    // Check if the token is absent or session is expired
    if (!token || isSessionExpired()) {
        // Clear local storage if expired
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('username'); // Clear username
        return <Navigate to={'/login'} replace={true} />;
    }

    return children;
};


export const ProtectRoute = ({ children }) => {
    const username = useAuthStore.getState().auth.username;
    if (!username) {
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    return children;
}