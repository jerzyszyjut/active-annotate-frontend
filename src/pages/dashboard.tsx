import { Link } from "react-router-dom";

import { useDatasets } from "@/lib/hooks";
import CreateDatasetModal from "@/components/create-dataset-modal";

export default function DashboardPage() {
  const { datasets, loading, error, createDataset, deleteDataset } =
    useDatasets();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete dataset?")) return;
    try {
      await deleteDataset(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete dataset");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Datasets</h1>
            <p className="text-slate-400">List of classification datasets</p>
          </div>
          <div className="flex gap-2">
            <CreateDatasetModal onCreate={createDataset} />
            <Link to="/integrations" className="px-3 py-2 bg-slate-700 rounded">
              Integrations
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : datasets.length === 0 ? (
          <p className="text-slate-400">No datasets yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((d) => (
              <div key={d.id} className="bg-slate-800 p-4 rounded">
                <h2 className="font-semibold truncate">{d.name}</h2>
                <p className="text-sm text-slate-400">
                  {d.datapoints?.length || 0} datapoints •{" "}
                  {d.labels?.length || 0} labels
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/datasets/${d.id}`}
                    className="px-2 py-1 bg-purple-600 rounded text-sm"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="px-2 py-1 bg-red-600 rounded text-sm"
                  >
                    Delete
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
