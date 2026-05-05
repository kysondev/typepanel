"use server";

import { getModelById } from "../model/model.service";
import { ingestDocument } from "../rag/rag.service";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  deleteKnowledgeDocumentsByFile,
  getKnowledgeBaseById,
  getKnowledgeBases,
  getKnowledgeDocumentById,
  getKnowledgeDocuments,
  updateKnowledgeBase,
} from "./knowledge.service";

export const getKnowledgeBasesHandler = async () => {
  try {
    const kbs = await getKnowledgeBases();
    return { success: true, data: kbs };
  } catch (error) {
    console.error("Failed to fetch knowledge bases:", error);
    return { success: false, message: "Failed to fetch knowledge bases" };
  }
};

export const createKnowledgeBaseHandler = async (data: {
  name: string;
  description?: string;
  chatbotId: string;
}) => {
  try {
    const kb = await createKnowledgeBase(data);
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

export const deleteKnowledgeBaseHandler = async (id: string) => {
  try {
    await deleteKnowledgeBase(id);
    return { success: true, message: "Collection deleted successfully" };
  } catch (error) {
    console.error("Failed to delete knowledge base:", error);
    return { success: false, message: "Failed to delete collection" };
  }
};

export const updateKnowledgeBaseHandler = async (
  id: string,
  data: { name: string; description?: string },
) => {
  try {
    await updateKnowledgeBase(id, data);
    return { success: true, message: "Collection updated successfully" };
  } catch (error) {
    console.error("Failed to update knowledge base:", error);
    return { success: false, message: "Failed to update collection" };
  }
};

export const getKnowledgeBaseByIdHandler = async (id: string) => {
  try {
    const kb = await getKnowledgeBaseById(id);
    return { success: true, data: kb };
  } catch (error) {
    console.error("Failed to fetch knowledge base:", error);
    return { success: false, message: "Failed to fetch knowledge base" };
  }
};

const getProviderConfig = async (kbId: string) => {
  const kb = await getKnowledgeBaseById(kbId);

  if (!kb?.chatbotId) {
    throw new Error(
      "This collection is not linked to an AI model. Please recreate it or contact support.",
    );
  }

  const model = await getModelById(kb.chatbotId);

  if (!model || !model.apiKeyEnc) {
    throw new Error("The associated AI model or its API key was not found.");
  }

  const rawProvider = model.provider.toLowerCase();
  let provider: "openai" | "google";

  if (rawProvider === "gpt" || rawProvider === "openai") {
    provider = "openai";
  } else if (rawProvider === "gemini" || rawProvider === "google") {
    provider = "google";
  } else {
    throw new Error(`Unsupported AI provider: ${model.provider}`);
  }

  return {
    name: provider,
    apiKey: model.apiKeyEnc,
  };
};

export const addTextToKnowledgeBaseHandler = async (
  kbId: string,
  title: string,
  content: string,
) => {
  try {
    const config = await getProviderConfig(kbId);

    await ingestDocument(kbId, title, content, config);

    return { success: true, message: "Knowledge added successfully" };
  } catch (error: any) {
    console.error("Failed to add text to knowledge base:", error);
    return {
      success: false,
      message: error.message || "Failed to add knowledge content",
    };
  }
};

export const uploadFilesToKnowledgeBaseHandler = async (
  kbId: string,
  formData: FormData,
) => {
  try {
    const config = await getProviderConfig(kbId);
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return { success: false, message: "No files provided" };
    }

    for (const file of files) {
      const content = await file.text();
      await ingestDocument(kbId, file.name, content, config);
    }

    return { success: true, message: `${files.length} files uploaded and processed successfully` };
  } catch (error: any) {
    console.error("Failed to upload files to knowledge base:", error);
    return {
      success: false,
      message: error.message || "Failed to upload and process files",
    };
  }
};

export const deleteKnowledgeDocument = async (id: string) => {
  try {
    const doc = await getKnowledgeDocumentById(id);

    if (!doc) {
      return { success: false, message: "Document not found" };
    }

    await deleteKnowledgeDocumentsByFile(doc.kbId, doc.filename);

    return { success: true, message: "Document deleted successfully" };
  } catch (error) {
    console.error("Failed to delete knowledge document:", error);
    return { success: false, message: "Failed to delete document" };
  }
};

export const getKnowledgeDocumentsHandler = async (kbId: string) => {
  try {
    const allChunks = await getKnowledgeDocuments(kbId);

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
