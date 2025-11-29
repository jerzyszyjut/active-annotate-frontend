import { Route, Routes } from "react-router-dom";

import DashboardPage from "@/pages/dashboard";
import DatasetPage from "@/pages/dataset";
import { Navbar } from "@/components/navbar";
import LoginPage from "./pages/login";
import ProtectedRoute from "./components/protected-route";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<LoginPage/>} path="/login" />
        <Route element={<ProtectedRoute/>}>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<DatasetPage />} path="/dataset/:id" />
        </Route>
      </Routes>
    </>
  );
}

export default App;
