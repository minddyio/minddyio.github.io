import { useState } from "react";
import { api, type FullProfile } from "./api";

interface ProfileEditorProps {
  profile: FullProfile;
  onUpdate: (profile: FullProfile) => void;
}

export function ProfileEditor({ profile, onUpdate }: ProfileEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [displayName, setDisplayName] = useState(profile.profile?.display_name || "");
  const [bio, setBio] = useState(profile.profile?.bio || "");
  const [education, setEducation] = useState(profile.profile?.education || "");
  const [specializations, setSpecializations] = useState(profile.profile?.specializations || "");
  const [experience, setExperience] = useState(profile.profile?.experience || "");

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedProfileData = await api.updateProfile({
        display_name: displayName || undefined,
        bio: bio || undefined,
        education: education || undefined,
        specializations: specializations || undefined,
        experience: experience || undefined,
      });

      onUpdate({
        ...profile,
        profile: updatedProfileData,
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ваш профиль</h2>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        {/* Telegram Info */}
        <div className="flex items-center gap-4 pb-6 border-b">
          {profile.psychologist?.photo_url ? (
            <img
              src={profile.psychologist.photo_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-semibold">
              {(profile.psychologist?.first_name || "P")[0]}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {profile.psychologist?.first_name} {profile.psychologist?.last_name}
            </div>
            {profile.psychologist?.username && (
              <div className="text-sm text-gray-500">@{profile.psychologist.username}</div>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Отображаемое имя
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Как вас называть клиентам"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            О себе
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Краткое описание вашего подхода к работе"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Образование
          </label>
          <textarea
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Ваше образование, сертификаты, курсы"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Например: МГУ, факультет психологии. Сертификат по гештальт-терапии.
          </p>
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Специализации
          </label>
          <textarea
            value={specializations}
            onChange={(e) => setSpecializations(e.target.value)}
            placeholder="С чем вы работаете"
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Например: тревожность, депрессия, отношения, самооценка
          </p>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опыт работы
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Ваш опыт в психологии"
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>

          {isSaved && (
            <span className="text-green-600 text-sm">Сохранено!</span>
          )}
        </div>
      </div>
    </div>
  );
}
