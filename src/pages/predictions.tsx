import { useEffect, useState } from "react";
import { predictionsAPI, datapointsAPI } from "@/lib/api";
import { ClassificationPrediction, ClassificationDatapoint } from "@/types";
import ConfirmModal from "@/components/confirm-modal";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<ClassificationPrediction[]>(
    []
  );
  const [datapoints, setDatapoints] = useState<ClassificationDatapoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [datapointId, setDatapointId] = useState<number | null>(null);
  const [predIndex, setPredIndex] = useState<number>(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const [ps, dps] = await Promise.all([
        predictionsAPI.list(),
        datapointsAPI.list(),
      ]);
      setPredictions(ps);
      setDatapoints(dps);
      if (dps.length && datapointId === null) setDatapointId(dps[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const create = async () => {
    if (!datapointId) return alert("Pick datapoint");
    setCreating(true);
    try {
      await predictionsAPI.create({
        datapoint: datapointId,
        predicted_class_index: predIndex,
      });
      setPredIndex(0);
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Create failed");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete prediction?")) return;
    try {
      await predictionsAPI.delete(id);
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
    try {
      await Promise.all(
        Array.from(selected).map((id) => predictionsAPI.delete(id))
      );
      setSelected(new Set());
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete some predictions");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Predictions</h1>

        <div className="bg-slate-800 p-4 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              className="p-2 bg-slate-700 rounded"
              value={datapointId ?? ""}
              onChange={(e) =>
                setDatapointId(parseInt(e.target.value || "0", 10))
              }
            >
              <option value="">Pick datapoint</option>
              {datapoints.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} - {d.file_url ? "file" : "no-file"}
                </option>
              ))}
            </select>
            <input
              className="p-2 bg-slate-700 rounded"
              value={predIndex}
              onChange={(e) =>
                setPredIndex(parseInt(e.target.value || "0", 10))
              }
              placeholder="Predicted index"
            />
            <button
              onClick={create}
              disabled={creating}
              className="px-3 py-2 bg-green-600 rounded"
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <div className="space-y-2">
            <div className="mb-2">
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={selected.size === 0}
                className="px-3 py-1 bg-red-600 rounded"
              >
                Delete Selected ({selected.size})
              </button>
            </div>
            {predictions.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center bg-slate-800 p-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                  <div className="text-sm">
                    datapoint {p.datapoint} → [
                    {p.predicted_label?.class_index ?? "?"}]{" "}
                    {p.predicted_label?.class_label ?? ""}{" "}
                    <span className="text-xs text-slate-400">(id {p.id})</span>
                  </div>
                </div>
                <button onClick={() => remove(p.id)} className="text-red-400">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <ConfirmModal
          open={confirmOpen}
          title="Delete selected predictions?"
          message={`Delete ${selected.size} predictions permanently?`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            setConfirmOpen(false);
            await deleteSelected();
          }}
        />
      </div>
    </div>
  );
}
