import { useEffect, useState } from "react";
import { datapointsAPI, datasetsAPI } from "@/lib/api";
import { ClassificationDatapoint, ClassificationDataset } from "@/types";
import BulkUploadModal from "@/components/bulk-upload-modal";
import ConfirmModal from "@/components/confirm-modal";

export default function DatapointsPage() {
  const [datapoints, setDatapoints] = useState<ClassificationDatapoint[]>([]);
  const [datasets, setDatasets] = useState<ClassificationDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const [dps, ds] = await Promise.all([
        datapointsAPI.list(),
        datasetsAPI.list(),
      ]);
      setDatapoints(dps);
      setDatasets(ds);
      if (ds.length && datasetId === null) setDatasetId(ds[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const upload = async () => {
    if (!file) return alert("Pick file");
    if (!datasetId) return alert("Pick dataset");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("dataset", String(datasetId));
    try {
      await datapointsAPI.create(fd);
      setFile(null);
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete datapoint?")) return;
    try {
      await datapointsAPI.delete(id);
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const toggleSelect = (id: number) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    try {
      await Promise.all(ids.map((id) => datapointsAPI.delete(id)));
      setSelected(new Set());
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete some items");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Datapoints</h1>

        <div className="bg-slate-800 p-4 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <input
              type="file"
              className="p-2 bg-slate-700 rounded"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <select
              className="p-2 bg-slate-700 rounded"
              value={datasetId ?? ""}
              onChange={(e) =>
                setDatasetId(parseInt(e.target.value || "0", 10))
              }
            >
              <option value="">Select dataset</option>
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={upload}
                className="px-3 py-2 bg-green-600 rounded"
              >
                Upload
              </button>
              <button
                onClick={() => setShowBulk((s) => !s)}
                className="px-3 py-2 bg-amber-600 rounded"
              >
                Bulk Upload
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={selected.size === 0}
                className="px-3 py-2 bg-red-600 rounded"
              >
                Delete Selected ({selected.size})
              </button>
            </div>
          </div>
          {showBulk && (
            <div className="mt-3">
              <BulkUploadModal
                datasetId={datasetId}
                onDone={() => {
                  setShowBulk(false);
                  fetch();
                }}
              />
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <div className="space-y-2">
            {datapoints.map((dp) => (
              <div
                key={dp.id}
                className="flex justify-between items-center bg-slate-800 p-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(dp.id)}
                    onChange={() => toggleSelect(dp.id)}
                  />
                  <div className="text-sm">
                    {dp.file_url ? (
                      <a
                        className="underline text-sky-400"
                        href={dp.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        view
                      </a>
                    ) : (
                      "no file"
                    )}{" "}
                    <span className="text-xs text-slate-400">id {dp.id}</span>
                  </div>
                </div>
                <button onClick={() => remove(dp.id)} className="text-red-400">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        open={confirmOpen}
        title="Delete selected datapoints?"
        message={`Delete ${selected.size} datapoints permanently?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          await deleteSelected();
        }}
      />
    </div>
  );
}
