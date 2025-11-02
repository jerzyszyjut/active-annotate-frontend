import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { ClassificationLabel } from "@/types";

interface LabelManagementModalProps {
  labels: ClassificationLabel[];
  onAddLabel: (classIndex: number, classLabel: string) => Promise<any>;
  onDeleteLabel: (labelId: number) => Promise<any>;
}

export default function LabelManagementModal({
  labels,
  onAddLabel,
  onDeleteLabel,
}: LabelManagementModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newLabelIndex, setNewLabelIndex] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLabel = async () => {
    if (!newLabelIndex.trim() || !newLabelName.trim()) return;
    setIsAdding(true);
    try {
      await onAddLabel(parseInt(newLabelIndex), newLabelName);
      setNewLabelIndex("");
      setNewLabelName("");
    } catch (error) {
      console.error("Failed to add label:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLabel = async (labelId: number) => {
    if (confirm("Are you sure you want to delete this label?")) {
      try {
        await onDeleteLabel(labelId);
      } catch (error) {
        console.error("Failed to delete label:", error);
      }
    }
  };

  return (
    <>
      <Button color="secondary" onPress={onOpen} variant="flat">
        Manage Labels
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                Manage Labels
              </ModalHeader>
              <ModalBody className="max-h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  {/* Add New Label Section */}
                  <div className="border-b border-slate-700 pb-4">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">
                      Add New Label
                    </h3>
                    <div className="space-y-2">
                      <Input
                        label="Class Index"
                        placeholder="e.g., 0"
                        type="number"
                        value={newLabelIndex}
                        onValueChange={setNewLabelIndex}
                        variant="bordered"
                      />
                      <Input
                        label="Label Name"
                        placeholder="e.g., Cat"
                        value={newLabelName}
                        onValueChange={setNewLabelName}
                        variant="bordered"
                      />
                      <Button
                        color="success"
                        variant="flat"
                        size="sm"
                        onPress={handleAddLabel}
                        isLoading={isAdding}
                        isDisabled={
                          !newLabelIndex.trim() || !newLabelName.trim()
                        }
                      >
                        Add Label
                      </Button>
                    </div>
                  </div>

                  {/* Existing Labels Section */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3">
                      Existing Labels
                    </h3>
                    {labels.length === 0 ? (
                      <p className="text-xs text-slate-500">No labels yet</p>
                    ) : (
                      <div className="space-y-2">
                        {labels.map((label) => (
                          <div
                            key={label.id}
                            className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                          >
                            <span className="text-sm text-white">
                              [{label.class_index}] {label.class_label}
                            </span>
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={() => handleDeleteLabel(label.id)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
