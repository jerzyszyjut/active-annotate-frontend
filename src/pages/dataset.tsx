import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useDisclosure } from "@heroui/modal";

import { datasetsApi, handleApiError, activeLearningApi } from "@/lib/api";
import type { ClassificationDataset, ClassificationDatapoint } from "@/types";
import { DatapointModal } from "@/components/datapoint-modal";
import { LabelManagementModal } from "@/components/label-management-modal";
import { CreatePredictionModal } from "@/components/create-prediction-modal";
import { UploadDatapointsModal } from "@/components/upload-datapoints-modal";

export default function DatasetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLabelModalOpen,
    onOpen: onLabelModalOpen,
    onClose: onLabelModalClose,
  } = useDisclosure();
  const {
    isOpen: isPredictionModalOpen,
    onOpen: onPredictionModalOpen,
    onClose: onPredictionModalClose,
  } = useDisclosure();
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onClose: onUploadModalClose,
  } = useDisclosure();

  const [dataset, setDataset] = useState<ClassificationDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDatapoint, setSelectedDatapoint] =
    useState<ClassificationDatapoint | null>(null);
  const [isStartingActiveLearning, setIsStartingActiveLearning] =
    useState(false);

  // Dataset info edit state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedDataset, setEditedDataset] = useState<
    Partial<ClassificationDataset>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  // Filter state
  const [filterByLabel, setFilterByLabel] = useState<
    "all" | "labeled" | "unlabeled"
  >("all");
  const [filterByMinConfidence, setFilterByMinConfidence] = useState("");
  const [filterByMaxConfidence, setFilterByMaxConfidence] = useState("");
  const [filterByModelVersion, setFilterByModelVersion] = useState("");

  const datasetId = id ? parseInt(id, 10) : null;

  // Compute filtered datapoints
  const filteredDatapoints = useMemo(() => {
    if (!dataset) return [];

    return dataset.datapoints.filter((dp) => {
      // Filter by label
      if (filterByLabel === "labeled" && !dp.label) return false;
      if (filterByLabel === "unlabeled" && dp.label) return false;

      // Filter by predictions
      if (dp.predictions.length === 0) return true;

      // Filter by confidence
      const minConf = filterByMinConfidence
        ? parseFloat(filterByMinConfidence)
        : -1;
      const maxConf = filterByMaxConfidence
        ? parseFloat(filterByMaxConfidence)
        : 2;

      if (
        dp.predictions.some(
          (pred) =>
            (pred.confidence === null ||
              (pred.confidence >= minConf && pred.confidence <= maxConf)) &&
            (!filterByModelVersion ||
              pred.model_version === parseInt(filterByModelVersion, 10))
        )
      ) {
        return true;
      }

      return filterByModelVersion === "" && minConf === -1 && maxConf === 2;
    });
  }, [
    dataset,
    filterByLabel,
    filterByMinConfidence,
    filterByMaxConfidence,
    filterByModelVersion,
  ]);

  useEffect(() => {
    if (!datasetId) {
      setError("Invalid dataset ID");
      setLoading(false);
      return;
    }

    fetchDataset();
  }, [datasetId]);

  const fetchDataset = async () => {
    if (!datasetId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await datasetsApi.get(datasetId);
      setDataset(data);
      setEditedDataset({
        name: data.name,
        label_studio_url: data.label_studio_url,
        label_studio_api_key: data.label_studio_api_key,
        ml_backend_url: data.ml_backend_url,
        batch_size: data.batch_size,
        uncertainty_strategy: data.uncertainty_strategy,
        max_epochs: data.max_epochs,
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDatapoint = useCallback(
    (datapoint: ClassificationDatapoint) => {
      setSelectedDatapoint(datapoint);
      onOpen();
    },
    [onOpen]
  );

  const handleSaveDatasetInfo = async () => {
    if (!dataset || !datasetId) return;

    try {
      setIsSaving(true);
      setError(null);

      const updatedDataset = await datasetsApi.patch(datasetId, editedDataset);
      setDataset(updatedDataset);
      setIsEditingInfo(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (dataset) {
      setEditedDataset({
        name: dataset.name,
        label_studio_url: dataset.label_studio_url,
        label_studio_api_key: dataset.label_studio_api_key,
        ml_backend_url: dataset.ml_backend_url,
        batch_size: dataset.batch_size,
        uncertainty_strategy: dataset.uncertainty_strategy,
        max_epochs: dataset.max_epochs,
      });
    }
    setIsEditingInfo(false);
  };

  const handleStartActiveLearning = async () => {
    if (!datasetId) return;

    try {
      setIsStartingActiveLearning(true);
      setError(null);
      const response = await activeLearningApi.startActivelearning(datasetId);
      alert(
        `Active Learning Started!\n\n${response.message || "Check your Label Studio instance for new tasks."}`
      );
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsStartingActiveLearning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner label="Loading dataset..." />
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="bg-red-50">
          <CardBody>
            <p className="text-red-700">{error || "Dataset not found"}</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
              color="primary"
              variant="light"
            >
              Back to Datasets
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Dataset Info Card */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{dataset.name}</h1>
            <p className="text-sm text-default-500">Dataset Configuration</p>
          </div>
          <Button
            color="primary"
            variant={isEditingInfo ? "bordered" : "flat"}
            onClick={() => setIsEditingInfo(!isEditingInfo)}
          >
            {isEditingInfo ? "Cancel" : "Edit Info"}
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          {isEditingInfo ? (
            <>
              <Input
                label="Dataset Name"
                value={editedDataset.name || ""}
                onValueChange={(value) =>
                  setEditedDataset({ ...editedDataset, name: value })
                }
              />
              <Input
                label="Label Studio URL"
                value={editedDataset.label_studio_url || ""}
                onValueChange={(value) =>
                  setEditedDataset({
                    ...editedDataset,
                    label_studio_url: value,
                  })
                }
              />
              <Input
                label="Label Studio API Key"
                type="password"
                value={editedDataset.label_studio_api_key || ""}
                onValueChange={(value) =>
                  setEditedDataset({
                    ...editedDataset,
                    label_studio_api_key: value,
                  })
                }
                endContent={
                  <span className="text-xs text-default-400">(hidden)</span>
                }
              />
              <Input
                label="ML Backend URL"
                value={editedDataset.ml_backend_url || ""}
                onValueChange={(value) =>
                  setEditedDataset({
                    ...editedDataset,
                    ml_backend_url: value,
                  })
                }
              />
              <Input
                label="Batch Size"
                type="number"
                value={String(editedDataset.batch_size || 16)}
                onValueChange={(value) =>
                  setEditedDataset({
                    ...editedDataset,
                    batch_size: parseInt(value, 10) || 16,
                  })
                }
              />
              <Input
                label="Uncertainty Strategy"
                value={editedDataset.uncertainty_strategy || ""}
                onValueChange={(value) =>
                  setEditedDataset({
                    ...editedDataset,
                    uncertainty_strategy: value,
                  })
                }
              />
              <Input
                label="Max epochs"
                type="number"
                value={String(editedDataset.max_epochs || 1)}
                onValueChange={(value) =>
                  setEditedDataset({
                    ...editedDataset,
                    max_epochs: parseInt(value, 10) || 1,
                  })
                }
              />
              <div className="flex gap-2 mt-4">
                <Button
                  color="success"
                  onClick={handleSaveDatasetInfo}
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
                <Button
                  color="default"
                  variant="light"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-default-500">Label Studio URL</p>
                <p className="text-sm break-all">{dataset.label_studio_url}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">ML Backend URL</p>
                <p className="text-sm break-all">{dataset.ml_backend_url}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Label Studio API Key</p>
                <p className="text-sm text-default-400">
                  ••••••••••••••••••••••
                </p>
              </div>
              <div>
                <p className="text-sm text-default-500">Batch Size</p>
                <p className="text-sm">{dataset.batch_size}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Uncertainty Strategy</p>
                <p className="text-sm">{dataset.uncertainty_strategy}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Current epoch</p>
                <p className="text-sm">{dataset.epoch}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Max epochs</p>
                <p className="text-sm">{dataset.max_epochs}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Active Learning State</p>
                <p className="text-sm">{dataset.state}</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Total Datapoints</p>
            <p className="text-3xl font-bold">{dataset.datapoints.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Labeled</p>
            <p className="text-3xl font-bold">
              {dataset.datapoints.filter((dp) => dp.label).length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Classes</p>
            <p className="text-3xl font-bold">{dataset.labels.length}</p>
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <Button
          color="success"
          size="lg"
          onClick={handleStartActiveLearning}
          isLoading={isStartingActiveLearning}
          disabled={isStartingActiveLearning}
        >
          Start Active Learning
        </Button>
        <Button color="secondary" size="lg" onClick={onLabelModalOpen}>
          Manage Labels
        </Button>
        <Button color="warning" size="lg" onClick={onUploadModalOpen}>
          Upload Datapoints
        </Button>
      </div>

      {/* Datapoints List */}
      <Card>
        <CardHeader>
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Datapoints</h2>

            {/* Filter Section */}
            <div className="bg-default-100 p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold mb-3">Filter Datapoints</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <Select
                    label="Label Status"
                    selectedKeys={[filterByLabel]}
                    onChange={(e) =>
                      setFilterByLabel(
                        e.target.value as "all" | "labeled" | "unlabeled"
                      )
                    }
                    size="sm"
                    className="w-full"
                  >
                    <SelectItem key="all">All</SelectItem>
                    <SelectItem key="labeled">Labeled Only</SelectItem>
                    <SelectItem key="unlabeled">Unlabeled Only</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-default-500 block mb-1">
                    Min Confidence
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filterByMinConfidence}
                    onValueChange={setFilterByMinConfidence}
                    min="0"
                    max="1"
                    step="0.1"
                    size="sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-default-500 block mb-1">
                    Max Confidence
                  </label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={filterByMaxConfidence}
                    onValueChange={setFilterByMaxConfidence}
                    min="0"
                    max="1"
                    step="0.1"
                    size="sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-default-500 block mb-1">
                    Model Version
                  </label>
                  <Input
                    type="number"
                    placeholder="All"
                    value={filterByModelVersion}
                    onValueChange={setFilterByModelVersion}
                    min="1"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-default-500">
              Showing {filteredDatapoints.length} of {dataset.datapoints.length}{" "}
              datapoints. Click on a datapoint to view predictions or add a new
              prediction.
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {dataset.datapoints.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">No datapoints in this dataset</p>
            </div>
          ) : filteredDatapoints.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-default-500">
                No datapoints match the current filters
              </p>
            </div>
          ) : (
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {filteredDatapoints.map((datapoint) => (
                <div
                  key={datapoint.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-default-200 hover:bg-default-100 transition-colors"
                >
                  <button
                    onClick={() => handleViewDatapoint(datapoint)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium">Datapoint #{datapoint.id}</div>
                    <div className="text-sm text-default-500">
                      {datapoint.predictions.length} predictions
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    {datapoint.label ? (
                      <span className="px-2 py-1 rounded-full bg-success-100 text-success-700 text-xs font-medium">
                        {datapoint.label.class_label}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-default-200 text-default-700 text-xs font-medium">
                        Unlabeled
                      </span>
                    )}
                    <Button
                      isIconOnly
                      className="text-xs"
                      color="primary"
                      variant="light"
                      size="sm"
                      onClick={() => {
                        setSelectedDatapoint(datapoint);
                        onPredictionModalOpen();
                      }}
                      title="Add prediction"
                    >
                      +Pred
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Datapoint Modal */}
      <DatapointModal
        isOpen={isOpen}
        onClose={onClose}
        datapoint={selectedDatapoint}
      />

      {/* Label Management Modal */}
      <LabelManagementModal
        isOpen={isLabelModalOpen}
        onClose={onLabelModalClose}
        datasetId={datasetId || 0}
        currentLabels={dataset?.labels || []}
        onLabelCreated={fetchDataset}
      />

      {/* Create Prediction Modal */}
      <CreatePredictionModal
        isOpen={isPredictionModalOpen}
        onClose={onPredictionModalClose}
        datapointId={selectedDatapoint?.id || 0}
        labels={dataset?.labels || []}
        onPredictionCreated={fetchDataset}
      />

      {/* Upload Datapoints Modal */}
      <UploadDatapointsModal
        isOpen={isUploadModalOpen}
        onClose={onUploadModalClose}
        datasetId={datasetId || 0}
        onUploadSuccess={fetchDataset}
      />
    </div>
  );
}
