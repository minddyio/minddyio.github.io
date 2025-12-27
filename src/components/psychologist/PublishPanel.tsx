import { useState } from "react";
import { api, type FullProfile } from "./api";

interface PublishPanelProps {
  profile: FullProfile;
  onUpdate: (profile: FullProfile) => void;
}

export function PublishPanel({ profile, onUpdate }: PublishPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isPublished = profile.ai_twin?.is_published || false;
  const shareCode = profile.ai_twin?.share_code;

  const canPublish = profile.ai_twin?.greeting && profile.ai_twin?.system_prompt;

  const handlePublish = async () => {
    if (!canPublish) {
      alert("Заполните приветствие и системный промпт перед публикацией");
      return;
    }

    try {
      setIsLoading(true);
      const result = await api.publish();
      setShareUrl(result.share_url);

      // Update profile with new published state
      const updatedProfile = await api.getProfile();
      onUpdate(updatedProfile);
    } catch (err) {
      console.error("Failed to publish:", err);
      alert("Ошибка публикации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("Вы уверены? Клиенты больше не смогут использовать эту ссылку.")) {
      return;
    }

    try {
      setIsLoading(true);
      await api.unpublish();
      setShareUrl(null);

      // Update profile
      const updatedProfile = await api.getProfile();
      onUpdate(updatedProfile);
    } catch (err) {
      console.error("Failed to unpublish:", err);
      alert("Ошибка отмены публикации");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const currentShareUrl = shareUrl || (shareCode ? `https://t.me/minddy_bot?start=psy_${shareCode}` : null);

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Публикация AI-двойника</h2>

      <div className="space-y-6">
        {/* Status Card */}
        <div className={`rounded-xl p-6 ${isPublished ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${isPublished ? "bg-green-500" : "bg-gray-400"}`} />
            <span className={`font-medium ${isPublished ? "text-green-900" : "text-gray-700"}`}>
              {isPublished ? "Опубликовано" : "Не опубликовано"}
            </span>
          </div>

          {isPublished && currentShareUrl && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Ваш AI-двойник доступен клиентам по ссылке:
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border rounded-lg px-4 py-2 text-sm font-mono text-gray-800 truncate">
                  {currentShareUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(currentShareUrl)}
                  className="flex-shrink-0 px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copied ? "Скопировано!" : "Копировать"}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Отправьте эту ссылку своим клиентам. При переходе они попадут в Telegram-бот.
              </p>
            </div>
          )}

          {!isPublished && (
            <p className="text-sm text-gray-600">
              После публикации вы получите ссылку, которую можно отправить клиентам.
              Клиенты смогут общаться с вашим AI-двойником через Telegram.
            </p>
          )}
        </div>

        {/* Requirements Check */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Проверка готовности</h3>

          <div className="space-y-3">
            <CheckItem
              checked={!!profile.ai_twin?.greeting}
              label="Приветствие заполнено"
            />
            <CheckItem
              checked={!!profile.ai_twin?.system_prompt}
              label="Системный промпт настроен"
            />
            <CheckItem
              checked={(profile.questions?.length || 0) > 0}
              label="Добавлены первые вопросы"
              optional
            />
            <CheckItem
              checked={!!profile.profile?.display_name}
              label="Заполнен профиль"
              optional
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {!isPublished ? (
            <button
              onClick={handlePublish}
              disabled={isLoading || !canPublish}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Публикация..." : "Опубликовать AI-двойника"}
            </button>
          ) : (
            <button
              onClick={handleUnpublish}
              disabled={isLoading}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Отмена..." : "Снять с публикации"}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-2">Как это работает</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Вы настраиваете AI-двойника: приветствие, системный промпт, первые вопросы</li>
            <li>Публикуете и получаете уникальную ссылку</li>
            <li>Отправляете ссылку своим клиентам</li>
            <li>Клиенты переходят по ссылке и начинают общаться с вашим AI-двойником в Telegram</li>
            <li>AI задает ваши вопросы, проявляет эмпатию и ведет сессию по вашему сценарию</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ checked, label, optional }: { checked: boolean; label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checked ? "bg-green-500" : "bg-gray-200"}`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? "text-gray-900" : "text-gray-500"}`}>
        {label}
        {optional && <span className="text-gray-400 ml-1">(опционально)</span>}
      </span>
    </div>
  );
}
