import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { useDataset } from "@/lib/hooks";

interface BulkUploadModalProps {
  datasetId: number;
}

export default function BulkUploadModal({ datasetId }: BulkUploadModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { addDatapoints } = useDataset(datasetId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (onClose: () => void) => {
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      await addDatapoints(files);
      setFiles([]);
      onClose();
    } catch (error) {
      console.error("Failed to upload datapoints:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button color="success" onPress={onOpen} variant="flat">
        Bulk Upload Datapoints
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                Bulk Upload Datapoints
              </ModalHeader>
              <ModalBody>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <p className="text-slate-300 font-medium">
                      Click to select files
                    </p>
                    <p className="text-slate-500 text-sm">or drag and drop</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-300 mb-2">
                      Selected Files ({files.length}):
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-700 p-2 rounded text-sm"
                        >
                          <span className="text-slate-300 truncate">
                            {file.name}
                          </span>
                          <span className="text-slate-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={() => handleUpload(onClose)}
                  isLoading={isUploading}
                  isDisabled={files.length === 0}
                >
                  Upload {files.length > 0 ? `(${files.length})` : ""}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
