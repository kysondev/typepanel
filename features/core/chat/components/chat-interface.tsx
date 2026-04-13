"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  UserIcon,
} from "lucide-react";
import { Button } from "features/common/components/ui/button";
import { getModelsHandler } from "features/core/model/model.controller";
import {
  createChatSessionHandler,
  deleteChatSessionHandler,
  getChatMessagesHandler,
  getChatSessionsHandler,
} from "features/core/chat/chat.controller";
import { testModel } from "features/core/admin/playground.controller";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { User } from "db/models.types";

export function ChatInterface({ user }: { user: User }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [models, setModels] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [chosenModelId, setChosenModelId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadInitialData() {
      const [modelsResult, chatsResult] = await Promise.all([
        getModelsHandler(),
        getChatSessionsHandler(user.id),
      ]);

      if (modelsResult.success) {
        const modelList = modelsResult.data || [];
        setModels(modelList);
        if (modelList.length > 0) {
          setChosenModelId(modelList[0].id);
        }
      }

      if (chatsResult.success) {
        setChats(chatsResult.data || []);
      }

      setIsPageLoading(false);
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadMessages(chatId: string) {
    const result = await getChatMessagesHandler(chatId);
    if (result.success) {
      setMessages(result.data || []);
    }
  }

  function startNewChat() {
    setActiveChatId(null);
    setText("");
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim() || !chosenModelId || isSending) return;

    let chatId = activeChatId;
    if (!chatId) {
      const result = await createChatSessionHandler(chosenModelId, user.id);

      if (result.success && result.data) {
        chatId = result.data.id;
        setActiveChatId(chatId);
        setChats([result.data, ...chats]);
      } else {
        toast.error("Failed to start chat");
        return;
      }
    }

    setText("");

    const newMessages = [...messages, { role: "user", content: text.trim() }];
    setMessages(newMessages);

    setIsSending(true);
    const result = await testModel(
      chosenModelId,
      text.trim(),
      messages,
      chatId!,
    );
    setIsSending(false);

    if (result.success) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: result.data },
      ]);
    } else {
      toast.error(result.message);
    }
  }

  async function deleteChat(e: React.MouseEvent, chatId: string) {
    e.stopPropagation();
    const result = await deleteChatSessionHandler(chatId, user.id);
    if (result.success) {
      setChats(chats.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
      toast.success("Chat deleted");
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-neutral-900 overflow-hidden font-sans">
      <div
        className={`${
          showSidebar ? "w-64" : "w-0"
        } bg-neutral-50 border-r border-neutral-200 transition-all duration-300 flex flex-col overflow-hidden relative`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-neutral-100 bg-white/50 shrink-0">
          <div className="h-8 w-8 bg-neutral-900 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Image src="/logo.png" alt="Logo" width={24} height={24} />
          </div>
          <span className="font-bold text-sm tracking-tight text-neutral-900">
            TypePanel
          </span>
        </div>

        <div className="p-4 shrink-0">
          <Button
            onClick={startNewChat}
            className="w-full justify-start gap-2 bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 shadow-sm font-bold text-xs py-5"
          >
            <Plus size={16} />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                activeChatId === chat.id
                  ? "bg-neutral-200 text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className="shrink-0" />
                <span className="text-xs font-bold truncate">
                  {chat.chatbotName || "Untitled Chat"}
                </span>
              </div>
              <button
                onClick={(e) => deleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-4 top-4 z-10 p-2 text-neutral-400 hover:text-neutral-900 bg-white border border-neutral-100 rounded-lg shadow-sm transition-all"
        >
          {showSidebar ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>

        <div className="h-16 flex items-center justify-center border-b border-neutral-100 shrink-0">
          {!activeChatId ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-400">Model:</span>
              <select
                className="text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition"
                value={chosenModelId}
                onChange={(e) => setChosenModelId(e.target.value)}
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
              {chats.find((c) => c.id === activeChatId)?.chatbotName ||
                "Chat Session"}
            </h2>
          )}
        </div>

        <div ref={bottomRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
              <div className="p-5 rounded-2xl mb-6">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  className="invert"
                  width={75}
                  height={75}
                />
              </div>
              <h1 className="text-xl font-bold text-neutral-900 mb-2">
                How can I help you today?
              </h1>
              <p className="text-sm text-neutral-400 font-medium">
                Start a conversation with the selected AI model. Your chat
                history will be saved automatically.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-8 px-4 space-y-12">
              {messages.map((msg, i) => (
                <div key={i} className="flex gap-6 group">
                  <div
                    className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      msg.role === "assistant"
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-400 group-hover:border-neutral-300"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="p-1"
                      />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest opacity-40">
                      {msg.role === "assistant" ? "TypePanel AI" : "You"}
                    </p>
                    <div className="text-sm text-neutral-800 leading-relaxed font-medium whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex gap-6 max-w-4xl mx-auto animate-pulse">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0 shadow-sm text-white">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="p-1"
                    />
                  </div>
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-2 bg-neutral-100 rounded-full w-[80%]" />
                    <div className="h-2 bg-neutral-100 rounded-full w-[40%]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 bg-white shrink-0">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={sendMessage}
              className="relative flex items-end gap-3 p-2 bg-neutral-50 border border-neutral-200 rounded-2xl transition-all duration-300"
            >
              <textarea
                rows={1}
                placeholder="Message AI..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isSending || (!activeChatId && models.length === 0)}
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:ring-0 text-sm py-3 px-2 min-h-[44px] max-h-32 resize-none placeholder:text-neutral-400 font-medium text-neutral-900"
              />
              <Button
                type="submit"
                disabled={
                  isSending ||
                  !text.trim() ||
                  (!activeChatId && models.length === 0)
                }
                className={`h-11 w-11 p-0 rounded-xl ${
                  text.trim()
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                {isSending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
