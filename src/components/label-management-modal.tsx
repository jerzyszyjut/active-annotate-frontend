import { useState } from "react";
import { ClassificationLabel } from "@/types";

interface Props {
  labels?: ClassificationLabel[];
  onAddLabel?: (classIndex: number, classLabel: string) => Promise<any>;
  onDeleteLabel?: (labelId: number) => Promise<any>;
}

export default function LabelManagementModal({
  labels = [],
  onAddLabel,
  onDeleteLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!onAddLabel) return;
    const idx = parseInt(index, 10);
    if (Number.isNaN(idx) || !name.trim()) return alert("Invalid input");
    setLoading(true);
    try {
      await onAddLabel(idx, name.trim());
      setIndex("");
      setName("");
    } catch (err) {
      console.error(err);
      alert("Failed to add label");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: number) => {
    if (!onDeleteLabel) return;
    if (!confirm("Delete label?")) return;
    await onDeleteLabel(id);
  };

  return (
    <div className="inline-block">
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-slate-600 rounded text-sm"
      >
        Manage Labels
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setOpen(false)}
          />
          <div className="bg-slate-900 text-white p-4 rounded z-10 w-full max-w-md">
            <h3 className="font-semibold mb-2">Manage Labels</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  placeholder="Index"
                  className="flex-1 p-2 bg-slate-700 rounded"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Label name"
                  className="flex-2 p-2 bg-slate-700 rounded"
                />
                <button
                  onClick={add}
                  disabled={loading}
                  className="px-3 py-2 bg-green-600 rounded"
                >
                  {loading ? "Adding…" : "Add"}
                </button>
              </div>

              <div className="max-h-40 overflow-auto mt-3">
                {labels.length === 0 ? (
                  <div className="text-sm text-slate-400">No labels yet</div>
                ) : (
                  labels.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between p-2 bg-slate-800 rounded mb-2"
                    >
                      <div className="text-sm">
                        [{l.class_index}] {l.class_label}
                      </div>
                      <button
                        onClick={() => del(l.id)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 bg-slate-600 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
