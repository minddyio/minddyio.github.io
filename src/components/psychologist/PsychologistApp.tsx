import { useState, useEffect } from "react";
import { TelegramLogin } from "./TelegramLogin";
import { ProfileEditor } from "./ProfileEditor";
import { AITwinEditor } from "./AITwinEditor";
import { ChatPreview } from "./ChatPreview";
import { PublishPanel } from "./PublishPanel";
import { api, type FullProfile } from "./api";

type Tab = "profile" | "ai-twin" | "preview" | "publish";

export default function PsychologistApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem("minddy_token");
    const telegramId = localStorage.getItem("minddy_telegram_id");

    if (token && telegramId) {
      api.setAuth(token, telegramId);
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProfile();
      setProfile(data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to load profile:", err);
      // Clear invalid auth
      localStorage.removeItem("minddy_token");
      localStorage.removeItem("minddy_telegram_id");
      api.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (authData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.authenticate(authData);

      localStorage.setItem("minddy_token", result.token);
      localStorage.setItem("minddy_telegram_id", String(authData.id));
      api.setAuth(result.token, String(authData.id));

      await loadProfile();
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("minddy_token");
    localStorage.removeItem("minddy_telegram_id");
    api.clearAuth();
    setIsAuthenticated(false);
    setProfile(null);
  };

  const handleProfileUpdate = (updatedProfile: FullProfile) => {
    setProfile(updatedProfile);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <img src="/logo_minddy.png" alt="Minddy" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Кабинет психолога</h1>
          <p className="text-gray-600 mb-6">
            Создайте своего AI-двойника и делитесь им с клиентами
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <TelegramLogin onAuth={handleLogin} />

          <p className="mt-6 text-xs text-gray-500">
            Войдите через Telegram, чтобы продолжить
          </p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Профиль" },
    { id: "ai-twin", label: "AI-двойник" },
    { id: "preview", label: "Превью" },
    { id: "publish", label: "Публикация" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_minddy.png" alt="Minddy" className="w-8 h-8" />
            <span className="font-semibold text-gray-900">Minddy</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.psychologist?.first_name || profile?.psychologist?.username || "Психолог"}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "profile" && profile && (
          <ProfileEditor profile={profile} onUpdate={handleProfileUpdate} />
        )}

        {activeTab === "ai-twin" && profile && (
          <AITwinEditor profile={profile} onUpdate={handleProfileUpdate} />
        )}

        {activeTab === "preview" && profile && (
          <ChatPreview profile={profile} />
        )}

        {activeTab === "publish" && profile && (
          <PublishPanel profile={profile} onUpdate={handleProfileUpdate} />
        )}
      </main>
    </div>
  );
}
