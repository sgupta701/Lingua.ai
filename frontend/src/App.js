import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Hindi");
  const [loading, setLoading] = useState(false);

  const languages = ["English", "Hindi", "Japanese", "Spanish", "Urdu"];

  // Map friendly names to MBART codes
  const langCodeMap = {
    English: "en_XX",
    Hindi: "hi_IN",
    Japanese: "ja_XX",
    Spanish: "es_XX",
    Urdu: "ur_PK"
  };

  const translate = async () => {
    if (!inputText.trim()) return alert("Please enter some text!");

    // Prevent unsupported Hindi → Urdu
    if (sourceLang === "Hindi" && targetLang === "Urdu") {
      return alert("⚠️ Sorry, Hindi → Urdu translation is not supported.");
    }

    setTranslatedText(""); 
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/translate", {
        text: inputText,
        src_lang: langCodeMap[sourceLang],
        tgt_lang: langCodeMap[targetLang]
      });

      setTranslatedText(response.data.translated_text);
    } catch (err) {
      alert("Translation failed. Check the console.");
      console.error(err);
    }

    setLoading(false);
  };

  const clear = () => {
    setInputText("");
    setTranslatedText("");
  };

  return (
    <div className="container">
      <h1>Verta AI 🌍</h1>

      <div className="controls">
        <div className="left-select">
          <label>Source Language</label>
          <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
            {languages.map(lang => <option key={lang}>{lang}</option>)}
          </select>
        </div>

        <span className="arrow">⇄</span>

        <div className="right-select">
          <label>Target Language</label>
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)}>
            {languages.map(lang => <option key={lang}>{lang}</option>)}
          </select>
        </div>
      </div>

      <textarea
        placeholder={`Enter text in ${sourceLang}...`}
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />

      <div className="button-group">
        <button onClick={translate} disabled={loading}>
          {loading ? "Translating..." : "Translate"}
        </button>
        <button onClick={clear} className="clear">Clear</button>
      </div>

      <textarea
        placeholder={`Translated text in ${targetLang}`}
        value={translatedText}
        readOnly
      />

      <footer>
        ⚡ Verta AI | AI-Powered Multi-Language Translation
      </footer>
    </div>
  );
};

export default App;
