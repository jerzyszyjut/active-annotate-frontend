import { Route, Routes } from "react-router-dom";

import DashboardPage from "@/pages/dashboard";
import DatasetDetailPage from "@/pages/dataset-detail";

function App() {
  return (
    <Routes>
      <Route element={<DashboardPage />} path="/" />
      <Route element={<DatasetDetailPage />} path="/datasets/:datasetId" />
    </Routes>
  );
}

export default App;
