import ky, { HTTPError } from "ky";
import type {
  ClassificationDataset,
  ClassificationDatapoint,
  ClassificationLabel,
  ClassificationPrediction,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = ky.create({
  prefixUrl: `${API_BASE_URL}/api`,
  retry: 1,
  timeout: 30000,
});

// Datasets
export const datasetsApi = {
  list: () =>
    api.get("data/datasets/classification/").json<ClassificationDataset[]>(),
  get: (id: number) =>
    api
      .get(`data/datasets/classification/${id}/`)
      .json<ClassificationDataset>(),
  create: (data: {
    name: string;
    label_studio_url: string;
    label_studio_api_key: string;
    ml_backend_url: string;
    batch_size: number;
  }) =>
    api
      .post("data/datasets/classification/", { json: data })
      .json<ClassificationDataset>(),
  update: (id: number, data: Partial<ClassificationDataset>) =>
    api
      .put(`data/datasets/classification/${id}/`, { json: data })
      .json<ClassificationDataset>(),
  patch: (id: number, data: Partial<ClassificationDataset>) =>
    api
      .patch(`data/datasets/classification/${id}/`, { json: data })
      .json<ClassificationDataset>(),
};

// Datapoints
export const datapointsApi = {
  list: () =>
    api
      .get("data/datapoints/classification/")
      .json<ClassificationDatapoint[]>(),
  get: (id: number) =>
    api
      .get(`data/datapoints/classification/${id}/`)
      .json<ClassificationDatapoint>(),
  create: (data: FormData) =>
    api
      .post("data/datapoints/classification/", { body: data })
      .json<ClassificationDatapoint>(),
  update: (id: number, data: Partial<ClassificationDatapoint>) =>
    api
      .put(`data/datapoints/classification/${id}/`, { json: data })
      .json<ClassificationDatapoint>(),
  patch: (id: number, data: Partial<ClassificationDatapoint>) =>
    api
      .patch(`data/datapoints/classification/${id}/`, { json: data })
      .json<ClassificationDatapoint>(),
};

// Labels
export const labelsApi = {
  list: () =>
    api
      .get("data/labels/classification/")
      .json<ClassificationLabel[]>()
      .catch(() => api.get("data/classification-labels/").json<ClassificationLabel[]>()),
  get: (id: number) =>
    api
      .get(`data/labels/classification/${id}/`)
      .json<ClassificationLabel>(),
  create: (data: {
    dataset: number;
    class_index: number;
    class_label: string;
  }) =>
    api
      .post("data/labels/classification/", { json: data })
      .json<ClassificationLabel>(),
};

// Predictions
export const predictionsApi = {
  list: () =>
    api
      .get("data/predictions/classification/")
      .json<ClassificationPrediction[]>()
      .catch(() => api.get("data/classification-predictions/").json<ClassificationPrediction[]>()),
  get: (id: number) =>
    api
      .get(`data/predictions/classification/${id}/`)
      .json<ClassificationPrediction>(),
  create: (data: {
    datapoint: number;
    predicted_label: number;
    confidence: number | null;
    model_version: number;
  }) =>
    api
      .post("data/predictions/classification/", { json: data })
      .json<ClassificationPrediction>(),
};

// Active Learning
export const activeLearningApi = {
  startActivelearning: (datasetId: number) =>
    api
      .post(`integrations/label-studio/start-active-learning/`, {
        json: { dataset_id: datasetId },
      })
      .json<{ status: string; message: string }>(),
};

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (error instanceof HTTPError) {
    return `API Error: ${error.response.status} ${error.response.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};
