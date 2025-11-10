import { useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import { Card, CardBody, CardHeader } from "@heroui/card";

import type {
  ClassificationDatapoint,
  ClassificationPrediction,
} from "@/types";

interface DatapointModalProps {
  isOpen: boolean;
  onClose: () => void;
  datapoint: ClassificationDatapoint | null;
}

export function DatapointModal({
  isOpen,
  onClose,
  datapoint,
}: DatapointModalProps) {
  // Group predictions by version
  const predictionsByVersion = useMemo(() => {
    if (!datapoint) return new Map<number, ClassificationPrediction[]>();

    const grouped = new Map<number, ClassificationPrediction[]>();
    datapoint.predictions.forEach((pred) => {
      if (!grouped.has(pred.model_version)) {
        grouped.set(pred.model_version, []);
      }
      grouped.get(pred.model_version)!.push(pred);
    });

    return grouped;
  }, [datapoint]);

  if (!datapoint) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent className="max-h-[90vh]">
        <ModalHeader className="flex flex-col gap-1 flex-shrink-0">
          Datapoint #{datapoint.id}
        </ModalHeader>
        <Divider />
        <ModalBody className="gap-4 overflow-y-auto flex-1 pb-4">
          {/* File Preview - Fixed Height Section */}
          <Card className="flex-shrink-0">
            <CardHeader>File Preview</CardHeader>
            <Divider />
            <CardBody className="max-h-96 overflow-auto">
              {datapoint.file_url ? (
                <div className="flex flex-col gap-2">
                  <img
                    src={datapoint.file_url}
                    alt="Datapoint"
                    className="w-full h-auto rounded-lg object-contain"
                  />
                  <p className="text-xs text-default-500 break-all truncate">
                    {datapoint.file_url}
                  </p>
                </div>
              ) : (
                <p className="text-default-500">No file available</p>
              )}
            </CardBody>
          </Card>

          {/* Current Label - Fixed Height Section */}
          <Card className="flex-shrink-0">
            <CardHeader>Current Label</CardHeader>
            <Divider />
            <CardBody>
              {datapoint.label ? (
                <div className="flex items-center gap-2">
                  <Badge color="success">{datapoint.label.class_label}</Badge>
                  <span className="text-sm text-default-500">
                    (Index: {datapoint.label.class_index})
                  </span>
                </div>
              ) : (
                <p className="text-default-500 text-sm">Not labeled</p>
              )}
            </CardBody>
          </Card>

          {/* Predictions by Version - Scrollable Section */}
          {predictionsByVersion.size > 0 && (
            <div className="space-y-3 flex-1 min-h-0">
              <h3 className="font-semibold text-sm flex-shrink-0">
                Predictions (
                {Array.from(predictionsByVersion.values()).flat().length})
              </h3>
              <div className="space-y-2 overflow-y-auto pr-2">
                {Array.from(predictionsByVersion.entries())
                  .sort((a, b) => b[0] - a[0])
                  .map(([version, predictions]) => (
                    <Card key={version} className="flex-shrink-0">
                      <CardHeader className="flex justify-between items-center py-2 px-4">
                        <span className="text-sm font-medium">v{version}</span>
                        <Badge size="sm" color="primary">
                          {predictions.length}
                        </Badge>
                      </CardHeader>
                      <Divider />
                      <CardBody className="gap-2 py-2 px-4">
                        {predictions.map((pred) => (
                          <div
                            key={pred.id}
                            className="flex items-center justify-between p-2 bg-default-100 rounded gap-2"
                          >
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <span className="text-xs font-medium truncate">
                                {pred.predicted_label.class_label}
                              </span>
                              <span className="text-xs text-default-400">
                                #{pred.predicted_label.class_index}
                              </span>
                            </div>
                            {pred.confidence !== null && (
                              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                                <span className="text-xs font-semibold whitespace-nowrap">
                                  {(pred.confidence * 100).toFixed(0)}%
                                </span>
                                <div className="w-16 h-1.5 bg-default-300 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-success transition-all"
                                    style={{
                                      width: `${Math.min(pred.confidence * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {predictionsByVersion.size === 0 && (
            <Card className="flex-shrink-0">
              <CardBody className="text-center text-default-500 py-4 text-sm">
                No predictions available
              </CardBody>
            </Card>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
