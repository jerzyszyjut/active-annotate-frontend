import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";

import { datasetsApi, handleApiError } from "@/lib/api";
import type { ClassificationDataset } from "@/types";
import { SearchInput } from "@/components/search-input";
import { CreateDatasetModal } from "@/components/create-dataset-modal";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [datasets, setDatasets] = useState<ClassificationDataset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((dataset) =>
        dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [datasets, searchTerm]
  );

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setError(null);
      const data = await datasetsApi.list();
      setDatasets(data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleViewDataset = (id: number) => {
    console.log("Navigating to dataset:", id);
    const path = `/dataset/${id}`;
    console.log("Path:", path);
    navigate(path);
  };

  const handleCreateDatasetSuccess = () => {
    fetchDatasets();
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader className="flex flex-col items-start px-4 py-4">
          <div className="flex justify-between items-center w-full mb-4">
            <div>
              <h1 className="text-2xl font-bold">Datasets</h1>
              <p className="text-sm text-default-500">
                Manage your classification datasets
              </p>
            </div>
            <Button color="success" onClick={onOpen} className="font-medium">
              + Create Dataset
            </Button>
          </div>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search datasets..."
          />
        </CardHeader>
        <Divider />
        <CardBody>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {datasets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">No datasets found</p>
              <Button
                color="primary"
                variant="light"
                onClick={onOpen}
                className="mt-4"
              >
                Create your first dataset
              </Button>
            </div>
          ) : filteredDatasets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">No datasets match your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Datapoints</th>
                    <th className="text-left p-2">Labels</th>
                    <th className="text-left p-2">Batch Size</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDatasets.map((dataset) => (
                    <tr
                      key={dataset.id}
                      className="border-b hover:bg-default-100 cursor-pointer"
                      onClick={() => handleViewDataset(dataset.id)}
                    >
                      <td className="p-2 font-medium">{dataset.name}</td>
                      <td className="p-2">{dataset.datapoints.length}</td>
                      <td className="p-2">{dataset.labels.length}</td>
                      <td className="p-2">{dataset.batch_size}</td>
                      <td className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDataset(dataset.id);
                          }}
                          className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/80"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Dataset Modal */}
      <CreateDatasetModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleCreateDatasetSuccess}
      />
    </div>
  );
}
