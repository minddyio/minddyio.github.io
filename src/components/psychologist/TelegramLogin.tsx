import { useEffect, useRef } from "react";

interface TelegramLoginProps {
  onAuth: (data: TelegramAuthData) => void;
}

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramAuthData) => void;
    };
    onTelegramAuth: (user: TelegramAuthData) => void;
  }
}

export function TelegramLogin({ onAuth }: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up global callback
    window.onTelegramAuth = (user: TelegramAuthData) => {
      onAuth(user);
    };

    // Create widget
    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "minddy_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-radius", "8");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      script.async = true;

      containerRef.current.appendChild(script);
    }

    return () => {
      delete window.onTelegramAuth;
    };
  }, [onAuth]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={containerRef} className="telegram-login-container" />

      {/* Fallback button for development */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            // Mock auth for development
            onAuth({
              id: 123456789,
              first_name: "Test",
              last_name: "User",
              username: "testuser",
              auth_date: Math.floor(Date.now() / 1000),
              hash: "dev_hash",
            });
          }}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Dev: Skip login
        </button>
      )}
    </div>
  );
}
