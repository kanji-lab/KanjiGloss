# KanjiGloss

**Inline English meaning glosses rendered as ruby annotations on Japanese kanji compounds**

A meaning-first reading aid for L2 Japanese learners.

> What if furigana showed you what kanji *mean* instead of how they're *read* — and in doing so, let you learn Japanese grammar by actually reading Japanese?

---

## The Core Idea

Japanese is unusual in that it simultaneously employs two fundamentally different types of script — **phonographic** scripts (hiragana/katakana) that encode sound, and a **logographic** script (kanji) that encodes meaning. While Chinese also uses logographic characters, Japanese is distinctive in mixing both systems within the same sentence. Crucially, these scripts activate different cognitive pathways in the brain.

Traditional learning tools place **pronunciation guides** (furigana) above kanji. This forces the learner through an indirect route:

```
Kanji → Japanese reading (sound) → meaning
```

**KanjiGloss** replaces pronunciation with **L1 meaning**, creating a direct route:

```
Kanji → English meaning (via ruby) → comprehension
```

This approach leverages the logographic nature of kanji — they are *meaning* characters, not *sound* characters. The pronunciation can come later.

## The Key Insight: Learning Grammar Through Reading

The most significant effect of KanjiGloss is not about kanji — it's about **everything else in the sentence**.

When kanji meanings are resolved by English glosses, the **hiragana portions of the sentence become the focus of active learning**. In Japanese, hiragana carries the grammatical machinery of the language: particles (は, が, を, に), verb conjugations (します, すれば, された), conjunctions (ですが, しかし, ので), and auxiliary expressions (かもしれない, なければならない).

Consider this glossed sentence:

```
[study]勉強 は [difficult]大変 ですが、 [every day]毎日 [practice]練習 すれば [improve]上達 します。
```

With the kanji meanings already provided, the learner's cognitive effort shifts to parsing **は** (topic marker), **ですが** (polite + contrastive conjunction), **すれば** (conditional form), and **します** (polite verb ending). These are precisely the structural elements that are difficult to learn from flashcards and grammar tables, but are naturally acquired through **repeated exposure in context**.

KanjiGloss creates a clean separation:

- **Kanji compounds** = meaning blocks (resolved by glosses)
- **Hiragana** = grammatical glue (foregrounded for active learning)

This separation mirrors how Japanese text actually works. And it inverts the traditional learning sequence: instead of "learn kanji first, then read sentences," KanjiGloss enables **"read sentences now, absorb grammar through practice, learn kanji readings later."**

## How It Works

Paste any Japanese text into the tool. The system:

1. Identifies **jukugo** (熟語 — compound kanji words of 2+ characters)
2. Translates each compound into a concise English gloss
3. Displays the English gloss as **ruby text** above the original kanji using HTML `<ruby>` tags

For example, the sentence:

> 日本語の**勉強**は**大変**ですが、**毎日****練習**すれば**上達**します。

becomes text where each bolded compound has a small English translation hovering above it (e.g. "study" above 勉強, "difficult" above 大変), while hiragana and grammatical particles remain untouched.

## Prior Art & Novelty

This project sits at the intersection of several existing ideas, but their specific combination appears to be novel.

### What already exists

| Approach | Examples | Limitation |
|----------|----------|------------|
| **Meaning-first kanji learning** | Heisig's *Remembering the Kanji* (1977) | Isolated characters, not contextual reading |
| **Popup dictionaries** | Rikaikun, Yomichan, 10ten Reader | Requires hover/click; breaks reading flow |
| **Furigana tools** | IPA Furigana, NihongoDera | Shows pronunciation, not meaning |
| **Reading apps with glosses** | Satori Reader, Japanese IO | Click-to-reveal; not always-visible |
| **Literary use of meaning-ruby** | Japanese publishing tradition | For native speakers; creative/literary, not systematized for L2 |
| **Interlinear glossing** | Leipzig Glossing Rules, academic texts | For linguistic analysis, not reading practice |
| **L2 text glossing research** | Boers (2022), Abraham (2008), and others | Studied margin/popup glosses, not ruby-position |

### What is new here

The combination of:

- **Ruby position** (always visible, inline, non-disruptive)
- **L1 meaning** (not pronunciation)
- **Compound-level** (jukugo, not individual kanji)
- **Applied to natural text** (not flashcards or isolated study)
- **For L2 learners** (not literary/translation technique)

No existing tool, app, or academic study was found (as of March 2026) that implements this specific combination.

## Scientific Basis

### Dual-Route Model of Reading

Research on Japanese reading supports the idea that kanji and kana are processed through distinct cognitive routes:

- **Kanji** → whole-word lexical processing → semantics-to-phonology route (ventral pathway)
- **Kana** → sub-lexical phonological processing → phonology-to-semantics route (dorsal pathway)

This has been demonstrated in both behavioral studies (Dylman & Kikutani, 2018; Sakuma et al., 1998) and neuroimaging research showing distinct brain activation patterns for kanji vs. kana (Thuy et al., 2004).

The key insight: **kanji inherently support direct access to meaning without phonological mediation**. This tool aligns with that natural processing pathway.

### Glossing Research

A substantial body of SLA (Second Language Acquisition) research supports the effectiveness of text glossing for vocabulary acquisition:

- Boers (2022) provides a comprehensive review of glossing and vocabulary learning in *Language Teaching*
- Meta-analyses (Abraham, 2008; Zhang & Ma, 2024) confirm that textual glosses facilitate L2 vocabulary acquisition
- Research suggests that **gloss location** (marginal vs. inline) and **gloss language** (L1 vs. L2) are significant moderating variables

However, **ruby-position L1 glosses for kanji compounds** have not been studied as a specific condition in any identified research.

### Heisig's Precedent

James Heisig's *Remembering the Kanji* (1977–) pioneered the "meaning-first, reading-later" approach, aiming to give learners the same advantage that Chinese and Korean speakers have: recognizing kanji meanings without knowing their Japanese pronunciations.

KanjiGloss extends this philosophy from **isolated kanji study** to **contextual reading of natural text**.

## Potential Applications

- **Browser extension** — Automatically annotate any Japanese webpage with English ruby glosses
- **E-reader integration** — Reading Japanese books with meaning-ruby instead of (or alongside) furigana
- **Adaptive learning** — Gradually remove ruby annotations for known compounds (spaced repetition)
- **Bilingual mode** — Show both pronunciation (furigana) and meaning (English ruby) simultaneously
- **Other language pairs** — The concept could apply to Chinese (hanzi → English ruby) or Korean (hanja → English ruby)

## Technical Implementation

The current prototype is built as a React component using:

- Claude API for jukugo identification and translation
- HTML `<ruby>`, `<rt>`, `<rp>` tags for annotation display
- Longest-match-first algorithm to prevent overlapping annotations

## Getting Started

```bash
# Clone the repository
git clone https://github.com/kanji-lab/KanjiGloss.git

# The main component is in src/
# See src/KanjiGloss.jsx for the React implementation
```

## License

MIT

## References

- Abraham, L. B. (2008). Computer-mediated glosses in second language reading comprehension and vocabulary learning: A meta-analysis. *Computer Assisted Language Learning*, 21, 199–226.
- Boers, F. (2022). Glossing and vocabulary learning. *Language Teaching*, 55(1), 1–23.
- Coltheart, M., Rastle, K., Perry, C., Langdon, R., & Ziegler, J. (2001). DRC: A dual route cascaded model of visual word recognition and reading aloud. *Psychological Review*, 108(1), 204–256.
- Dylman, A. S., & Kikutani, M. (2018). The role of semantic processing in reading Japanese orthographies: An investigation using a script-switch paradigm. *Reading and Writing*, 31, 1055–1075.
- Heisig, J. W. (1977). *Remembering the Kanji*. Japan Publications Trading.
- Sakuma, N., Sasanuma, S., Tatsumi, I. F., & Masaki, S. (1998). Orthography and phonology in reading Japanese kanji words: Evidence from the semantic decision task with homophones. *Memory & Cognition*, 26, 75–87.
- Thuy, D. H. D., Matsuo, K., Nakamura, K., Toma, K., Oga, T., Nakai, T., Shibasaki, H., & Fukuyama, H. (2004). Implicit and explicit processing of kanji and kana words and non-words studied with fMRI. *NeuroImage*, 23(3), 878–889.
- Zhang, C., & Ma, R. (2024). The effect of textual glosses on L2 vocabulary acquisition: A meta-analysis. *Language Teaching Research*, 28(1), 245–268.

---

<details>
<summary>日本語版 / Japanese</summary>

## KanjiGloss（漢字グロス）

### コンセプト

日本語には、音声を表す文字（ひらがな・カタカナ）と意味を表す文字（漢字）が共存するという、世界的にも特異な特徴があります。

従来の学習ツールは漢字の上に**読み方**（ふりがな）を表示しますが、これは学習者に「漢字→読み→意味」という間接的なルートを強います。

**KanjiGloss**は、ふりがなの代わりに**英語の意味**をルビとして表示し、「漢字→意味」という直接的なルートを実現します。これは漢字が本来持つ表意文字としての性質を活かしたアプローチです。

### 最大の効果：文法の実践的習得

KanjiGlossの最も重要な効果は、漢字に関するものではなく、**文中のそれ以外の部分**に関するものです。

漢字熟語の意味が英語ルビで解決されると、学習者の認知的な負荷は自然と**ひらがな部分**に移ります。日本語のひらがなは、助詞（は・が・を・に）、動詞の活用（します・すれば・された）、接続表現（ですが・しかし・ので）など、文法の骨格を担っています。

これらは単語帳や文法表では身につきにくく、文脈の中で繰り返し触れることで自然に習得される要素です。KanjiGlossは漢字熟語を「意味のブロック」、ひらがなを「文法の接着剤」として分離し、従来の学習順序を逆転させます。「漢字を覚えてから文章を読む」のではなく、**「今すぐ文章を読み、文法を実践の中で吸収し、漢字の読みは後から覚える」**というアプローチを可能にします。

### 新規性

以下の要素を組み合わせたツールは、調査の限り（2026年3月時点）見つかりませんでした：

- **ルビ位置**に（ポップアップでも余白注釈でもなく）
- **母語（英語）の意味**を（読み方ではなく）
- **熟語単位**で（個別の漢字ではなく）
- **自然な文章に対して**（フラッシュカードではなく）
- **第二言語学習者向け**に（文学的技法としてではなく）

表示する。

### 科学的根拠

認知科学の二重経路モデルによれば、漢字は「意味→音韻」ルート（腹側経路）で処理され、かなは「音韻→意味」ルート（背側経路）で処理されることが示されています。漢字は本質的に、音を介さず意味に直接アクセスできる文字体系です。このツールはその自然な処理経路に沿った学習を支援します。

### ライセンス

MIT

</details>
