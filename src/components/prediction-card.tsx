import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { apiClient, ClassificationPrediction } from "@/api/client";

interface PredictionCardProps {
  prediction: ClassificationPrediction;
  onUpdate: () => void;
  onDelete: () => void;
}

export function PredictionCard({
  prediction,
  onUpdate,
  onDelete,
}: PredictionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [predictedLabel, setPredictedLabel] = useState(
    prediction.predicted_label?.toString() || ""
  );
  const [confidence, setConfidence] = useState(
    prediction.confidence?.toString() || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.updatePrediction(
        prediction.id,
        predictedLabel ? parseInt(predictedLabel) : null,
        confidence ? parseFloat(confidence) : null
      );
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update prediction", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient.deletePrediction(prediction.id);
      onDelete();
    } catch (err) {
      console.error("Failed to delete prediction", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 ml-8 mb-2 border border-gray-200 rounded-lg bg-gray-50">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            label="Predicted Label"
            type="number"
            value={predictedLabel}
            onChange={(e) => setPredictedLabel(e.target.value)}
            size="sm"
          />
          <Input
            label="Confidence"
            type="number"
            step="0.01"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            size="sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="flat"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Prediction #{prediction.id}</p>
            <p className="text-xs text-gray-600">
              Label: {prediction.predicted_label || "N/A"} | Confidence:{" "}
              {prediction.confidence ? prediction.confidence.toFixed(2) : "N/A"}
            </p>
          </div>
          <div className="flex gap-2">
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
      )}
    </div>
  );
}
