const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:8081";

export interface Psychologist {
  id: string;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  created_at: string;
}

export interface PsychologistProfile {
  id: string;
  psychologist_id: string;
  display_name?: string;
  bio?: string;
  education?: string;
  specializations?: string;
  experience?: string;
}

export interface AITwin {
  id: string;
  psychologist_id: string;
  greeting: string;
  system_prompt: string;
  is_published: boolean;
  share_code?: string;
}

export interface InitialQuestion {
  id: string;
  ai_twin_id: string;
  question: string;
  order_index: number;
}

export interface FullProfile {
  psychologist: Psychologist | null;
  profile: PsychologistProfile | null;
  ai_twin: AITwin | null;
  questions: InitialQuestion[] | null;
}

export interface PreviewChat {
  id: string;
  psychologist_id: string;
  ai_twin_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface PreviewMessage {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

class ApiClient {
  private token: string | null = null;
  private telegramId: string | null = null;

  setAuth(token: string, telegramId: string) {
    this.token = token;
    this.telegramId = telegramId;
  }

  clearAuth() {
    this.token = null;
    this.telegramId = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }
    if (this.telegramId) {
      (headers as Record<string, string>)["X-Telegram-ID"] = this.telegramId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async authenticate(authData: any): Promise<{ token: string; psychologist: Psychologist; is_new: boolean }> {
    return this.request("/api/auth/telegram", {
      method: "POST",
      body: JSON.stringify(authData),
    });
  }

  // Profile
  async getProfile(): Promise<FullProfile> {
    return this.request("/api/profile");
  }

  async updateProfile(data: Partial<PsychologistProfile>): Promise<PsychologistProfile> {
    return this.request("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // AI Twin
  async updateAITwin(data: { greeting?: string; system_prompt?: string }): Promise<AITwin> {
    return this.request("/api/ai-twin", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateQuestions(questions: string[]): Promise<InitialQuestion[]> {
    return this.request("/api/ai-twin/questions", {
      method: "PUT",
      body: JSON.stringify({ questions }),
    });
  }

  async publish(): Promise<{ share_code: string; share_url: string }> {
    return this.request("/api/ai-twin/publish", {
      method: "POST",
    });
  }

  async unpublish(): Promise<void> {
    return this.request("/api/ai-twin/unpublish", {
      method: "POST",
    });
  }

  // Suggestions
  async getSuggestion(field: string, context?: string): Promise<{ suggestion: string }> {
    return this.request("/api/suggest", {
      method: "POST",
      body: JSON.stringify({ field, context }),
    });
  }

  // Preview chats
  async getPreviewChats(): Promise<PreviewChat[]> {
    return this.request("/api/preview-chats");
  }

  async createPreviewChat(title?: string): Promise<PreviewChat> {
    return this.request("/api/preview-chats", {
      method: "POST",
      body: JSON.stringify({ title: title || "Test Chat" }),
    });
  }

  async deletePreviewChat(chatId: string): Promise<void> {
    return this.request(`/api/preview-chats/${chatId}`, {
      method: "DELETE",
    });
  }

  async getPreviewMessages(chatId: string): Promise<PreviewMessage[]> {
    return this.request(`/api/preview-chats/${chatId}/messages`);
  }

  async sendPreviewMessage(chatId: string, message: string): Promise<{ response: string }> {
    return this.request(`/api/preview-chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }
}

export const api = new ApiClient();
