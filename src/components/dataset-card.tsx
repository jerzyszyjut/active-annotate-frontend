import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  apiClient,
  ClassificationDataset,
  ClassificationDatapoint,
  ClassificationLabel,
} from "@/api/client";
import { DatapointCard } from "./datapoint-card";
import { LabelCard } from "./label-card";

interface DatasetCardProps {
  dataset: ClassificationDataset;
  onUpdate: () => void;
  onDelete: () => void;
}

export function DatasetCard({ dataset, onUpdate, onDelete }: DatasetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(dataset.name);
  const [datapoints, setDatapoints] = useState<ClassificationDatapoint[]>([]);
  const [labels, setLabels] = useState<ClassificationLabel[]>([]);
  const [showAddDatapoint, setShowAddDatapoint] = useState(false);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [newDatapointFile, setNewDatapointFile] = useState("");
  const [newDatapointLabel, setNewDatapointLabel] = useState("");
  const [newLabelIndex, setNewLabelIndex] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      loadDatapointsAndLabels();
    }
  }, [isExpanded]);

  const loadDatapointsAndLabels = async () => {
    try {
      const [dpData, lblData] = await Promise.all([
        apiClient.getDatapoints(dataset.id),
        apiClient.getLabels(dataset.id),
      ]);
      setDatapoints(dpData);
      setLabels(lblData);
    } catch (err) {
      console.error("Failed to load datapoints and labels", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.updateDataset(dataset.id, name);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update dataset", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient.deleteDataset(dataset.id);
      onDelete();
    } catch (err) {
      console.error("Failed to delete dataset", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDatapoint = async () => {
    if (!newDatapointFile.trim()) return;
    setLoading(true);
    try {
      await apiClient.createDatapoint(
        newDatapointFile,
        dataset.id,
        newDatapointLabel ? parseInt(newDatapointLabel) : undefined
      );
      setNewDatapointFile("");
      setNewDatapointLabel("");
      setShowAddDatapoint(false);
      loadDatapointsAndLabels();
    } catch (err) {
      console.error("Failed to create datapoint", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLabel = async () => {
    if (!newLabelIndex.trim() || !newLabelName.trim()) return;
    setLoading(true);
    try {
      await apiClient.createLabel(
        parseInt(newLabelIndex),
        newLabelName,
        dataset.id
      );
      setNewLabelIndex("");
      setNewLabelName("");
      setShowAddLabel(false);
      loadDatapointsAndLabels();
    } catch (err) {
      console.error("Failed to create label", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mb-4 border-2 border-green-400 rounded-lg bg-green-50">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            label="Dataset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
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
            <div>
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="text-sm text-gray-600">
                ID: {dataset.id} | Datapoints: {datapoints.length} | Labels:{" "}
                {labels.length}
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
            <div className="mt-4 pt-4 border-t-2 border-green-400">
              {/* Labels Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-blue-700">Labels</h3>
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => setShowAddLabel(!showAddLabel)}
                  >
                    {showAddLabel ? "Cancel" : "Add Label"}
                  </Button>
                </div>

                {showAddLabel && (
                  <div className="ml-4 p-3 border border-dashed border-blue-300 rounded-lg bg-blue-50 mb-3">
                    <div className="flex gap-2 mb-2">
                      <Input
                        label="Class Index"
                        type="number"
                        value={newLabelIndex}
                        onChange={(e) => setNewLabelIndex(e.target.value)}
                        size="sm"
                        className="flex-1"
                      />
                      <Input
                        label="Class Label"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        size="sm"
                        className="flex-1"
                      />
                    </div>
                    <Button
                      size="sm"
                      color="success"
                      onClick={handleAddLabel}
                      disabled={loading || !newLabelIndex || !newLabelName}
                    >
                      Create
                    </Button>
                  </div>
                )}

                {labels.length === 0 ? (
                  <p className="text-sm text-gray-500 ml-4">No labels yet</p>
                ) : (
                  <div>
                    {labels.map((label) => (
                      <LabelCard
                        key={label.id}
                        label={label}
                        onUpdate={loadDatapointsAndLabels}
                        onDelete={loadDatapointsAndLabels}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Datapoints Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-green-700">Datapoints</h3>
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => setShowAddDatapoint(!showAddDatapoint)}
                  >
                    {showAddDatapoint ? "Cancel" : "Add Datapoint"}
                  </Button>
                </div>

                {showAddDatapoint && (
                  <div className="ml-4 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 mb-3">
                    <div className="flex gap-2 mb-2 flex-col">
                      <Input
                        label="File URL"
                        value={newDatapointFile}
                        onChange={(e) => setNewDatapointFile(e.target.value)}
                        size="sm"
                      />
                      <select
                        value={newDatapointLabel}
                        onChange={(e) => setNewDatapointLabel(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">No label (optional)</option>
                        {labels.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.class_label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      size="sm"
                      color="success"
                      onClick={handleAddDatapoint}
                      disabled={loading || !newDatapointFile}
                    >
                      Create
                    </Button>
                  </div>
                )}

                {datapoints.length === 0 ? (
                  <p className="text-sm text-gray-500 ml-4">
                    No datapoints yet
                  </p>
                ) : (
                  <div>
                    {datapoints.map((dp) => (
                      <DatapointCard
                        key={dp.id}
                        datapoint={dp}
                        datasetLabels={labels}
                        onUpdate={loadDatapointsAndLabels}
                        onDelete={loadDatapointsAndLabels}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
