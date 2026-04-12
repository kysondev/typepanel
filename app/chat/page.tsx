import { getUser } from "@auth/services/user.service";
import { User } from "db/models.types";
import { ChatInterface } from "features/core/chat/components/chat-interface";

export default async function ChatPage() {
  const { data: user } = await getUser();
  return <ChatInterface user={user as User} />;
}
