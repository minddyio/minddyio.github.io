import { useState } from "react";
import { api, type FullProfile } from "./api";

interface AITwinEditorProps {
  profile: FullProfile;
  onUpdate: (profile: FullProfile) => void;
}

export function AITwinEditor({ profile, onUpdate }: AITwinEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [suggestingField, setSuggestingField] = useState<string | null>(null);

  const [greeting, setGreeting] = useState(profile.ai_twin?.greeting || "");
  const [systemPrompt, setSystemPrompt] = useState(profile.ai_twin?.system_prompt || "");
  const [questions, setQuestions] = useState<string[]>(
    profile.questions?.map((q) => q.question) || [""]
  );

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Update AI twin
      const updatedTwin = await api.updateAITwin({
        greeting: greeting || undefined,
        system_prompt: systemPrompt || undefined,
      });

      // Update questions
      const filteredQuestions = questions.filter((q) => q.trim() !== "");
      const updatedQuestions = await api.updateQuestions(filteredQuestions);

      onUpdate({
        ...profile,
        ai_twin: updatedTwin,
        questions: updatedQuestions,
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save AI twin:", err);
      alert("Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = async (field: "greeting" | "system_prompt" | "questions") => {
    try {
      setSuggestingField(field);
      const { suggestion } = await api.getSuggestion(field);

      if (field === "greeting") {
        setGreeting(suggestion);
      } else if (field === "system_prompt") {
        setSystemPrompt(suggestion);
      } else if (field === "questions") {
        const newQuestions = suggestion.split("\n").filter((q) => q.trim() !== "");
        setQuestions(newQuestions.length > 0 ? newQuestions : [""]);
      }
    } catch (err) {
      console.error("Failed to get suggestion:", err);
      alert("Ошибка получения подсказки");
    } finally {
      setSuggestingField(null);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions.length > 0 ? newQuestions : [""]);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Настройка AI-двойника</h2>

      <div className="space-y-6">
        {/* Greeting */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Приветствие
            </label>
            <button
              onClick={() => handleSuggest("greeting")}
              disabled={suggestingField === "greeting"}
              className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
            >
              {suggestingField === "greeting" ? "Генерация..." : "Сгенерировать"}
            </button>
          </div>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Привет! Я рад, что ты обратился. Расскажи, что тебя беспокоит?"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Это сообщение увидит клиент при первом обращении к вашему AI-двойнику
          </p>
        </div>

        {/* System Prompt */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Системный промпт
            </label>
            <button
              onClick={() => handleSuggest("system_prompt")}
              disabled={suggestingField === "system_prompt"}
              className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
            >
              {suggestingField === "system_prompt" ? "Генерация..." : "Сгенерировать"}
            </button>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Ты психолог-консультант, практикующий гештальт-терапию. Твой стиль - теплый и поддерживающий. Ты помогаешь клиентам осознать свои эмоции..."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Опишите свой терапевтический подход, стиль общения, любимые методы
          </p>
        </div>

        {/* Initial Questions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Первые вопросы
            </label>
            <button
              onClick={() => handleSuggest("questions")}
              disabled={suggestingField === "questions"}
              className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
            >
              {suggestingField === "questions" ? "Генерация..." : "Сгенерировать"}
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-10 flex items-center justify-center text-sm text-gray-400">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder="Введите вопрос..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeQuestion(index)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Удалить вопрос"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addQuestion}
            className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            + Добавить вопрос
          </button>

          <p className="mt-3 text-xs text-gray-500">
            Эти вопросы будут заданы клиенту в начале сессии. После каждого ответа AI проявит эмпатию и задаст следующий вопрос.
          </p>
        </div>

        {/* Example */}
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-purple-900 mb-3">Пример диалога</h3>
          <div className="space-y-2 text-sm">
            <div className="text-purple-700">
              <span className="font-medium">AI:</span> {greeting || "Привет! Расскажи, что тебя беспокоит?"}
            </div>
            {questions[0] && questions[0].trim() && (
              <>
                <div className="text-gray-600">
                  <span className="font-medium">Клиент:</span> Привет, у меня проблемы на работе...
                </div>
                <div className="text-purple-700">
                  <span className="font-medium">AI:</span> Понимаю, проблемы на работе могут быть очень стрессовыми. {questions[1] || "Как давно это происходит?"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Сохранение..." : "Сохранить настройки"}
          </button>

          {isSaved && (
            <span className="text-green-600 text-sm">Сохранено!</span>
          )}
        </div>
      </div>
    </div>
  );
}
