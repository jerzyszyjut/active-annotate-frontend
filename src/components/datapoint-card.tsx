import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  apiClient,
  ClassificationDatapoint,
  ClassificationLabel,
  ClassificationPrediction,
} from "@/api/client";
import { PredictionCard } from "./prediction-card";

interface DatapointCardProps {
  datapoint: ClassificationDatapoint;
  datasetLabels: ClassificationLabel[];
  onUpdate: () => void;
  onDelete: () => void;
}

export function DatapointCard({
  datapoint,
  datasetLabels,
  onUpdate,
  onDelete,
}: DatapointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(datapoint.file);
  const [label, setLabel] = useState(datapoint.label?.toString() || "");
  const [predictions, setPredictions] = useState<ClassificationPrediction[]>(
    []
  );
  const [newPredictionLabel, setNewPredictionLabel] = useState("");
  const [newPredictionConfidence, setNewPredictionConfidence] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      loadPredictions();
    }
  }, [isExpanded]);

  const loadPredictions = async () => {
    try {
      const data = await apiClient.getPredictions(datapoint.id);
      setPredictions(data);
    } catch (err) {
      console.error("Failed to load predictions", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.updateDatapoint(
        datapoint.id,
        file,
        label ? parseInt(label) : null
      );
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update datapoint", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient.deleteDatapoint(datapoint.id);
      onDelete();
    } catch (err) {
      console.error("Failed to delete datapoint", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrediction = async () => {
    if (!newPredictionLabel.trim()) return;
    setLoading(true);
    try {
      await apiClient.createPrediction(
        datapoint.id,
        parseInt(newPredictionLabel),
        newPredictionConfidence
          ? parseFloat(newPredictionConfidence)
          : undefined
      );
      setNewPredictionLabel("");
      setNewPredictionConfidence("");
      loadPredictions();
    } catch (err) {
      console.error("Failed to create prediction", err);
    } finally {
      setLoading(false);
    }
  };

  const getDatasetLabel = () => {
    const foundLabel = datasetLabels.find((l) => l.id === datapoint.label);
    return foundLabel ? foundLabel.class_label : "Not set";
  };

  return (
    <div className="p-4 ml-4 mb-3 border border-gray-300 rounded-lg bg-white">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            label="File URL"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            fullWidth
          />
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">No label</option>
            {datasetLabels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.class_label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button color="primary" onClick={handleSave} disabled={loading}>
              Save
            </Button>
            <Button variant="flat" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="font-semibold text-sm">Datapoint #{datapoint.id}</p>
              <p className="text-xs text-gray-600 truncate">File: {file}</p>
              <p className="text-xs text-gray-600">
                Label: {getDatasetLabel()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="warning"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Predictions</h4>
                {predictions.length === 0 ? (
                  <p className="text-xs text-gray-500 ml-4">
                    No predictions yet
                  </p>
                ) : (
                  <div>
                    {predictions.map((pred) => (
                      <PredictionCard
                        key={pred.id}
                        prediction={pred}
                        onUpdate={loadPredictions}
                        onDelete={loadPredictions}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-3 ml-4 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-xs font-medium mb-2">Add Prediction</p>
                  <div className="flex gap-2 mb-2">
                    <Input
                      label="Label"
                      type="number"
                      value={newPredictionLabel}
                      onChange={(e) => setNewPredictionLabel(e.target.value)}
                      size="sm"
                      className="flex-1"
                    />
                    <Input
                      label="Confidence"
                      type="number"
                      step="0.01"
                      value={newPredictionConfidence}
                      onChange={(e) =>
                        setNewPredictionConfidence(e.target.value)
                      }
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                  <Button
                    size="sm"
                    color="success"
                    onClick={handleAddPrediction}
                    disabled={loading || !newPredictionLabel}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
