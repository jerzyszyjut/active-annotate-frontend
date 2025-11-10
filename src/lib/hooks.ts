import { useEffect, useState } from "react";
import {
  ClassificationDataset,
  ClassificationDatapoint,
  ClassificationLabel,
  ClassificationPrediction,
} from "@/types";
import {
  datasetsAPI,
  datapointsAPI,
  labelsAPI,
  predictionsAPI,
} from "@/lib/api";

export function useDatasets() {
  const [datasets, setDatasets] = useState<ClassificationDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await datasetsAPI.list();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch datasets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const createDataset = async (data: {
    name: string;
    label_studio_url?: string;
    label_studio_api_key?: string;
    ml_backend_url?: string;
    batch_size?: number;
  }) => {
    try {
      const newDataset = await datasetsAPI.create(data as any);
      setDatasets([...datasets, newDataset]);
      return newDataset;
    } catch (err) {
      throw err;
    }
  };

  const deleteDataset = async (id: number) => {
    try {
      await datasetsAPI.delete(id);
      setDatasets(datasets.filter((d) => d.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    datasets,
    loading,
    error,
    refetch: fetchDatasets,
    createDataset,
    deleteDataset,
  };
}

export function useDataset(datasetId: number) {
  const [dataset, setDataset] = useState<ClassificationDataset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataset = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await datasetsAPI.get(datasetId);
      setDataset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dataset");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId) {
      fetchDataset();
    }
  }, [datasetId]);

  const updateDatapoint = async (datapointId: number, label: ClassificationLabel) => {
    if (!dataset) return;
    try {
      const updated = await datapointsAPI.setLabel(datapointId, label.class_index);
      const newDatapoints = (dataset.datapoints || []).map((d) =>
        d.id === datapointId ? { ...d, label } : d,
      );
      setDataset({ ...dataset, datapoints: newDatapoints });
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const addDatapoints = async (files: File[], labelId?: number) => {
    if (!dataset) return [];
    try {
      const createdDatapoints: ClassificationDatapoint[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("dataset", dataset.id.toString());
        if (labelId) {
          formData.append("label", labelId.toString());
        }
        const datapoint = await datapointsAPI.create(formData);
        createdDatapoints.push(datapoint);
      }
      const newDatapoints = [
        ...(dataset.datapoints || []),
        ...createdDatapoints,
      ];
      setDataset({ ...dataset, datapoints: newDatapoints });
      return createdDatapoints;
    } catch (err) {
      throw err;
    }
  };

  const deleteDatapoint = async (datapointId: number) => {
    if (!dataset) return;
    try {
      await datapointsAPI.delete(datapointId);
      const newDatapoints = (dataset.datapoints || []).filter((d) => d.id !== datapointId);
      setDataset({ ...dataset, datapoints: newDatapoints });
    } catch (err) {
      throw err;
    }
  };

  const addLabel = async (classIndex: number, classLabel: string) => {
    if (!dataset) return;
    try {
      const newLabel = await labelsAPI.create({
        class_index: classIndex,
        class_label: classLabel,
        dataset: dataset.id,
      });
      const newLabels = [...(dataset.labels || []), newLabel];
      setDataset({ ...dataset, labels: newLabels });
      return newLabel;
    } catch (err) {
      throw err;
    }
  };

  const deleteLabel = async (labelId: number) => {
    if (!dataset) return;
    try {
      await labelsAPI.delete(labelId);
      const newLabels = (dataset.labels || []).filter((l) => l.id !== labelId);
      setDataset({ ...dataset, labels: newLabels });
    } catch (err) {
      throw err;
    }
  };

  const updateLabel = async (labelId: number, classLabel: string) => {
    if (!dataset) return;
    try {
      const updated = await labelsAPI.update(labelId, {
        class_label: classLabel,
      } as any);
      const newLabels = (dataset.labels || []).map((l) =>
        l.id === labelId ? { ...l, class_label: classLabel } : l,
      );
      setDataset({ ...dataset, labels: newLabels });
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const addPrediction = async (
    datapointId: number,
    labelId: number,
    confidence?: number,
  ) => {
    if (!dataset) return;
    try {
      // Get the label to extract the class_index
      const label = (dataset.labels || []).find((l) => l.id === labelId);
      if (!label) throw new Error("Label not found");

      const prediction = await predictionsAPI.create({
        datapoint: datapointId,
        predicted_class_index: label.class_index, // Send class_index
        confidence,
      });
      // Update the datapoint in the dataset with the new prediction
      const newDatapoints = (dataset.datapoints || []).map((d) => {
        if (d.id === datapointId) {
          return {
            ...d,
            predictions: [...(d.predictions || []), prediction],
          };
        }
        return d;
      });
      setDataset({ ...dataset, datapoints: newDatapoints });
      return prediction;
    } catch (err) {
      throw err;
    }
  };

  const deletePrediction = async (
    datapointId: number,
    predictionId: number,
  ) => {
    if (!dataset) return;
    try {
      await predictionsAPI.delete(predictionId);
      // Update the datapoint in the dataset by removing the prediction
      const newDatapoints = (dataset.datapoints || []).map((d) => {
        if (d.id === datapointId) {
          return {
            ...d,
            predictions: (d.predictions || []).filter(
              (p) => p.id !== predictionId,
            ),
          };
        }
        return d;
      });
      setDataset({ ...dataset, datapoints: newDatapoints });
    } catch (err) {
      throw err;
    }
  };

  return {
    dataset,
    loading,
    error,
    refetch: fetchDataset,
    updateDatapoint,
    addDatapoints,
    deleteDatapoint,
    addLabel,
    deleteLabel,
    updateLabel,
    addPrediction,
    deletePrediction,
  };
}

export function useDatapoint(datapointId: number) {
  const [datapoint, setDatapoint] = useState<ClassificationDatapoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatapoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await datapointsAPI.get(datapointId);
      setDatapoint(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch datapoint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datapointId) {
      fetchDatapoint();
    }
  }, [datapointId]);

  const updateLabel = async (label: ClassificationLabel) => {
    try {
      const updated = await datapointsAPI.patch(datapointId, {
        label: label.id,
      } as any);
      setDatapoint({ ...datapoint, label } as any);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const addPrediction = async (
    labelId: number,
    confidence?: number,
    labels?: ClassificationLabel[],
  ) => {
    try {
      // Find the label to get its class_index
      const label = (labels || []).find((l) => l.id === labelId);
      const classIndex = label?.class_index ?? labelId; // Fallback to labelId if no label found

      const prediction = await predictionsAPI.create({
        datapoint: datapointId,
        predicted_class_index: classIndex, // Send class_index
        confidence,
      });
      if (datapoint) {
        setDatapoint({
          ...datapoint,
          predictions: [...datapoint.predictions, prediction],
        });
      }
      return prediction;
    } catch (err) {
      throw err;
    }
  };

  const deletePrediction = async (predictionId: number) => {
    try {
      await predictionsAPI.delete(predictionId);
      if (datapoint) {
        setDatapoint({
          ...datapoint,
          predictions: datapoint.predictions.filter(
            (p) => p.id !== predictionId,
          ),
        });
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    datapoint,
    loading,
    error,
    refetch: fetchDatapoint,
    updateLabel,
    addPrediction,
    deletePrediction,
  };
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<ClassificationPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictionsAPI.list();
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return {
    predictions,
    loading,
    error,
    refetch: fetchPredictions,
  };
}

export function useLabels() {
  const [labels, setLabels] = useState<ClassificationLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLabels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await labelsAPI.list();
      setLabels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch labels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  return {
    labels,
    loading,
    error,
    refetch: fetchLabels,
  };
}
