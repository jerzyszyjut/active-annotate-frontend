import { useState } from "react";
import { useDatasets } from "@/lib/hooks";
import { integrationsAPI } from "@/lib/api";

export default function IntegrationsPage() {
  const { datasets, loading, error } = useDatasets();
  const [running, setRunning] = useState<number | null>(null);

  const start = async (datasetId: number) => {
    if (!confirm("Start active learning for dataset " + datasetId + "?"))
      return;
    try {
      setRunning(datasetId);
      const res = await integrationsAPI.startActiveLearning(datasetId);
      alert(res.status || "started");
    } catch (err) {
      console.error(err);
      alert("Failed to start active learning");
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Integrations</h1>
        <p className="text-slate-400 mb-4">
          Trigger backend integrations like active learning
        </p>

        {loading ? (
          <p className="text-slate-400">Loading datasets…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="space-y-2">
            {datasets.map((d) => (
              <div
                key={d.id}
                className="bg-slate-800 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-slate-400">
                    {d.datapoints?.length || 0} datapoints
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => start(d.id)}
                    className="px-3 py-1 bg-purple-600 rounded"
                    disabled={running !== null}
                  >
                    {running === d.id ? "Starting…" : "Start active learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
