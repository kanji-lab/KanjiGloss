/**
 * KanjiGloss — Prototype Implementation
 *
 * This is an early-stage prototype demonstrating the core concept.
 * It is NOT production-ready. Known limitations:
 *   - No API key management (relies on Anthropic API being available)
 *   - Minimal error handling
 *   - Single-file component (not modularized)
 *   - No caching of previously analyzed compounds
 *   - No tests
 *
 * See README.md for the full concept and scientific basis.
 */

import { useState, useCallback } from "react";

const SAMPLE_TEXT = `日本語の勉強は大変ですが、毎日練習すれば上達します。東京の電車は時刻表通りに運行されていて、外国人観光客にも便利です。日本の文化や伝統は世界中で人気があります。`;

// ---------------------------------------------------------------------------
// API: Use Claude to identify jukugo and translate them
// ---------------------------------------------------------------------------
async function analyzeText(text) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a Japanese language analysis tool. Given the following Japanese text, identify all jukugo (熟語 — kanji compound words of 2+ kanji characters). For each jukugo, provide its English translation.

IMPORTANT RULES:
- Only identify compounds of 2 or more consecutive kanji characters
- Do NOT include single kanji, hiragana, or katakana
- Keep English translations SHORT (1-3 words max)
- Return ONLY a JSON array, no other text, no markdown fences

Format: [{"word":"熟語","english":"compound word"},...]

Text: ${text}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const raw = data.content?.map((b) => b.text || "").join("") || "[]";
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ---------------------------------------------------------------------------
// Text Processing: Build ruby-annotated segments
// Uses longest-match-first to prevent overlapping annotations
// ---------------------------------------------------------------------------
function buildRubySegments(text, jukugoList) {
  const sorted = [...jukugoList].sort((a, b) => b.word.length - a.word.length);

  const used = new Set();
  const matches = [];

  for (const item of sorted) {
    let start = 0;
    while (true) {
      const idx = text.indexOf(item.word, start);
      if (idx === -1) break;
      let overlap = false;
      for (let i = idx; i < idx + item.word.length; i++) {
        if (used.has(i)) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        matches.push({ idx, word: item.word, english: item.english });
        for (let i = idx; i < idx + item.word.length; i++) used.add(i);
      }
      start = idx + 1;
    }
  }

  matches.sort((a, b) => a.idx - b.idx);

  const segments = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.idx > cursor) {
      segments.push({ type: "text", content: text.slice(cursor, m.idx) });
    }
    segments.push({ type: "ruby", word: m.word, english: m.english });
    cursor = m.idx + m.word.length;
  }
  if (cursor < text.length) {
    segments.push({ type: "text", content: text.slice(cursor) });
  }

  return segments;
}

// ---------------------------------------------------------------------------
// UI Components
// ---------------------------------------------------------------------------

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, marginLeft: 8 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#e85d3a",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function KanjiGloss() {
  const [inputText, setInputText] = useState("");
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jukugoCount, setJukugoCount] = useState(0);
  const [fontSize, setFontSize] = useState(22);

  const handleAnalyze = useCallback(
    async (text) => {
      const target = text || inputText;
      if (!target.trim()) return;
      setLoading(true);
      setError("");
      setSegments([]);
      try {
        const jukugoList = await analyzeText(target.trim());
        setJukugoCount(jukugoList.length);
        const segs = buildRubySegments(target.trim(), jukugoList);
        setSegments(segs);
      } catch (e) {
        setError("解析に失敗しました。もう一度お試しください。");
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [inputText]
  );

  const handleSample = () => {
    setInputText(SAMPLE_TEXT);
    handleAnalyze(SAMPLE_TEXT);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf6f1",
        fontFamily: "'Noto Serif JP', 'Georgia', serif",
        padding: "0 16px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          paddingTop: 48,
          paddingBottom: 64,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-block",
              background: "#e85d3a",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "4px 14px",
              borderRadius: 3,
              marginBottom: 16,
            }}
          >
            学習ツール
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1a1410",
              margin: "0 0 8px",
              lineHeight: 1.3,
            }}
          >
            熟語<span style={{ color: "#e85d3a" }}>ルビ</span>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#8a7e72",
              margin: 0,
              letterSpacing: 0.3,
            }}
          >
            Japanese text → English ruby annotations on compound words
          </p>
        </div>

        {/* Input */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(26,20,16,0.06)",
            border: "1px solid #e8e2da",
            padding: 24,
            marginBottom: 24,
          }}
        >
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="日本語の文章をここに入力してください…"
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1.5px solid #e8e2da",
              borderRadius: 8,
              padding: "14px 16px",
              fontSize: 17,
              fontFamily: "'Noto Serif JP', serif",
              color: "#1a1410",
              background: "#faf6f1",
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.2s",
              lineHeight: 1.8,
            }}
            onFocus={(e) => (e.target.style.borderColor = "#e85d3a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2da")}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 14,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !inputText.trim()}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 28px",
                background:
                  loading || !inputText.trim() ? "#ccc5bc" : "#e85d3a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor:
                  loading || !inputText.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  解析中
                  <LoadingDots />
                </>
              ) : (
                "解析する"
              )}
            </button>

            <button
              onClick={handleSample}
              disabled={loading}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 13,
                padding: "10px 20px",
                background: "transparent",
                color: "#8a7e72",
                border: "1.5px solid #e8e2da",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              サンプルを試す
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fef2f0",
              border: "1px solid #f0c0b4",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#c44020",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {/* Result */}
        {segments.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(26,20,16,0.06)",
              border: "1px solid #e8e2da",
              padding: 28,
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid #f0ebe4",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#8a7e72",
                }}
              >
                <span style={{ color: "#e85d3a", fontWeight: 600 }}>
                  {jukugoCount}
                </span>{" "}
                熟語 detected
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "#8a7e72",
                }}
              >
                <span>文字サイズ</span>
                <input
                  type="range"
                  min={16}
                  max={32}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ width: 80, accentColor: "#e85d3a" }}
                />
              </div>
            </div>

            {/* Ruby text output */}
            <div
              style={{
                fontSize,
                lineHeight: 2.6,
                color: "#1a1410",
                fontFamily: "'Noto Serif JP', serif",
                letterSpacing: 0.5,
              }}
            >
              {segments.map((seg, i) => {
                if (seg.type === "text") {
                  return <span key={i}>{seg.content}</span>;
                }
                return (
                  <ruby
                    key={i}
                    style={{
                      background: "rgba(232,93,58,0.07)",
                      borderRadius: 4,
                      padding: "0 2px",
                      transition: "background 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(232,93,58,0.16)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(232,93,58,0.07)")
                    }
                  >
                    {seg.word}
                    <rp>(</rp>
                    <rt
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.45em",
                        fontWeight: 600,
                        color: "#e85d3a",
                        letterSpacing: 0.3,
                        lineHeight: 1.2,
                        textTransform: "lowercase",
                      }}
                    >
                      {seg.english}
                    </rt>
                    <rp>)</rp>
                  </ruby>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#b5ad9e",
            lineHeight: 1.7,
          }}
        >
          ヒント：熟語にマウスを重ねるとハイライトされます
        </div>
      </div>
    </div>
  );
}
