import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { predictionsApi, handleApiError } from "@/utils/api";
import type { ClassificationLabel } from "@/types";

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  datapointId: number;
  labels: ClassificationLabel[];
  onPredictionCreated: () => void;
}

export function CreatePredictionModal({
  isOpen,
  onClose,
  datapointId,
  labels,
  onPredictionCreated,
}: CreatePredictionModalProps) {
  const [predictedLabelId, setPredictedLabelId] = useState("");
  const [confidence, setConfidence] = useState("0.8");
  const [modelVersion, setModelVersion] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!predictedLabelId || !modelVersion) {
      setError("Label and model version are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await predictionsApi.create({
        datapoint: datapointId,
        predicted_label: parseInt(predictedLabelId, 10),
        confidence: confidence ? parseFloat(confidence) : null,
        model_version: parseInt(modelVersion, 10),
      });

      setPredictedLabelId("");
      setConfidence("0.8");
      setModelVersion("1");
      onPredictionCreated();
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPredictedLabelId("");
    setConfidence("0.8");
    setModelVersion("1");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Add Prediction
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <Input
            label="Predicted Label ID"
            type="number"
            placeholder="Enter label ID"
            value={predictedLabelId}
            onValueChange={setPredictedLabelId}
            disabled={loading}
            min="1"
          />
          <div className="text-xs text-default-500">
            Available labels:{" "}
            {labels.map((l) => `${l.id} (${l.class_label})`).join(", ")}
          </div>

          <Input
            label="Confidence (0-1)"
            type="number"
            placeholder="0.8"
            value={confidence}
            onValueChange={setConfidence}
            disabled={loading}
            min="0"
            max="1"
            step="0.01"
          />

          <Input
            label="Model Version"
            type="number"
            placeholder="1"
            value={modelVersion}
            onValueChange={setModelVersion}
            disabled={loading}
            min="1"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            disabled={loading}
            isLoading={loading}
          >
            Add Prediction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
