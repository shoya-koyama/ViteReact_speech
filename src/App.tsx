import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

const Calendar = React.lazy(() => import("./Calendar"));

const App = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP"; // 日本語の設定

    // 読み上げ開始・終了を制御
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    // 音声再生
    speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">音声読み上げ</Link> | <Link to="/calendar">カレンダー</Link>
      </nav>
      <React.Suspense fallback={<div>読み込み中...</div>}>
        <Routes>
          <Route path="/" element={
            <div>
              <h1>テキスト読み上げアプリ</h1>
              <textarea
                rows={4}
                cols={50}
                placeholder="ここに文章を入力してください"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ padding: "1rem", fontSize: "1rem", width: "100%" }}
              />
              <div style={{ marginTop: "1rem" }}>
                <button onClick={speakText} disabled={isSpeaking}>
                  {isSpeaking ? "再生中..." : "読み上げる"}
                </button>
                <button
                  onClick={stopSpeech}
                  style={{ marginLeft: "1rem" }}
                  disabled={!isSpeaking}
                >
                  停止
                </button>
              </div>
            </div>
          } />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </React.Suspense>
    </div>
  );
};

export default App;
