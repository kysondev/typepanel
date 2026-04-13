import { User } from "db/models.types";
import { ChatInterface } from "features/core/chat/components/chat-interface";
import { getUser } from "features/core/user/user.service";

export default async function ChatPage() {
  const { data: user } = await getUser();
  return <ChatInterface user={user as User} />;
}
