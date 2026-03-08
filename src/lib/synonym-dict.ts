// Rule-based synonym replacement dictionary
// These replacements are applied AFTER AI rewriting to break token predictability patterns
// Key: word to find (lowercase), Value: array of possible replacements

const SYNONYM_MAP: Record<string, string[]> = {
  // Common words → varied synonyms (bidirectional diversity)
  "important": ["significant", "crucial", "key", "vital", "critical", "essential"],
  "helps": ["assists", "enables", "supports", "aids", "facilitates"],
  "help": ["assist", "enable", "support", "aid"],
  "helped": ["assisted", "enabled", "supported", "aided"],
  "helping": ["assisting", "enabling", "supporting", "aiding"],
  "use": ["employ", "utilize", "apply", "adopt", "rely on"],
  "uses": ["employs", "utilizes", "applies", "adopts", "relies on"],
  "used": ["employed", "utilized", "applied", "adopted", "relied on"],
  "using": ["employing", "utilizing", "applying", "adopting"],
  "good": ["effective", "efficient", "proper", "solid", "strong"],
  "shows": ["demonstrates", "indicates", "reveals", "highlights", "illustrates"],
  "show": ["demonstrate", "indicate", "reveal", "highlight", "illustrate"],
  "showed": ["demonstrated", "indicated", "revealed", "highlighted"],
  "showing": ["demonstrating", "indicating", "revealing", "highlighting"],
  "problems": ["issues", "challenges", "difficulties", "obstacles", "concerns"],
  "problem": ["issue", "challenge", "difficulty", "obstacle", "concern"],
  "people": ["individuals", "citizens", "persons", "members", "residents"],
  "company": ["firm", "organization", "enterprise", "business", "corporation"],
  "companies": ["firms", "organizations", "enterprises", "businesses", "corporations"],
  "cooperation": ["collaboration", "partnership", "teamwork", "joint effort"],
  "global": ["international", "worldwide", "cross-border", "transnational"],
  "improve": ["enhance", "strengthen", "boost", "upgrade"],
  "improves": ["enhances", "strengthens", "boosts", "upgrades"],
  "improved": ["enhanced", "strengthened", "boosted", "upgraded"],
  "improving": ["enhancing", "strengthening", "boosting", "upgrading"],
  "may": ["might", "could", "can"],
  // AI-favorite formal words → casual alternatives
  "significant": ["notable", "major", "big", "considerable", "meaningful", "substantial"],
  "significantly": ["greatly", "a lot", "considerably", "noticeably", "much"],
  "demonstrate": ["show", "reveal", "point to", "make clear", "display"],
  "demonstrates": ["shows", "reveals", "points to", "makes clear", "displays"],
  "demonstrated": ["showed", "revealed", "pointed to", "made clear"],
  "indicating": ["showing", "pointing to", "suggesting", "hinting"],
  "indicates": ["shows", "suggests", "points to", "hints at"],
  "indicate": ["show", "suggest", "point to", "hint at"],
  "particularly": ["especially", "mainly", "above all", "in particular"],
  "consequently": ["so", "as a result", "because of this", "therefore"],
  "additionally": ["also", "plus", "on top of that", "besides"],
  "subsequently": ["then", "later", "after that", "next"],
  "approximately": ["about", "around", "roughly", "close to"],
  "numerous": ["many", "a lot of", "plenty of", "quite a few"],
  "various": ["different", "several", "a range of", "many"],
  "regarding": ["about", "on", "when it comes to", "as for"],
  "concerning": ["about", "around", "related to", "on"],
  "therefore": ["so", "thus", "because of this", "for this reason"],
  "however": ["but", "still", "yet", "that said", "even so"],
  "nevertheless": ["still", "yet", "even so", "but"],
  "although": ["though", "even though", "while", "even if"],
  "furthermore": ["also", "plus", "besides", "on top of that"],
  "moreover": ["also", "plus", "what's more", "besides"],
  "comprehensive": ["full", "complete", "thorough", "wide-ranging"],
  "implement": ["put in place", "carry out", "set up", "apply"],
  "implemented": ["put in place", "carried out", "set up", "applied"],
  "implementation": ["rollout", "setup", "execution", "application"],
  "utilize": ["use", "make use of", "apply", "draw on"],
  "utilizes": ["uses", "makes use of", "applies", "draws on"],
  "utilized": ["used", "made use of", "applied", "drew on"],
  "facilitate": ["help", "support", "enable", "make easier"],
  "facilitates": ["helps", "supports", "enables", "makes easier"],
  "individuals": ["people", "persons", "those", "folks"],
  "insufficient": ["not enough", "lacking", "too little"],
  "methodology": ["method", "approach", "technique", "way"],
  "methodologies": ["methods", "approaches", "techniques", "ways"],
  "characteristic": ["feature", "trait", "quality", "aspect"],
  "characteristics": ["features", "traits", "qualities", "aspects"],
  "predominantly": ["mostly", "mainly", "largely", "chiefly"],
  "contribute": ["add to", "help with", "play a part in", "support"],
  "contributes": ["adds to", "helps with", "plays a part in", "supports"],
  "contribution": ["role", "part", "input", "addition"],
  "contributions": ["roles", "parts", "inputs", "additions"],
  "establish": ["set up", "create", "build", "form"],
  "established": ["set up", "created", "built", "formed"],
  "potential": ["possible", "likely", "would-be"],
  "potentially": ["possibly", "maybe", "perhaps"],
  "enhance": ["improve", "boost", "strengthen", "lift"],
  "enhanced": ["improved", "boosted", "strengthened"],
  "enhancement": ["improvement", "boost", "upgrade"],
  "determine": ["find out", "figure out", "decide", "work out"],
  "determined": ["found", "figured out", "decided", "worked out"],
  "acquire": ["get", "gain", "pick up", "obtain"],
  "acquired": ["got", "gained", "picked up", "obtained"],
  "maintain": ["keep", "hold", "preserve", "sustain"],
  "maintained": ["kept", "held", "preserved", "sustained"],
  "obtain": ["get", "gain", "secure", "pick up"],
  "obtained": ["got", "gained", "secured", "picked up"],
  "possess": ["have", "hold", "carry", "own"],
  "possesses": ["has", "holds", "carries", "owns"],
  "require": ["need", "call for", "demand"],
  "requires": ["needs", "calls for", "demands"],
  "required": ["needed", "called for", "demanded"],
  "examine": ["look at", "study", "check", "review"],
  "examined": ["looked at", "studied", "checked", "reviewed"],
  "sufficient": ["enough", "adequate", "ample"],
  "exhibit": ["show", "display", "present"],
  "exhibits": ["shows", "displays", "presents"],
  "exhibited": ["showed", "displayed", "presented"],
  "commence": ["start", "begin", "kick off"],
  "commenced": ["started", "began", "kicked off"],
  "terminate": ["end", "stop", "finish", "wrap up"],
  "terminated": ["ended", "stopped", "finished"],
  "endeavor": ["try", "effort", "attempt"],
  "endeavors": ["tries", "efforts", "attempts"],
  "constitute": ["make up", "form", "represent"],
  "constitutes": ["makes up", "forms", "represents"],
  "fundamental": ["basic", "key", "central", "core"],
  "substantial": ["large", "big", "major", "considerable"],
  "evident": ["clear", "obvious", "plain", "apparent"],
  "prior": ["before", "earlier", "previous"],
  "subsequent": ["later", "following", "next"],
  "preceding": ["earlier", "previous", "before"],
  "pertinent": ["relevant", "related", "applicable"],
  "perceive": ["see", "view", "notice", "sense"],
  "perceived": ["seen", "viewed", "noticed", "sensed"],
  "in order to": ["to", "so as to", "for"],
  "due to the fact that": ["because", "since", "as"],
  "it is important to note that": ["notably", "importantly"],
  "it should be noted that": ["note that", "keep in mind that"],
  "in the context of": ["in", "within", "for", "when it comes to"],
  "with respect to": ["about", "for", "regarding"],
  "a large number of": ["many", "lots of", "plenty of"],
  "a significant number of": ["many", "quite a few", "a good number of"],
  "in addition to": ["besides", "along with", "as well as"],
  "on the other hand": ["but", "then again", "alternatively"],
  "as a result of": ["because of", "due to", "from"],
  "in terms of": ["for", "regarding", "when it comes to"],
  "is able to": ["can"],
  "are able to": ["can"],
  "was able to": ["could", "managed to"],
  "it is worth noting": ["notably", "it's worth noting"],
  "plays a role": ["matters", "helps", "counts"],
  "plays an important role": ["matters a lot", "is key", "is important"],
};

// Words to convert to contractions
const CONTRACTION_MAP: Record<string, string> = {
  "do not": "don't",
  "does not": "doesn't",
  "did not": "didn't",
  "is not": "isn't",
  "are not": "aren't",
  "was not": "wasn't",
  "were not": "weren't",
  "will not": "won't",
  "would not": "wouldn't",
  "could not": "couldn't",
  "should not": "shouldn't",
  "cannot": "can't",
  "can not": "can't",
  "it is": "it's",
  "it has": "it's",
  "that is": "that's",
  "there is": "there's",
  "there are": "there're",
  "they are": "they're",
  "they have": "they've",
  "we are": "we're",
  "we have": "we've",
  "you are": "you're",
  "I am": "I'm",
  "I have": "I've",
  "I would": "I'd",
  "I will": "I'll",
  "he is": "he's",
  "she is": "she's",
  "who is": "who's",
  "what is": "what's",
  "let us": "let's",
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Apply contractions
function applyContractions(text: string): string {
  let result = text;
  // Sort by length (longest first) to avoid partial matches
  const sorted = Object.entries(CONTRACTION_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [full, contracted] of sorted) {
    const regex = new RegExp(`\\b${full}\\b`, "gi");
    result = result.replace(regex, (match) => {
      // Preserve capitalization of first letter
      if (match[0] === match[0].toUpperCase()) {
        return contracted[0].toUpperCase() + contracted.slice(1);
      }
      return contracted;
    });
  }
  return result;
}

// Apply synonym replacements (randomly replace ~40% of matches to avoid over-substitution)
function applySynonyms(text: string, replacementRate: number = 0.4): string {
  let result = text;
  // Sort by phrase length (longest first) for multi-word phrases
  const sorted = Object.entries(SYNONYM_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [word, synonyms] of sorted) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, (match) => {
      if (Math.random() > replacementRate) return match;
      const replacement = getRandomItem(synonyms);
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return replacement[0].toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }
  return result;
}

/**
 * Post-process AI-rewritten text with rule-based transformations.
 * This breaks token predictability patterns because replacements
 * are deterministic/random, NOT generated by the AI model.
 */
export function postProcessText(text: string, intensity: "light" | "medium" | "deep"): string {
  const rate = intensity === "deep" ? 1.0 : intensity === "medium" ? 0.35 : 0.2;
  return applySynonyms(text, rate);
}
