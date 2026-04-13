"server only";

import { sql } from "node_modules/kysely/dist/esm/raw-builder/sql";
import { chunkText } from "./chunk-text";
import { getEmbedding } from "./get-embedding";
import { ProviderConfig } from "./provider-config.type";
import { db } from "@common/lib/db";

export const ingestDocument = async (
  kbId: string,
  filename: string,
  content: string,
  config: ProviderConfig,
) => {
  const chunks = chunkText(content);

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk, config);
    const id = crypto.randomUUID();

    await sql`
      INSERT INTO "knowledgeDocument" (id, "kbId", filename, content, embedding, "createdAt")
      VALUES (
        ${id}, 
        ${kbId}, 
        ${filename}, 
        ${chunk}, 
        ${JSON.stringify(embedding)}::vector, 
        NOW()
      )
    `.execute(db);
  }
};
