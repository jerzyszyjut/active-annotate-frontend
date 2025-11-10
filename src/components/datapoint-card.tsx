import { ClassificationDatapoint } from "@/types";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";

interface DatapointCardProps {
  datapoint: ClassificationDatapoint;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function DatapointCard({
  datapoint,
  isSelected,
  onSelect,
  onDelete,
}: DatapointCardProps) {
  return (
    <Card
      isPressable
      className={`bg-slate-700 border ${
        isSelected ? "border-purple-500" : "border-slate-600"
      } transition-colors`}
      onPress={onSelect}
    >
      <CardBody className="gap-3">
        <Image
          src={datapoint.file_url}
          alt="datapoint"
          className="w-full h-48 object-cover rounded"
        />
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-300">#{datapoint.id}</p>
          <p className="text-xs text-slate-400">
            Label: {datapoint.label?.class_label || "None"}
          </p>
          <p className="text-xs text-slate-400">
            Predictions: {datapoint.predictions.length}
          </p>
          {isSelected && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={onDelete}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
