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
import { datasetsApi, handleApiError } from "@/lib/api";

interface CreateDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDatasetModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateDatasetModalProps) {
  const [name, setName] = useState("");
  const [labelStudioUrl, setLabelStudioUrl] = useState("");
  const [labelStudioApiKey, setLabelStudioApiKey] = useState("");
  const [mlBackendUrl, setMlBackendUrl] = useState("");
  const [batchSize, setBatchSize] = useState("16");
  const [uncertaintyStrategy, setUncertaintyStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !labelStudioUrl || !labelStudioApiKey || !mlBackendUrl) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await datasetsApi.create({
        name,
        label_studio_url: labelStudioUrl,
        label_studio_api_key: labelStudioApiKey,
        ml_backend_url: mlBackendUrl,
        batch_size: parseInt(batchSize, 10) || 16,
        uncertainty_strategy: uncertaintyStrategy
      });

      // Reset form
      setName("");
      setLabelStudioUrl("");
      setLabelStudioApiKey("");
      setMlBackendUrl("");
      setBatchSize("16");
      setUncertaintyStrategy("");

      onSuccess();
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setLabelStudioUrl("");
    setLabelStudioApiKey("");
    setMlBackendUrl("");
    setBatchSize("16");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Create New Dataset
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <Input
            label="Dataset Name"
            placeholder="e.g., Cat vs Dog Classification"
            value={name}
            onValueChange={setName}
            disabled={loading}
          />

          <Input
            label="Label Studio URL"
            placeholder="e.g., http://label-studio:8080"
            value={labelStudioUrl}
            onValueChange={setLabelStudioUrl}
            disabled={loading}
          />

          <Input
            label="Label Studio API Key"
            type="password"
            placeholder="Enter your API key"
            value={labelStudioApiKey}
            onValueChange={setLabelStudioApiKey}
            disabled={loading}
          />

          <Input
            label="ML Backend URL"
            placeholder="e.g., http://ml-backend:9090"
            value={mlBackendUrl}
            onValueChange={setMlBackendUrl}
            disabled={loading}
          />

          <Input
            label="Batch Size"
            type="number"
            placeholder="16"
            value={batchSize}
            onValueChange={setBatchSize}
            disabled={loading}
            min="1"
            max="1000"
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
            {loading ? "Creating..." : "Create Dataset"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
