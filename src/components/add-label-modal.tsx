import { useState } from "react";
import { ClassificationLabel } from "@/types";
import { labelsAPI } from "@/lib/api";

interface AddLabelModalProps {
  open: boolean;
  datasetId?: number | null;
  onClose: () => void;
  onCreate?: (payload: {
    class_index: number;
    class_label: string;
    dataset: number;
  }) => Promise<ClassificationLabel>;
}

export default function AddLabelModal({
  open,
  datasetId = null,
  onClose,
  onCreate,
}: AddLabelModalProps) {
  const [classIndex, setClassIndex] = useState<number>(0);
  const [classLabel, setClassLabel] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (datasetId == null) return alert("Select dataset first");
    if (!classLabel) return alert("Enter label name");
    setLoading(true);
    try {
      const payload = {
        class_index: classIndex,
        class_label: classLabel,
        dataset: datasetId,
      };
      await (onCreate ? onCreate(payload) : labelsAPI.create(payload));
      setClassIndex(0);
      setClassLabel("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create label");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-slate-900 text-white rounded p-4 w-full max-w-md">
        <h3 className="text-lg font-bold">Add label</h3>
        <div className="mt-3 space-y-2">
          <div>
            <label className="block text-sm">Class index</label>
            <input
              type="number"
              value={classIndex}
              onChange={(e) =>
                setClassIndex(parseInt(e.target.value || "0", 10))
              }
              className="w-full p-2 bg-slate-700 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm">Label name</label>
            <input
              value={classLabel}
              onChange={(e) => setClassLabel(e.target.value)}
              className="w-full p-2 bg-slate-700 rounded mt-1"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-3 py-1 bg-green-600 rounded"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
