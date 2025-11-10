import { Route, Routes } from "react-router-dom";

import DashboardPage from "@/pages/dashboard";
import DatasetPage from "@/pages/dataset";
import { Navbar } from "@/components/navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<DashboardPage />} path="/" />
        <Route element={<DatasetPage />} path="/dataset/:id" />
      </Routes>
    </>
  );
}

export default App;
