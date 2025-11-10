import { useState } from "react";
import { datapointsAPI } from "@/lib/api";

interface FileUploadModalProps {
  open: boolean;
  datasetId?: number | null;
  onClose: () => void;
  onDone?: () => void;
  onUpload?: (files: File[]) => Promise<void>;
}

type Status = {
  name: string;
  status: "pending" | "success" | "error";
  error?: string;
};

export default function FileUploadModal({
  open,
  datasetId = null,
  onClose,
  onDone,
  onUpload,
}: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [running, setRunning] = useState(false);

  if (!open) return null;

  const onChange = (fl: FileList | null) => {
    if (!fl) return;
    const arr = Array.from(fl);
    setFiles(arr);
    setStatuses(arr.map((f) => ({ name: f.name, status: "pending" })));
  };

  const run = async () => {
    if (files.length === 0) return alert("Pick files to upload");
    if (!datasetId && !onUpload) return alert("No dataset selected");
    setRunning(true);
    const s = [...statuses];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        if (onUpload) {
          await onUpload([f]);
        } else {
          const fd = new FormData();
          fd.append("file", f);
          fd.append("dataset", String(datasetId));
          await datapointsAPI.create(fd);
        }
        s[i] = { ...s[i], status: "success" };
      } catch (err: any) {
        s[i] = { ...s[i], status: "error", error: String(err?.message ?? err) };
      }
      setStatuses([...s]);
    }
    setRunning(false);
    onDone?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-slate-900 text-white rounded p-4 w-full max-w-lg">
        <h3 className="text-lg font-bold">Upload files</h3>
        <p className="text-sm text-slate-400 mt-1">
          Upload one or more files to dataset{" "}
          {datasetId ?? "(select a dataset first)"}.
        </p>

        <div className="mt-3">
          <input
            type="file"
            multiple
            onChange={(e) => onChange(e.target.files)}
            className="block"
          />
        </div>

        <div className="mt-3 space-y-1 max-h-40 overflow-auto">
          {statuses.map((st) => (
            <div
              key={st.name}
              className="flex justify-between items-center bg-slate-800 p-2 rounded text-sm"
            >
              <div className="truncate">{st.name}</div>
              <div className="text-xs text-slate-400">
                {st.status}
                {st.error ? `: ${st.error}` : ""}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-slate-700 rounded">
            Cancel
          </button>
          <button
            onClick={run}
            disabled={running || files.length === 0}
            className="px-3 py-1 bg-green-600 rounded"
          >
            {running ? "Uploading…" : "Start upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
