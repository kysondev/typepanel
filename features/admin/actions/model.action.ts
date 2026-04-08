"use server";

import * as modelService from "features/core/model/services/model.service";

export const getModels = async () => {
  try {
    const models = await modelService.getModels();
    return { success: true, data: models };
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return { success: false, message: "Failed to fetch models" };
  }
};

export const createModel = async (data: {
  name: string;
  model: string;
  provider: string;
  apiKeyEnc: string;
}) => {
  try {
    await modelService.createModel(data);
    return { success: true, message: "Model created successfully" };
  } catch (error) {
    console.error("Failed to create model:", error);
    return { success: false, message: "Failed to create model" };
  }
};

export const deleteModel = async (id: string) => {
  try {
    await modelService.deleteModel(id);
    return { success: true, message: "Model deleted successfully" };
  } catch (error) {
    console.error("Failed to delete model:", error);
    return { success: false, message: "Failed to delete model" };
  }
};

export const updateModel = async (
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
    await modelService.updateModel(id, data);
    return { success: true, message: "Model updated successfully" };
  } catch (error) {
    console.error("Failed to update model:", error);
    return { success: false, message: "Failed to update model" };
  }
};
