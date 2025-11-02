import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  username: string;
  name: string;
  url: string;
}

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
  datapoint: number;
}

export interface ClassificationDatapoint {
  id: number;
  file_url: string;
  predictions: ClassificationPrediction[];
  label: ClassificationLabel;
  file?: string; // For upload
  dataset: number;
}

export interface ClassificationDataset {
  id: number;
  datapoints?: ClassificationDatapoint[];
  labels?: ClassificationLabel[];
  name: string;
}

export interface AuthToken {
  username: string;
  password: string;
  token: string;
}
