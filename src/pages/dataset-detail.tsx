import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDataset } from "@/lib/hooks";
import AddLabelModal from "@/components/add-label-modal";
import FileUploadModal from "@/components/file-upload-modal";

export default function DatasetDetailPage() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const id = parseInt(datasetId || "0", 10);
  const {
    dataset,
    loading,
    deleteDatapoint,
    updateDatapoint,
    addDatapoints,
    addLabel,
    addPrediction,
    deletePrediction,
    refetch,
  } = useDataset(id);

  const [selected, setSelected] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  if (!datasetId) return <p className="p-6 text-slate-400">Invalid id</p>;
  if (loading) return <p className="p-6 text-slate-400">Loading...</p>;
  if (!dataset) return <p className="p-6 text-slate-400">Dataset not found</p>;

  const datapoints = dataset.datapoints || [];
  const labels = dataset.labels || [];

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={() => navigate(-1)} className="text-slate-400">
              ← Back
            </button>
            <h1 className="text-2xl font-bold">{dataset.name}</h1>
            <p className="text-slate-400">
              {datapoints.length} datapoints • {labels.length} labels
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUploadOpen(true)}
              className="px-3 py-2 bg-slate-700 rounded"
            >
              Upload
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 bg-purple-600 rounded"
            >
              Add label
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-4 rounded">
              <h2 className="font-semibold">Datapoints</h2>
              <div className="mt-2 space-y-2 max-h-[60vh] overflow-auto">
                {datapoints.map((d) => (
                  <div
                    key={d.id}
                    className={`p-2 rounded cursor-pointer ${selected === d.id ? "ring-2 ring-purple-500" : "bg-slate-700"}`}
                    onClick={() => setSelected(d.id)}
                  >
                    <div className="text-sm">#{d.id}</div>
                    <div className="text-xs text-slate-400">
                      {d.label?.class_label || "No label"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {selected ? (
              (() => {
                const dp = datapoints.find((p) => p.id === selected)!;
                return (
                  <div className="bg-slate-800 p-4 rounded">
                    <h3 className="font-semibold mb-2">Datapoint #{dp.id}</h3>
                    {dp.file_url ? (
                      <img
                        src={dp.file_url}
                        alt="datapoint"
                        className="max-h-96 object-contain mx-auto"
                      />
                    ) : (
                      <div className="text-slate-400">No file</div>
                    )}

                    <div className="mt-3">
                      <label className="block text-sm mb-1">Set label</label>
                      <select
                        value={dp.label?.id || ""}
                        onChange={async (e) => {
                          const labelId = parseInt(e.target.value || "0", 10);
                          const label = labels.find((l) => l.id === labelId);
                          if (label) await updateDatapoint(dp.id, label);
                        }}
                        className="w-full p-2 bg-slate-700 rounded"
                      >
                        <option value="">Select label</option>
                        {labels.map((l) => (
                          <option key={l.id} value={l.id}>
                            [{l.class_index}] {l.class_label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={async () => {
                          if (!confirm("Delete datapoint?")) return;
                          await deleteDatapoint(dp.id);
                          setSelected(null);
                        }}
                        className="px-2 py-1 bg-red-600 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={async () => {
                          const labelId = parseInt(
                            prompt("Prediction label id") || "",
                            10
                          );
                          const conf = parseFloat(
                            prompt("Confidence 0-1 (optional)") || ""
                          );
                          if (!Number.isNaN(labelId)) {
                            await addPrediction(
                              dp.id,
                              labelId,
                              Number.isNaN(conf) ? undefined : conf
                            );
                          }
                        }}
                        className="px-2 py-1 bg-purple-600 rounded"
                      >
                        Add prediction
                      </button>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold">Predictions</h4>
                      <div className="space-y-2 mt-2">
                        {(dp.predictions || []).map((p) => (
                          <div
                            key={p.id}
                            className="flex justify-between items-center bg-slate-700 p-2 rounded"
                          >
                            <div>
                              <div className="text-sm">
                                {p.predicted_label?.class_label ??
                                  String(p.predicted_label ?? "")}
                              </div>
                              <div className="text-xs text-slate-400">
                                Confidence: {p.confidence ?? "N/A"}
                              </div>
                            </div>
                            <button
                              onClick={() => deletePrediction(dp.id, p.id)}
                              className="text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-slate-800 p-4 rounded text-slate-400">
                Select a datapoint to see details
              </div>
            )}
          </div>
        </div>
        <AddLabelModal
          open={modalOpen}
          datasetId={id}
          onClose={() => setModalOpen(false)}
          onCreate={async (p) => {
            await addLabel(p.class_index, p.class_label);
            return Promise.resolve({
              id: 0,
              class_index: p.class_index,
              class_label: p.class_label,
              dataset: id,
            });
          }}
        />
        <FileUploadModal
          open={uploadOpen}
          datasetId={id}
          onClose={() => setUploadOpen(false)}
          onDone={() => {
            refetch();
          }}
          onUpload={async (files) => {
            await addDatapoints(files);
          }}
        />
      </div>
    </div>
  );
}
