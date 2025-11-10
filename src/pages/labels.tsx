import { useEffect, useState } from "react";
import { labelsAPI, datasetsAPI } from "@/lib/api";
import { ClassificationLabel, ClassificationDataset } from "@/types";
import ConfirmModal from "@/components/confirm-modal";
import AddLabelModal from "@/components/add-label-modal";

export default function LabelsPage() {
  const [labels, setLabels] = useState<ClassificationLabel[]>([]);
  const [datasets, setDatasets] = useState<ClassificationDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [classIndex, setClassIndex] = useState(0);
  const [classLabel, setClassLabel] = useState("");
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const [ls, ds] = await Promise.all([
        labelsAPI.list(),
        datasetsAPI.list(),
      ]);
      setLabels(ls);
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

  const create = async () => {
    if (datasetId === null) return alert("Pick dataset");
    setCreating(true);
    try {
      await labelsAPI.create({
        class_index: classIndex,
        class_label: classLabel,
        dataset: datasetId,
      });
      setClassIndex(0);
      setClassLabel("");
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Failed to create label");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete label?")) return;
    try {
      await labelsAPI.delete(id);
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete label");
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
      await Promise.all(Array.from(selected).map((id) => labelsAPI.delete(id)));
      setSelected(new Set());
      await fetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete some labels");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Labels</h1>
        <div className="bg-slate-800 p-4 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="p-2 bg-slate-700 rounded"
              value={classIndex}
              onChange={(e) =>
                setClassIndex(parseInt(e.target.value || "0", 10))
              }
              placeholder="Class index"
            />
            <input
              className="p-2 bg-slate-700 rounded"
              value={classLabel}
              onChange={(e) => setClassLabel(e.target.value)}
              placeholder="Label name"
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
          </div>
          <div className="mt-3">
            <button
              onClick={create}
              disabled={creating}
              className="px-3 py-2 bg-green-600 rounded"
            >
              {creating ? "Creating…" : "Create label"}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <div className="space-y-2">
            <div className="mb-2 flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-3 py-1 bg-emerald-600 rounded"
              >
                Add label
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={selected.size === 0}
                className="px-3 py-1 bg-red-600 rounded"
              >
                Delete Selected ({selected.size})
              </button>
            </div>
            {labels.map((l) => (
              <div
                key={l.id}
                className="flex justify-between items-center bg-slate-800 p-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(l.id)}
                    onChange={() => toggleSelect(l.id)}
                  />
                  <div className="text-sm">
                    [{l.class_index}] {l.class_label}{" "}
                    <span className="text-xs text-slate-400">
                      (dataset {l.dataset})
                    </span>
                  </div>
                </div>
                <button onClick={() => remove(l.id)} className="text-red-400">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <ConfirmModal
          open={confirmOpen}
          title="Delete selected labels?"
          message={`Delete ${selected.size} labels permanently?`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            setConfirmOpen(false);
            await deleteSelected();
          }}
        />
        <AddLabelModal
          open={modalOpen}
          datasetId={datasetId}
          onClose={() => {
            setModalOpen(false);
            fetch();
          }}
        />
      </div>
    </div>
  );
}
