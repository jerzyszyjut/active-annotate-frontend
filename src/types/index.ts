import { NumberInputSlots } from "@heroui/theme";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ClassificationLabel {
  id: number;
  class_index: number;
  class_label: string;
  dataset: number;
}

export interface ClassificationPrediction {
  id: number;
  predicted_label: ClassificationLabel;
  confidence: number | null;
  model_version: number;
  datapoint: number;
}

export interface ClassificationDatapoint {
  id: number;
  file_url: string;
  predictions: ClassificationPrediction[];
  label: ClassificationLabel | null;
  dataset: number;
}

export interface ClassificationDataset {
  id: number;
  name: string;
  label_studio_url: string;
  label_studio_api_key: string;
  ml_backend_url: string;
  batch_size: number;
  uncertainty_strategy: string;
  epoch: number;
  max_epochs: number;
  state: string;
  datapoints: ClassificationDatapoint[];
  labels: ClassificationLabel[];
}

export interface ApiError {
  message: string;
  status: number;
}
