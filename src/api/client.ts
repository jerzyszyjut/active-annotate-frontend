const API_BASE = 'http://localhost:8000/api'; // Adjust as needed

export interface AuthToken {
  username: string;
  password: string;
  token?: string;
}

export interface ClassificationDataset {
  id: number;
  name: string;
}

export interface ClassificationDatapoint {
  id: number;
  file: string;
  label: number | null;
  dataset: number;
}

export interface ClassificationLabel {
  id: number;
  class_index: number;
  class_label: string;
  dataset: number;
}

export interface ClassificationPrediction {
  id: number;
  confidence: number | null;
  datapoint: number;
  predicted_label: number | null;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>('/auth-token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(response.token);
    return response;
  }

  // Datasets
  async getDatasets(): Promise<ClassificationDataset[]> {
    return this.request<ClassificationDataset[]>('/data/datasets/classification/');
  }

  async createDataset(name: string): Promise<ClassificationDataset> {
    return this.request<ClassificationDataset>('/data/datasets/classification/', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateDataset(id: number, name: string): Promise<ClassificationDataset> {
    return this.request<ClassificationDataset>(`/data/datasets/classification/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteDataset(id: number): Promise<void> {
    return this.request<void>(`/data/datasets/classification/${id}/`, {
      method: 'DELETE',
    });
  }

  // Datapoints
  async getDatapoints(datasetId?: number): Promise<ClassificationDatapoint[]> {
    const params = datasetId ? `?dataset=${datasetId}` : '';
    return this.request<ClassificationDatapoint[]>(`/data/datapoints/classification/${params}`);
  }

  async createDatapoint(file: string, dataset: number, label?: number): Promise<ClassificationDatapoint> {
    return this.request<ClassificationDatapoint>('/data/datapoints/classification/', {
      method: 'POST',
      body: JSON.stringify({ file, dataset, label }),
    });
  }

  async updateDatapoint(id: number, file?: string, label?: number | null, dataset?: number): Promise<ClassificationDatapoint> {
    const body: any = {};
    if (file !== undefined) body.file = file;
    if (label !== undefined) body.label = label;
    if (dataset !== undefined) body.dataset = dataset;
    return this.request<ClassificationDatapoint>(`/data/datapoints/classification/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async deleteDatapoint(id: number): Promise<void> {
    return this.request<void>(`/data/datapoints/classification/${id}/`, {
      method: 'DELETE',
    });
  }

  // Labels
  async getLabels(datasetId?: number): Promise<ClassificationLabel[]> {
    const params = datasetId ? `?dataset=${datasetId}` : '';
    return this.request<ClassificationLabel[]>(`/data/labels/classification/${params}`);
  }

  async createLabel(class_index: number, class_label: string, dataset: number): Promise<ClassificationLabel> {
    return this.request<ClassificationLabel>('/data/labels/classification/', {
      method: 'POST',
      body: JSON.stringify({ class_index, class_label, dataset }),
    });
  }

  async updateLabel(id: number, class_index?: number, class_label?: string): Promise<ClassificationLabel> {
    const body: any = {};
    if (class_index !== undefined) body.class_index = class_index;
    if (class_label !== undefined) body.class_label = class_label;
    return this.request<ClassificationLabel>(`/data/labels/classification/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async deleteLabel(id: number): Promise<void> {
    return this.request<void>(`/data/labels/classification/${id}/`, {
      method: 'DELETE',
    });
  }

  // Predictions
  async getPredictions(datapointId?: number): Promise<ClassificationPrediction[]> {
    const params = datapointId ? `?datapoint=${datapointId}` : '';
    return this.request<ClassificationPrediction[]>(`/data/predictions/classification/${params}`);
  }

  async createPrediction(datapoint: number, predicted_label?: number, confidence?: number): Promise<ClassificationPrediction> {
    return this.request<ClassificationPrediction>('/data/predictions/classification/', {
      method: 'POST',
      body: JSON.stringify({ datapoint, predicted_label, confidence }),
    });
  }

  async updatePrediction(id: number, predicted_label?: number | null, confidence?: number | null): Promise<ClassificationPrediction> {
    const body: any = {};
    if (predicted_label !== undefined) body.predicted_label = predicted_label;
    if (confidence !== undefined) body.confidence = confidence;
    return this.request<ClassificationPrediction>(`/data/predictions/classification/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async deletePrediction(id: number): Promise<void> {
    return this.request<void>(`/data/predictions/classification/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();