import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { useDataset } from "@/lib/hooks";
import BulkUploadModal from "@/components/bulk-upload-modal";
import LabelManagementModal from "@/components/label-management-modal";

export default function DatasetDetailPage() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const [selectedDatapoint, setSelectedDatapoint] = useState<number | null>(
    null
  );
  const {
    isOpen: isPredictionModalOpen,
    onOpen: onPredictionModalOpen,
    onOpenChange: onPredictionModalOpenChange,
  } = useDisclosure();
  const [selectedPredictionLabelId, setSelectedPredictionLabelId] = useState<
    number | null
  >(null);
  const [predictionConfidence, setPredictionConfidence] = useState<string>("");
  const [isAddingPrediction, setIsAddingPrediction] = useState(false);
  const {
    dataset,
    loading,
    deleteDatapoint,
    updateDatapoint,
    addLabel,
    deleteLabel,
    addPrediction,
    deletePrediction,
  } = useDataset(parseInt(datasetId || "0"));

  if (!datasetId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Invalid dataset ID</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-slate-400">Loading dataset...</p>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-slate-400">Dataset not found</p>
      </div>
    );
  }

  const datapoints = dataset.datapoints || [];
  const labels = dataset.labels || [];

  const currentDatapoint =
    datapoints.find((d) => d.id === selectedDatapoint) || datapoints[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              isIconOnly
              variant="light"
              className="text-slate-400 hover:text-white mb-2"
              onPress={() => navigate("/")}
            >
              ← Back
            </Button>
            <h1 className="text-4xl font-bold text-white">{dataset.name}</h1>
            <p className="text-slate-400 mt-1">
              {datapoints.length} datapoints • {labels.length} labels
            </p>
          </div>
          <BulkUploadModal datasetId={dataset.id} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Datapoints List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border border-slate-700 h-full">
              <CardHeader className="flex flex-col items-start px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Datapoints</h2>
              </CardHeader>
              <Divider className="bg-slate-700" />
              <CardBody className="gap-2 overflow-y-auto max-h-[600px]">
                {datapoints.length === 0 ? (
                  <p className="text-sm text-slate-400">No datapoints yet</p>
                ) : (
                  datapoints.map((datapoint) => (
                    <Card
                      key={datapoint.id}
                      isPressable
                      className={`bg-slate-700 border ${
                        selectedDatapoint === datapoint.id
                          ? "border-purple-500"
                          : "border-slate-600"
                      } cursor-pointer transition-colors`}
                      onPress={() => setSelectedDatapoint(datapoint.id)}
                    >
                      <CardBody className="py-2 px-3">
                        <div className="flex items-start gap-2">
                          <img
                            src={datapoint.file_url}
                            alt="datapoint"
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">
                              #{datapoint.id}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {datapoint.label?.class_label || "No label"}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right: Details and Labels */}
          <div className="lg:col-span-2 space-y-6">
            {currentDatapoint && (
              <>
                {/* Datapoint Viewer */}
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="flex flex-col items-start px-4 py-3">
                    <h2 className="text-lg font-semibold text-white">
                      Datapoint #{currentDatapoint.id}
                    </h2>
                  </CardHeader>
                  <Divider className="bg-slate-700" />
                  <CardBody className="gap-4">
                    <div className="flex justify-center bg-slate-900 rounded-lg p-4">
                      <Image
                        src={currentDatapoint.file_url}
                        alt="datapoint"
                        className="max-w-full max-h-96 object-contain"
                      />
                    </div>

                    {/* Label Selection */}
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-2">
                        Current Label
                      </label>
                      <select
                        value={currentDatapoint.label?.id || ""}
                        onChange={(e) => {
                          const labelId = parseInt(e.target.value);
                          const label = labels.find((l) => l.id === labelId);
                          if (label) {
                            updateDatapoint(currentDatapoint.id, label).catch(
                              console.error
                            );
                          }
                        }}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Select a label</option>
                        {labels.map((label) => (
                          <option key={label.id} value={label.id}>
                            [{label.class_index}] {label.class_label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delete Button */}
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this datapoint?"
                          )
                        ) {
                          deleteDatapoint(currentDatapoint.id).then(() => {
                            setSelectedDatapoint(null);
                          });
                        }
                      }}
                    >
                      Delete Datapoint
                    </Button>
                  </CardBody>
                </Card>

                {/* Predictions */}
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="flex flex-col items-start px-4 py-3">
                    <div className="flex justify-between w-full items-center">
                      <h2 className="text-lg font-semibold text-white">
                        Predictions ({currentDatapoint.predictions.length})
                      </h2>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={onPredictionModalOpen}
                      >
                        Add Prediction
                      </Button>
                    </div>
                  </CardHeader>
                  <Divider className="bg-slate-700" />
                  <CardBody className="gap-3">
                    {currentDatapoint.predictions.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No predictions yet
                      </p>
                    ) : (
                      currentDatapoint.predictions.map((prediction) => (
                        <div
                          key={prediction.id}
                          className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {prediction.predicted_label.class_label}
                            </p>
                            <p className="text-xs text-slate-400">
                              Confidence:{" "}
                              {prediction.confidence
                                ? (prediction.confidence * 100).toFixed(2)
                                : "N/A"}
                              %
                            </p>
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => {
                              if (confirm("Delete this prediction?")) {
                                deletePrediction(
                                  currentDatapoint.id,
                                  prediction.id
                                ).catch(console.error);
                              }
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))
                    )}
                  </CardBody>
                </Card>

                {/* Labels Reference */}
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="flex flex-col items-start px-4 py-3 justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      Available Labels
                    </h2>
                    <LabelManagementModal
                      labels={labels}
                      onAddLabel={addLabel}
                      onDeleteLabel={deleteLabel}
                    />
                  </CardHeader>
                  <Divider className="bg-slate-700" />
                  <CardBody className="gap-2">
                    {labels.map((label) => (
                      <div
                        key={label.id}
                        className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                      >
                        <span className="text-sm text-white">
                          [{label.class_index}] {label.class_label}
                        </span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Add Prediction Modal */}
        <Modal
          isOpen={isPredictionModalOpen}
          onOpenChange={onPredictionModalOpenChange}
        >
          <ModalContent>
            {(onClose: any) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-white">
                  Add Prediction
                </ModalHeader>
                <ModalBody>
                  <p className="text-slate-400 mb-4">
                    Add a prediction for datapoint #{currentDatapoint?.id}
                  </p>

                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Select Label
                    </label>
                    <select
                      value={selectedPredictionLabelId || ""}
                      onChange={(e) =>
                        setSelectedPredictionLabelId(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select a label</option>
                      {labels.map((label) => (
                        <option key={label.id} value={label.id}>
                          [{label.class_index}] {label.class_label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Confidence (0-1, optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={predictionConfidence}
                      onChange={(e) => setPredictionConfidence(e.target.value)}
                      placeholder="0.95"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="default"
                    variant="light"
                    onPress={() => {
                      onClose();
                      setSelectedPredictionLabelId(null);
                      setPredictionConfidence("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isLoading={isAddingPrediction}
                    isDisabled={!selectedPredictionLabelId}
                    onPress={async () => {
                      if (!selectedPredictionLabelId || !currentDatapoint)
                        return;
                      setIsAddingPrediction(true);
                      try {
                        const confidence = predictionConfidence
                          ? parseFloat(predictionConfidence)
                          : undefined;
                        await addPrediction(
                          currentDatapoint.id,
                          selectedPredictionLabelId,
                          confidence
                        );
                        onPredictionModalOpenChange();
                        setSelectedPredictionLabelId(null);
                        setPredictionConfidence("");
                      } catch (error) {
                        console.error("Failed to add prediction:", error);
                      } finally {
                        setIsAddingPrediction(false);
                      }
                    }}
                  >
                    Add Prediction
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
