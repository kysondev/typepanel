"use server";

import * as knowledgeService from "features/core/knowledge/services/knowledge.service";
import * as modelService from "features/core/model/services/model.service";

export const getKnowledgeBases = async () => {
  try {
    const kbs = await knowledgeService.getKnowledgeBases();
    return { success: true, data: kbs };
  } catch (error) {
    console.error("Failed to fetch knowledge bases:", error);
    return { success: false, message: "Failed to fetch knowledge bases" };
  }
};

export const createKnowledgeBase = async (data: {
  name: string;
  description?: string;
  chatbotId: string;
}) => {
  try {
    const kb = await knowledgeService.createKnowledgeBase(data);
    return {
      success: true,
      message: "Collection created successfully",
      data: kb,
    };
  } catch (error) {
    console.error("Failed to create knowledge base:", error);
    return { success: false, message: "Failed to create collection" };
  }
};

export const deleteKnowledgeBase = async (id: string) => {
  try {
    await knowledgeService.deleteKnowledgeBase(id);
    return { success: true, message: "Collection deleted successfully" };
  } catch (error) {
    console.error("Failed to delete knowledge base:", error);
    return { success: false, message: "Failed to delete collection" };
  }
};

export const updateKnowledgeBase = async (
  id: string,
  data: { name: string; description?: string },
) => {
  try {
    await knowledgeService.updateKnowledgeBase(id, data);
    return { success: true, message: "Collection updated successfully" };
  } catch (error) {
    console.error("Failed to update knowledge base:", error);
    return { success: false, message: "Failed to update collection" };
  }
};

export const getKnowledgeBaseById = async (id: string) => {
  try {
    const kb = await knowledgeService.getKnowledgeBaseById(id);
    return { success: true, data: kb };
  } catch (error) {
    console.error("Failed to fetch knowledge base:", error);
    return { success: false, message: "Failed to fetch knowledge base" };
  }
};

export const addTextToKnowledgeBase = async (
  kbId: string,
  title: string,
  content: string,
) => {
  try {
    const kb = await knowledgeService.getKnowledgeBaseById(kbId);

    if (!kb?.chatbotId) {
      return {
        success: false,
        message:
          "This collection is not linked to an AI model. Please recreate it or contact support.",
      };
    }

    const model = await modelService.getModelById(kb.chatbotId);

    if (!model || !model.apiKeyEnc) {
      return {
        success: false,
        message: "The associated AI model or its API key was not found.",
      };
    }

    const rawProvider = model.provider.toLowerCase();
    let provider: "openai" | "google";

    if (rawProvider === "gpt" || rawProvider === "openai") {
      provider = "openai";
    } else if (rawProvider === "gemini" || rawProvider === "google") {
      provider = "google";
    } else {
      return {
        success: false,
        message: `Unsupported AI provider: ${model.provider}`,
      };
    }

    await knowledgeService.ingestDocument(kbId, title, content, {
      name: provider,
      apiKey: model.apiKeyEnc,
    });

    return { success: true, message: "Knowledge added successfully" };
  } catch (error) {
    console.error("Failed to add text to knowledge base:", error);
    return { success: false, message: "Failed to add knowledge content" };
  }
};

export const deleteKnowledgeDocument = async (id: string) => {
  try {
    const doc = await knowledgeService.getKnowledgeDocumentById(id);

    if (!doc) {
      return { success: false, message: "Document not found" };
    }

    await knowledgeService.deleteKnowledgeDocumentsByFile(doc.kbId, doc.filename);

    return { success: true, message: "Document deleted successfully" };
  } catch (error) {
    console.error("Failed to delete knowledge document:", error);
    return { success: false, message: "Failed to delete document" };
  }
};

export const getKnowledgeDocuments = async (kbId: string) => {
  try {
    const allChunks = await knowledgeService.getKnowledgeDocuments(kbId);

    const uniqueFiles = [];

    for (let i = 0; i < allChunks.length; i++) {
      const chunk = allChunks[i];
      let alreadyExists = false;

      for (let j = 0; j < uniqueFiles.length; j++) {
        if (uniqueFiles[j].filename === chunk.filename) {
          alreadyExists = true;
          break;
        }
      }
      if (alreadyExists === false) {
        uniqueFiles.push(chunk);
      }
    }

    return { success: true, data: uniqueFiles };
  } catch (error) {
    console.error("Failed to fetch knowledge documents:", error);
    return { success: false, message: "Failed to fetch documents" };
  }
};
