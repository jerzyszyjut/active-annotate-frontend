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
import { Card, CardBody } from "@heroui/card";
import { labelsApi, handleApiError } from "@/utils/api";
import type { ClassificationLabel } from "@/types";

interface LabelManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetId: number;
  currentLabels: ClassificationLabel[];
  onLabelCreated: () => void;
}

export function LabelManagementModal({
  isOpen,
  onClose,
  datasetId,
  currentLabels,
  onLabelCreated,
}: LabelManagementModalProps) {
  const [classIndex, setClassIndex] = useState("");
  const [classLabel, setClassLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLabel = async () => {
    if (!classLabel || classIndex === "") {
      setError("Both class index and label are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await labelsApi.create({
        dataset: datasetId,
        class_index: parseInt(classIndex, 10),
        class_label: classLabel,
      });

      setClassIndex("");
      setClassLabel("");
      onLabelCreated();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClassIndex("");
    setClassLabel("");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Manage Labels</ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3 text-sm">Add New Label</h3>
            <div className="flex gap-2 mb-4">
              <Input
                label="Class Index"
                type="number"
                placeholder="0"
                value={classIndex}
                onValueChange={setClassIndex}
                disabled={loading}
                min="0"
              />
              <Input
                label="Class Label"
                placeholder="e.g., Cat"
                value={classLabel}
                onValueChange={setClassLabel}
                disabled={loading}
              />
              <Button
                color="primary"
                onClick={handleAddLabel}
                disabled={loading}
                isLoading={loading}
                className="mt-auto"
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Current Labels</h3>
            {currentLabels.length === 0 ? (
              <p className="text-sm text-default-500">No labels yet</p>
            ) : (
              <div className="space-y-2">
                {currentLabels.map((label) => (
                  <Card key={label.id}>
                    <CardBody className="py-2 px-3 flex flex-row justify-between items-center">
                      <div>
                        <span className="font-medium">{label.class_label}</span>
                        <span className="text-xs text-default-500 ml-2">
                          (Index: {label.class_index})
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            disabled={loading}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
