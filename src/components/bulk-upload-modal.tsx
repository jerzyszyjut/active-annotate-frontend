import { useState } from "react";
import { datapointsAPI } from "@/lib/api";

interface BulkUploadModalProps {
  datasetId: number | null;
  onDone?: () => void;
}

type FileStatus = {
  name: string;
  status: "pending" | "success" | "error";
  error?: string;
};

export default function BulkUploadModal({
  datasetId,
  onDone,
}: BulkUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);
  const [running, setRunning] = useState(false);

  const onChange = (fl: FileList | null) => {
    if (!fl) return;
    const arr = Array.from(fl);
    setFiles(arr);
    setStatuses(arr.map((f) => ({ name: f.name, status: "pending" })));
  };

  const runUpload = async () => {
    if (!datasetId) return alert("Pick dataset before bulk upload");
    if (files.length === 0) return alert("Pick files to upload");
    setRunning(true);
    const newStatuses = [...statuses];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("dataset", String(datasetId));
        await datapointsAPI.create(fd);
        newStatuses[i] = { ...newStatuses[i], status: "success" };
      } catch (err: any) {
        console.error(err);
        newStatuses[i] = {
          ...newStatuses[i],
          status: "error",
          error: String(err?.message ?? err),
        };
      }
      setStatuses([...newStatuses]);
    }

    setRunning(false);
    onDone?.();
  };

  return (
    <div className="inline-block">
      <label className="inline-flex items-center gap-2">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onChange(e.target.files)}
        />
        <button className="px-3 py-2 bg-green-600 rounded text-sm">
          Select files
        </button>
      </label>
      <button
        onClick={runUpload}
        disabled={running || files.length === 0 || !datasetId}
        className="ml-2 px-3 py-2 bg-emerald-500 rounded text-sm"
      >
        {running ? "Uploading…" : "Start uploads"}
      </button>

      <div className="mt-2 space-y-1">
        {statuses.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between bg-slate-800 p-2 rounded text-sm"
          >
            <div className="truncate">{s.name}</div>
            <div className="text-xs text-slate-400">
              {s.status}
              {s.error ? `: ${s.error}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
