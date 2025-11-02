import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { useDatasets } from "@/lib/hooks";

export default function DashboardPage() {
  const { datasets, loading, error, createDataset, deleteDataset } =
    useDatasets();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newDatasetName, setNewDatasetName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDataset = async () => {
    if (!newDatasetName.trim()) return;
    setIsCreating(true);
    try {
      await createDataset(newDatasetName);
      setNewDatasetName("");
      onOpenChange();
    } catch (error) {
      console.error("Failed to create dataset:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteDataset = async (id: number) => {
    if (confirm("Are you sure you want to delete this dataset?")) {
      try {
        await deleteDataset(id);
      } catch (error) {
        console.error("Failed to delete dataset:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Datasets Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your classification datasets and annotations
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Button isLoading={isCreating} color="primary" onPress={onOpen}>
            Create New Dataset
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading datasets...</p>
          </div>
        ) : error ? (
          <Card className="bg-slate-800 border border-red-700">
            <CardBody className="py-12 text-center">
              <p className="text-red-400 mb-4">Error loading datasets</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </CardBody>
          </Card>
        ) : datasets.length === 0 ? (
          <Card className="bg-slate-800 border border-slate-700">
            <CardBody className="py-12 text-center">
              <p className="text-slate-400 mb-4">No datasets yet</p>
              <p className="text-slate-500 text-sm">
                Create your first dataset to get started with annotations
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <Card
                key={dataset.id}
                className="bg-slate-800 border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <CardHeader className="flex flex-col items-start px-4 py-3">
                  <p className="text-lg font-semibold text-white truncate max-w-full">
                    {dataset.name}
                  </p>
                </CardHeader>
                <Divider className="bg-slate-700" />
                <CardBody className="gap-3">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Datapoints:</span>
                    <span className="text-white font-medium">
                      {dataset.datapoints?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Labels:</span>
                    <span className="text-white font-medium">
                      {dataset.labels?.length || 0}
                    </span>
                  </div>
                </CardBody>
                <Divider className="bg-slate-700" />
                <CardBody className="gap-2 pt-2">
                  <Link to={`/datasets/${dataset.id}`} className="w-full">
                    <Button fullWidth color="primary" variant="flat" size="sm">
                      View Dataset
                    </Button>
                  </Link>
                  <Button
                    fullWidth
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={() => handleDeleteDataset(dataset.id)}
                  >
                    Delete
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose: any) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-white">
                  Create New Dataset
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Dataset Name"
                    placeholder="Enter dataset name"
                    variant="bordered"
                    value={newDatasetName}
                    onValueChange={setNewDatasetName}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleCreateDataset}
                    isLoading={isCreating}
                  >
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
