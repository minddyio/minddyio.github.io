import { useState, useEffect, useRef } from "react";
import { api, type FullProfile, type PreviewChat, type PreviewMessage } from "./api";

interface ChatPreviewProps {
  profile: FullProfile;
}

export function ChatPreview({ profile }: ChatPreviewProps) {
  const [chats, setChats] = useState<PreviewChat[]>([]);
  const [activeChat, setActiveChat] = useState<PreviewChat | null>(null);
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
    }
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const data = await api.getPreviewChats();
      setChats(data || []);
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await api.getPreviewMessages(chatId);
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const createChat = async () => {
    try {
      const title = `Тест ${new Date().toLocaleString("ru")}`;
      const chat = await api.createPreviewChat(title);
      setChats([chat, ...chats]);
      setActiveChat(chat);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create chat:", err);
      alert("Ошибка создания чата");
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!confirm("Удалить этот чат?")) return;

    try {
      await api.deletePreviewChat(chatId);
      setChats(chats.filter((c) => c.id !== chatId));
      if (activeChat?.id === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      alert("Ошибка удаления чата");
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeChat || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    // Add user message optimistically
    const tempUserMessage: PreviewMessage = {
      id: `temp-${Date.now()}`,
      chat_id: activeChat.id,
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const { response } = await api.sendPreviewMessage(activeChat.id, userMessage);

      // Add assistant response
      const assistantMessage: PreviewMessage = {
        id: `temp-${Date.now()}-assistant`,
        chat_id: activeChat.id,
        role: "assistant",
        content: response,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Ошибка отправки сообщения");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-6 h-[600px]">
      {/* Chat List */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border h-full flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={createChat}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
            >
              + Новый тест
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm">Загрузка...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Нет тестовых чатов.<br />Создайте первый!
              </div>
            ) : (
              <div className="divide-y">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeChat?.id === chat.id ? "bg-purple-50" : ""
                    }`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {chat.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(chat.updated_at).toLocaleDateString("ru")}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border flex flex-col">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">Выберите чат или создайте новый</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900">{activeChat.title}</h3>
              <p className="text-xs text-gray-500">Тестирование AI-двойника</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  Начните диалог с вашим AI-двойником
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.role === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите сообщение..."
                  disabled={isSending}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isSending}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
