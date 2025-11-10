// lightweight presentational component; no React namespace required directly
import { ClassificationDatapoint } from "@/types";

interface Props {
  datapoint: ClassificationDatapoint;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export default function DatapointCard({
  datapoint,
  isSelected,
  onSelect,
  onDelete,
}: Props) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded cursor-pointer ${isSelected ? "ring-2 ring-purple-500" : "bg-slate-700"}`}
    >
      {datapoint.file_url && (
        <img
          src={datapoint.file_url}
          alt={`dp-${datapoint.id}`}
          className="w-full h-28 object-cover rounded mb-2"
        />
      )}
      <div className="text-sm font-medium">#{datapoint.id}</div>
      <div className="text-xs text-slate-400">
        {datapoint.label?.class_label || "No label"}
      </div>
      <div className="text-xs text-slate-400">
        Predictions: {datapoint.predictions?.length || 0}
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="mt-2 px-2 py-1 bg-red-600 rounded text-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
}
