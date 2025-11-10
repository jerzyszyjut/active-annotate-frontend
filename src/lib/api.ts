import {
  ClassificationDataset,
  ClassificationDatapoint,
  ClassificationLabel,
  ClassificationPrediction,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Datasets
export const datasetsAPI = {
  list: () =>
    fetchAPI<ClassificationDataset[]>(
      "/api/data/datasets/classification/",
    ),
  get: (id: number) =>
    fetchAPI<ClassificationDataset>(
      `/api/data/datasets/classification/${id}/`,
    ),
  create: (data: { name: string }) =>
    fetchAPI<ClassificationDataset>(
      "/api/data/datasets/classification/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  update: (id: number, data: Partial<ClassificationDataset>) =>
    fetchAPI<ClassificationDataset>(
      `/api/data/datasets/classification/${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/api/data/datasets/classification/${id}/`, {
      method: "DELETE",
    }),
};

// Datapoints
export const datapointsAPI = {
  list: () =>
    fetchAPI<ClassificationDatapoint[]>(
      "/api/data/datapoints/classification/",
    ),
  get: (id: number) =>
    fetchAPI<ClassificationDatapoint>(
      `/api/data/datapoints/classification/${id}/`,
    ),
  create: (data: FormData | { dataset: number; file?: string; label?: number }) => {
    const url = `${API_BASE_URL}/api/data/datapoints/classification/`;
    return fetch(url, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: !(data instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {},
    }).then((res) => res.json());
  },
  update: (id: number, data: Partial<ClassificationDatapoint>) =>
    fetchAPI<ClassificationDatapoint>(
      `/api/data/datapoints/classification/${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  patch: (id: number, data: any) => {
    const url = `${API_BASE_URL}/api/data/datapoints/classification/${id}/`;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return fetch(url, {
      method: "PATCH",
      body: formData,
    }).then((res) => res.json());
  },
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/api/data/datapoints/classification/${id}/`, {
      method: "DELETE",
    }),
  setLabel: (id: number, classIndex: number) => {
    const url = `${API_BASE_URL}/api/data/datapoints/classification/${id}/`;
    const formData = new FormData();
    formData.append("class_index", String(classIndex));
    return fetch(url, {
      method: "PATCH",
      body: formData,
    }).then((res) => res.json());
  },
};

// Labels
export const labelsAPI = {
  list: () =>
    fetchAPI<ClassificationLabel[]>(
      "/api/data/labels/classification/",
    ),
  get: (id: number) =>
    fetchAPI<ClassificationLabel>(
      `/api/data/labels/classification/${id}/`,
    ),
  create: (data: { class_index: number; class_label: string; dataset: number }) =>
    fetchAPI<ClassificationLabel>(
      "/api/data/labels/classification/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  update: (id: number, data: Partial<ClassificationLabel>) =>
    fetchAPI<ClassificationLabel>(
      `/api/data/labels/classification/${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/api/data/labels/classification/${id}/`, {
      method: "DELETE",
    }),
};

// Predictions
export const predictionsAPI = {
  list: () =>
    fetchAPI<ClassificationPrediction[]>(
      "/api/data/predictions/classification/",
    ),
  get: (id: number) =>
    fetchAPI<ClassificationPrediction>(
      `/api/data/predictions/classification/${id}/`,
    ),
  create: (data: { datapoint: number; predicted_class_index: number; confidence?: number }) => {
    const url = `${API_BASE_URL}/api/data/predictions/classification/`;
    const formData = new FormData();
    formData.append("datapoint", String(data.datapoint));
    formData.append("predicted_class_index", String(data.predicted_class_index));
    if (data.confidence !== undefined) {
      formData.append("confidence", String(data.confidence));
    }
    return fetch(url, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
  },
  update: (id: number, data: Partial<ClassificationPrediction>) =>
    fetchAPI<ClassificationPrediction>(
      `/api/data/predictions/classification/${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/api/data/predictions/classification/${id}/`, {
      method: "DELETE",
    }),
};

// Integrations
export const integrationsAPI = {
  startActiveLearning: (datasetId: number) =>
    fetchAPI<{ status: string }>(
      `/api/integrations/label-studio/start-active-learning/`,
      {
        method: "POST",
        body: JSON.stringify({ dataset_id: datasetId }),
      },
    ),
};
