import React, { createContext, useEffect, useState, useCallback } from "react";
import CryptoJS from "crypto-js";

interface EnhancementContextProps {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;  // Renamed to match the context
  dyslexiaMode: boolean;
  toggleDyslexia: () => void;
  speak: (text: string) => void;
  encryptText: (text: string) => string;
  decryptText: (cipher: string) => string;
}

export const EnhancementContext = createContext<EnhancementContextProps>(null!);

export const EnhancementProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState("light");
  const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
  const [fontSize, setFontSize] = useState("text-base");
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [userKey, setUserKey] = useState<string>("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    const storedFont = localStorage.getItem("fontSize") || "text-base";
    const dyslexia = localStorage.getItem("dyslexia") === "true";
    const storedUserId = localStorage.getItem("userId");
    const storedSalt = localStorage.getItem("encryptionSalt");

    setThemeState(storedTheme);
    setFontSize(storedFont);
    setDyslexiaMode(dyslexia);

    if (storedTheme === "dark") document.documentElement.classList.add("dark");
    if (dyslexia) document.body.classList.add("dyslexia-font");

    // Derive per-user key using SHA256
    if (storedUserId && storedSalt) {
      const key = CryptoJS.SHA256(storedUserId + storedSalt).toString();
      setUserKey(key);
    } else {
      // fallback key for anonymous user using random string
      const anonKey = Math.random().toString(36).substring(2);
      setUserKey(CryptoJS.SHA256(anonKey).toString());
    }
  }, []);
  const increaseFontSize = () => {
    const index = fontSizes.indexOf(fontSize);
    if (index < fontSizes.length - 1) {
      const newSize = fontSizes[index + 1];
      setFontSize(newSize);
      localStorage.setItem("fontSize", newSize);
    }
  };
  
  const decreaseFontSize = () => {
    const index = fontSizes.indexOf(fontSize);
    if (index > 0) {
      const newSize = fontSizes[index - 1];
      setFontSize(newSize);
      localStorage.setItem("fontSize", newSize);
    }
  };
  // Memoize toggleTheme to avoid re-creating on every render
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  // Memoize setTheme to avoid re-creating on every render
  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  }, []);

  const toggleDyslexia = useCallback(() => {
    setDyslexiaMode(prev => !prev);
    document.body.classList.toggle("dyslexia-font");
    localStorage.setItem("dyslexia", (!dyslexiaMode).toString());
  }, [dyslexiaMode]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const encryptText = (text: string) => {
    return CryptoJS.AES.encrypt(text, userKey).toString();
  };

  const decryptText = (cipher: string) => {
    const bytes = CryptoJS.AES.decrypt(cipher, userKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return (
    <EnhancementContext.Provider value={{
      theme, toggleTheme,
      setTheme,  // Providing setTheme
      fontSize, setFontSize,  // Providing setFontSizeState
      dyslexiaMode, toggleDyslexia,
      speak,
      encryptText, decryptText
    }}>
      {children}
    </EnhancementContext.Provider>
  );
};
