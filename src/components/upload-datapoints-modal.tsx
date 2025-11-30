import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { datapointsApi, handleApiError } from "@/utils/api";

interface UploadDatapointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetId: number;
  onUploadSuccess: () => void;
}

export function UploadDatapointsModal({
  isOpen,
  onClose,
  datasetId,
  onUploadSuccess,
}: UploadDatapointsModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).filter((file) =>
      file.type.startsWith("image/")
    );

    if (newFiles.length === 0) {
      setError("Please select image files only");
      return;
    }

    setError(null);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let uploaded = 0;

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("dataset", String(datasetId));

        await datapointsApi.create(formData);
        uploaded++;
        setUploadProgress(Math.round((uploaded / files.length) * 100));
      }

      setFiles([]);
      setUploadProgress(0);
      onUploadSuccess();
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Upload Datapoints
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <p className="text-sm text-default-500 mb-2">
              Drag and drop image files here or click to select
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <Button
              color="primary"
              variant="light"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Select Files
            </Button>
          </div>
          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">
                Selected Files ({files.length})
              </h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-default-100 rounded text-sm"
                  >
                    <span className="truncate text-default-700">
                      {file.name}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                      className="text-xs"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading && uploadProgress > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-default-500">Uploading...</span>
                <span className="text-xs font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-default-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpload}
            disabled={loading || files.length === 0}
            isLoading={loading}
          >
            {loading ? "Uploading..." : "Upload Files"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
