import { useState } from "react";
import { ClassificationDataset } from "@/types";

interface Props {
  onCreate: (data: {
    name: string;
    label_studio_url?: string;
    label_studio_api_key?: string;
    ml_backend_url?: string;
    batch_size?: number;
  }) => Promise<ClassificationDataset>;
}

export default function CreateDatasetModal({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [labelStudioUrl, setLabelStudioUrl] = useState("");
  const [labelStudioKey, setLabelStudioKey] = useState("");
  const [mlBackendUrl, setMlBackendUrl] = useState("");
  const [batchSize, setBatchSize] = useState(16);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (
      !name.trim() ||
      !labelStudioUrl.trim() ||
      !labelStudioKey.trim() ||
      !mlBackendUrl.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        label_studio_url: labelStudioUrl.trim(),
        label_studio_api_key: labelStudioKey.trim(),
        ml_backend_url: mlBackendUrl.trim(),
        batch_size: batchSize,
      });
      setOpen(false);
      setName("");
      setLabelStudioUrl("");
      setLabelStudioKey("");
      setMlBackendUrl("");
      setBatchSize(16);
    } catch (err) {
      console.error(err);
      alert("Failed to create dataset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-purple-600 rounded text-sm"
      >
        Create New Dataset
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setOpen(false)}
          />
          <div className="bg-white text-slate-900 p-4 rounded z-10 w-full max-w-lg">
            <h3 className="font-semibold mb-2">Create Dataset</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Label Studio URL</label>
                <input
                  value={labelStudioUrl}
                  onChange={(e) => setLabelStudioUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Label Studio API Key</label>
                <input
                  value={labelStudioKey}
                  onChange={(e) => setLabelStudioKey(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm">ML Backend URL</label>
                <input
                  value={mlBackendUrl}
                  onChange={(e) => setMlBackendUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Batch size</label>
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) =>
                    setBatchSize(parseInt(e.target.value || "16", 10))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="px-3 py-2 bg-purple-600 text-white rounded"
              >
                {loading ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
