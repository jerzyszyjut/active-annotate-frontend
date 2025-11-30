import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, setCredentials } from '../utils/authSlicer'
import { useNavigate } from "react-router-dom";
import { authTokenApi } from "@/utils/api";

  
function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate])

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Username is required.');
            return;
        }
        if (!password) {
            setError('Password is required.');
            return;
        }
        setError('');

        try {
            const data = await authTokenApi.getToken({ username, password })
            const token = data.token;
            dispatch(setCredentials({ token }));
            navigate("/");

        } catch (error: any) {
            const msg = 'Incorrect username or password.';
            setError(msg);
        }
    };

    const [error, setError] = useState('');

    if (isAuthenticated) return null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-700/50 border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
                    Sign In
                </h2>
                {error && (
                    <div 
                        className="bg-red-50 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium" 
                        role="alert"
                    >
                        {error}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="username"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
                            type="text"
                            placeholder="User Name"
                            name="username"
                            required
                            onChange={handleUsername}
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
                            type="password"
                            placeholder="Password"
                            name="password"
                            required
                            onChange={handlePassword}
                        />
                    </div>
                    <button 
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" 
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;