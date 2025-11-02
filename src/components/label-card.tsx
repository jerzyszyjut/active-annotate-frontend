import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { apiClient, ClassificationLabel } from "@/api/client";

interface LabelCardProps {
  label: ClassificationLabel;
  onUpdate: () => void;
  onDelete: () => void;
}

export function LabelCard({ label, onUpdate, onDelete }: LabelCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [classIndex, setClassIndex] = useState(label.class_index.toString());
  const [classLabel, setClassLabel] = useState(label.class_label);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.updateLabel(label.id, parseInt(classIndex), classLabel);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update label", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient.deleteLabel(label.id);
      onDelete();
    } catch (err) {
      console.error("Failed to delete label", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 ml-4 mb-2 border border-blue-200 rounded-lg bg-blue-50">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            label="Class Index"
            type="number"
            value={classIndex}
            onChange={(e) => setClassIndex(e.target.value)}
            size="sm"
          />
          <Input
            label="Class Label"
            value={classLabel}
            onChange={(e) => setClassLabel(e.target.value)}
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
            <p className="text-sm font-medium">{label.class_label}</p>
            <p className="text-xs text-gray-600">Index: {label.class_index}</p>
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
