import { Route, Routes } from "react-router-dom";

import DashboardPage from "@/pages/dashboard";
import DatasetDetailPage from "@/pages/dataset-detail";
import IntegrationsPage from "@/pages/integrations";
import LabelsPage from "@/pages/labels";
import DatapointsPage from "@/pages/datapoints";
import PredictionsPage from "@/pages/predictions";

function App() {
  return (
    <Routes>
      <Route element={<DashboardPage />} path="/" />
      <Route element={<DatasetDetailPage />} path="/datasets/:datasetId" />
      <Route element={<IntegrationsPage />} path="/integrations" />
      <Route element={<LabelsPage />} path="/labels" />
      <Route element={<DatapointsPage />} path="/datapoints" />
      <Route element={<PredictionsPage />} path="/predictions" />
    </Routes>
  );
}

export default App;
