import { DB } from "generated/kysely/types";
import { Insertable, Selectable } from "kysely";

export type User = Selectable<DB["user"]>;
export type NewUser = Insertable<DB["user"]>;
export type UpdateUser = Insertable<DB["user"]>;

export type Workspace = Selectable<DB["workspace"]>;
export type NewWorkspace = Insertable<DB["workspace"]>;
export type UpdateWorkspace = Insertable<DB["workspace"]>;

export type Chatbot = Selectable<DB["chatBot"]>;
export type NewChatbot = Insertable<DB["chatBot"]>;
export type UpdateChatbot = Insertable<DB["chatBot"]>;

export type ChatSession = Selectable<DB["chatSession"]>;
export type NewChatSession = Insertable<DB["chatSession"]>;
export type UpdateChatSession = Insertable<DB["chatSession"]>;

export type ChatMessage = Selectable<DB["chatMessage"]>;
export type NewChatMessage = Insertable<DB["chatMessage"]>;
export type UpdateChatMessage = Insertable<DB["chatMessage"]>;

export type KnowledgeBase = Selectable<DB["knowledgeBase"]>;
export type NewKnowledgeBase = Insertable<DB["knowledgeBase"]>;
export type UpdateKnowledgeBase = Insertable<DB["knowledgeBase"]>;

export type KnowledgeDocument = Selectable<DB["knowledgeDocument"]>;
export type NewKnowledgeDocument = Insertable<DB["knowledgeDocument"]>;
export type UpdateKnowledgeDocument = Insertable<DB["knowledgeDocument"]>;
