import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { apiClient, ClassificationDataset } from "@/api/client";
import { DatasetCard } from "@/components/dataset-card";

interface DashboardPageProps {
  token: string;
  onLogout: () => void;
}

export default function DashboardPage({ token, onLogout }: DashboardPageProps) {
  const [datasets, setDatasets] = useState<ClassificationDataset[]>([]);
  const [newDatasetName, setNewDatasetName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.setToken(token);
    loadDatasets();
  }, [token]);

  const loadDatasets = async () => {
    try {
      const data = await apiClient.getDatasets();
      setDatasets(data);
    } catch (err) {
      console.error("Failed to load datasets", err);
    }
  };

  const createDataset = async () => {
    if (!newDatasetName.trim()) return;
    setLoading(true);
    try {
      await apiClient.createDataset(newDatasetName);
      setNewDatasetName("");
      loadDatasets();
    } catch (err) {
      console.error("Failed to create dataset", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Active Annotate Dashboard</h1>
          <Button onClick={onLogout} color="danger">
            Logout
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Dataset</h2>
          <div className="flex gap-4">
            <Input
              label="Dataset Name"
              value={newDatasetName}
              onChange={(e) => setNewDatasetName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={createDataset} disabled={loading} color="primary">
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Datasets</h2>
          {datasets.length === 0 ? (
            <p className="text-gray-500">
              No datasets found. Create your first dataset above.
            </p>
          ) : (
            <div className="space-y-4">
              {datasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  dataset={dataset}
                  onUpdate={loadDatasets}
                  onDelete={loadDatasets}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
