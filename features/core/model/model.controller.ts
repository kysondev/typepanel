"use server";

import {
  createModel,
  deleteModel,
  getModels,
  updateModel,
} from "./model.service";

export const getModelsHandler = async () => {
  try {
    const models = await getModels();
    return { success: true, data: JSON.parse(JSON.stringify(models)) };
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return { success: false, message: "Failed to fetch models" };
  }
};

export const createModelHandler = async (data: {
  name: string;
  model: string;
  provider: string;
  apiKeyEnc: string;
}) => {
  try {
    await createModel(data);
    return { success: true, message: "Model created successfully" };
  } catch (error) {
    console.error("Failed to create model:", error);
    return { success: false, message: "Failed to create model" };
  }
};

export const deleteModelHandler = async (id: string) => {
  try {
    await deleteModel(id);
    return { success: true, message: "Model deleted successfully" };
  } catch (error) {
    console.error("Failed to delete model:", error);
    return { success: false, message: "Failed to delete model" };
  }
};

export const updateModelHandler = async (
  id: string,
  data: {
    name: string;
    systemPrompt?: string;
    tone?: string;
    temperature?: number;
    contextLength?: number;
  },
) => {
  try {
    await updateModel(id, data);
    return { success: true, message: "Model updated successfully" };
  } catch (error) {
    console.error("Failed to update model:", error);
    return { success: false, message: "Failed to update model" };
  }
};
