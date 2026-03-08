// Heuristic-based AI detection analyzer
// Checks text features that correlate with AI-generated content
// Does NOT use an AI model — pure code analysis

const AI_SIGNATURE_WORDS = new Set([
  "delve", "crucial", "leverage", "utilize", "facilitate", "comprehensive",
  "robust", "streamline", "moreover", "furthermore", "multifaceted", "pivotal",
  "paradigm", "underscore", "navigate", "landscape", "tapestry", "nuanced",
  "intricate", "notably", "significantly", "essentially", "fundamentally",
  "overarching", "commendable", "meticulous", "aforementioned", "holistic",
  "testament", "embark", "encompasses", "interplay", "spearhead", "cornerstone",
  "burgeoning", "foster", "realm", "shed", "underpinning",
]);

const AI_PHRASES = [
  "it is important to note",
  "in today's world",
  "it is worth noting",
  "plays a crucial role",
  "in the realm of",
  "a myriad of",
  "in light of",
  "serves as",
  "it can be argued",
  "this highlights",
  "this underscores",
  "it should be noted",
  "in conclusion",
  "to summarize",
  "in summary",
  "firstly",
  "secondly",
  "thirdly",
  "in order to",
  "due to the fact",
  "it is evident",
  "has significant implications",
  "the results demonstrate",
  "this phenomenon",
  "can be attributed to",
  "plays an important role",
  "a significant number",
  "on the other hand",
  "with respect to",
  "pertaining to",
  "in terms of",
  "it is essential",
  "a growing body of",
  "shed light on",
  "pave the way",
  "an ever-evolving",
];

const CONTRACTIONS = [
  "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't",
  "won't", "wouldn't", "couldn't", "shouldn't", "can't", "it's", "that's",
  "there's", "they're", "they've", "we're", "we've", "you're", "i'm",
  "i've", "i'd", "i'll", "he's", "she's", "who's", "what's", "let's",
  "here's",
];

interface DetectionResult {
  aiRate: number;
  breakdown: {
    vocabulary: number;
    structure: number;
    flow: number;
    voice: number;
  };
}

export function analyzeText(text: string): DetectionResult {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  // 1. VOCABULARY SCORE (0-100, lower = more human)
  // Check AI signature words
  let aiWordCount = 0;
  for (const word of words) {
    if (AI_SIGNATURE_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""))) {
      aiWordCount++;
    }
  }
  const aiWordRate = aiWordCount / wordCount;

  // Check AI phrases
  let aiPhraseCount = 0;
  for (const phrase of AI_PHRASES) {
    const regex = new RegExp(phrase, "gi");
    const matches = lower.match(regex);
    if (matches) aiPhraseCount += matches.length;
  }
  const aiPhraseRate = aiPhraseCount / sentenceCount;

  // Check vocabulary diversity (unique words / total words)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z']/g, "")));
  const vocabDiversity = uniqueWords.size / wordCount;

  let vocabScore = 30; // baseline
  vocabScore += aiWordRate * 500; // penalize AI words heavily
  vocabScore += aiPhraseRate * 200; // penalize AI phrases
  vocabScore -= (vocabDiversity - 0.4) * 100; // reward vocabulary diversity
  vocabScore = Math.max(0, Math.min(100, vocabScore));

  // 2. STRUCTURE SCORE (0-100)
  // Sentence length variation — humans write with high variance
  const sentLengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avgSentLength = sentLengths.reduce((a, b) => a + b, 0) / sentenceCount;
  const sentLengthVariance =
    sentLengths.reduce((sum, len) => sum + Math.pow(len - avgSentLength, 2), 0) / sentenceCount;
  const sentLengthStdDev = Math.sqrt(sentLengthVariance);
  const coeffOfVariation = sentLengthStdDev / Math.max(avgSentLength, 1);

  // Check for consecutive sentences of similar length (AI pattern)
  let similarLengthRuns = 0;
  for (let i = 1; i < sentLengths.length; i++) {
    const diff = Math.abs(sentLengths[i] - sentLengths[i - 1]);
    if (diff <= 3) similarLengthRuns++;
  }
  const similarRate = similarLengthRuns / Math.max(sentLengths.length - 1, 1);

  let structScore = 40;
  structScore -= coeffOfVariation * 50; // reward high variation
  structScore += similarRate * 40; // penalize similar consecutive lengths
  structScore = Math.max(0, Math.min(100, structScore));

  // 3. FLOW SCORE (0-100)
  // Paragraph length variation
  const paraLengths = paragraphs.map((p) => p.split(/\s+/).length);
  const avgParaLength = paraLengths.reduce((a, b) => a + b, 0) / Math.max(paragraphs.length, 1);
  const paraVariance =
    paraLengths.reduce((sum, len) => sum + Math.pow(len - avgParaLength, 2), 0) /
    Math.max(paragraphs.length, 1);
  const paraCV = Math.sqrt(paraVariance) / Math.max(avgParaLength, 1);

  // Check for formulaic transitions at paragraph starts
  let formulaicStarts = 0;
  for (const para of paragraphs) {
    const firstWords = para.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase();
    if (
      firstWords.startsWith("furthermore") ||
      firstWords.startsWith("moreover") ||
      firstWords.startsWith("additionally") ||
      firstWords.startsWith("in conclusion") ||
      firstWords.startsWith("in summary") ||
      firstWords.startsWith("to summarize") ||
      firstWords.startsWith("firstly") ||
      firstWords.startsWith("secondly")
    ) {
      formulaicStarts++;
    }
  }

  let flowScore = 35;
  flowScore -= paraCV * 30; // reward paragraph length variation
  flowScore += (formulaicStarts / Math.max(paragraphs.length, 1)) * 60; // penalize formulaic
  flowScore = Math.max(0, Math.min(100, flowScore));

  // 4. VOICE SCORE (0-100)
  // Check contraction usage — humans use lots of contractions
  let contractionCount = 0;
  for (const c of CONTRACTIONS) {
    const regex = new RegExp(`\\b${c.replace("'", "'")}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) contractionCount += matches.length;
  }
  // Also count apostrophe contractions
  const apostropheContractions = (text.match(/\w+['\']\w+/g) || []).length;
  contractionCount = Math.max(contractionCount, apostropheContractions);
  const contractionRate = contractionCount / sentenceCount;

  // Check for "do not" / "is not" / "it is" (expanded forms = AI signal)
  const expandedForms = (
    lower.match(/\b(do not|does not|did not|is not|are not|was not|were not|will not|would not|could not|should not|cannot|it is|there is|they are|we are)\b/g) || []
  ).length;
  const expandedRate = expandedForms / sentenceCount;

  // Check for personal voice markers
  const personalMarkers = (
    lower.match(/\b(i think|i believe|in my view|in my opinion|honestly|to be fair|i'd argue|if you ask me|i feel|i guess|i suppose)\b/g) || []
  ).length;
  const personalRate = personalMarkers / sentenceCount;

  // Check sentences starting with conjunctions (But, And, So — human pattern)
  let conjunctionStarts = 0;
  for (const sent of sentences) {
    const firstWord = sent.trim().split(/\s+/)[0]?.toLowerCase();
    if (["but", "and", "so", "yet", "or", "still", "plus"].includes(firstWord || "")) {
      conjunctionStarts++;
    }
  }
  const conjStartRate = conjunctionStarts / sentenceCount;

  let voiceScore = 50;
  voiceScore -= contractionRate * 25; // reward contractions
  voiceScore += expandedRate * 30; // penalize expanded forms
  voiceScore -= personalRate * 40; // reward personal voice
  voiceScore -= conjStartRate * 30; // reward conjunction starts
  voiceScore = Math.max(0, Math.min(100, voiceScore));

  // Overall AI rate — weighted average
  const aiRate = Math.round(
    vocabScore * 0.3 + structScore * 0.25 + flowScore * 0.2 + voiceScore * 0.25
  );

  return {
    aiRate: Math.max(0, Math.min(100, aiRate)),
    breakdown: {
      vocabulary: Math.round(vocabScore),
      structure: Math.round(structScore),
      flow: Math.round(flowScore),
      voice: Math.round(voiceScore),
    },
  };
}
