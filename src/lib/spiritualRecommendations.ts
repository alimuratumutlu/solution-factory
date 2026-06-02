import spiritualCatalog from "../../data/spiritual-practices.json";

export type PracticeType = "Esma" | "Dua" | "Dhikr";
export type SpiritualSupportMode = "off" | "gentle" | "integrated";

export type SpiritualSupportSettingsInput = {
  allowAiSuggestions: boolean;
  allowedTypes: PracticeType[];
  createReminders: boolean;
  enabled: boolean;
  mode: SpiritualSupportMode;
  preferredTimes: string[];
  showInSolutionMap: boolean;
};

type SpiritualPractice = {
  id: string;
  type: PracticeType;
  label: string;
  displayText: string;
  transliteration: string;
  category?: string;
  intentions: string[];
  schedule: {
    days: string[];
    timingLabel: string;
    frequency?: string;
    count: number;
    timeOfDay: string | null;
  };
  source: {
    origin: "catalog" | "user_defined" | "ai_suggested";
    project: string;
    path: string;
    sourceId?: string;
    reviewStatus:
      | "needs_religious_review"
      | "reviewed"
      | "rejected"
      | "user_defined"
      | "ai_suggested";
  };
};

export type SpiritualRecommendation = {
  id: string;
  type: "spiritual";
  practiceType: PracticeType;
  label: string;
  displayText: string;
  transliteration: string;
  matchedIntentions: string[];
  optional: true;
  reason: string;
  renderAs: "support_panel" | "spiritual_support_node";
  schedule: SpiritualPractice["schedule"];
  source: SpiritualPractice["source"];
};

type RecommendationInput = {
  limit?: number;
  settings: SpiritualSupportSettingsInput;
  text: string;
};

const practices = spiritualCatalog.practices as SpiritualPractice[];

const intentionKeywords: Record<string, string[]> = {
  aile: ["aile", "family", "parent", "child", "children", "evlilik", "marriage"],
  başarı: ["basari", "success", "career", "job", "role", "portfolio", "work", "proje", "project"],
  bereket: ["bereket", "abundance", "income", "money", "finance", "gelir", "para"],
  güç: ["guc", "strength", "energy", "confidence", "power", "irade", "discipline"],
  huzur: ["huzur", "peace", "calm", "stress", "anxiety", "overwhelm", "burnout", "sakin"],
  ilim: ["ilim", "learn", "study", "education", "skill", "knowledge", "egitim", "ögren"],
  iman: ["iman", "faith", "meaning", "purpose", "deger", "values"],
  itibar: ["itibar", "reputation", "credibility", "visible", "proof", "public", "status"],
  kazanç: ["kazanc", "income", "business", "revenue", "earning", "rızık", "rizik"],
  korunma: ["korunma", "protect", "risk", "fear", "safety", "guard", "avoid"],
  muhabbet: ["muhabbet", "love", "relation", "relationship", "connection", "communication"],
  sabır: ["sabir", "patience", "consistency", "stuck", "hard", "difficult", "waiting"],
  şifa: ["sifa", "health", "heal", "recovery", "weight", "muscle", "body", "sleep"],
  şükür: ["sukur", "gratitude", "thank", "appreciation"],
  tevbe: ["tevbe", "repent", "regret", "reset", "forgive", "forgiveness"],
};

const normalizedIntentionByAscii = new Map(
  Object.keys(intentionKeywords).map((intention) => [normalizeText(intention), intention]),
);

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/â/g, "a")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

function normalizeIntention(value: string) {
  return normalizedIntentionByAscii.get(normalizeText(value)) ?? value;
}

export function extractSpiritualIntentions(text: string) {
  const normalized = normalizeText(text);
  const matches = Object.entries(intentionKeywords)
    .filter(([intention, keywords]) =>
      keywords.some((keyword) => normalized.includes(normalizeText(keyword))) ||
      normalized.includes(normalizeText(intention)),
    )
    .map(([intention]) => intention);

  return Array.from(new Set(matches));
}

export function recommendSpiritualPractices({
  limit = 3,
  settings,
  text,
}: RecommendationInput): SpiritualRecommendation[] {
  if (
    !settings.enabled ||
    settings.mode === "off" ||
    !settings.allowAiSuggestions ||
    settings.allowedTypes.length === 0
  ) {
    return [];
  }

  const extractedIntentions = extractSpiritualIntentions(text);
  if (extractedIntentions.length === 0) {
    return [];
  }

  const preferredTime = settings.preferredTimes[0] ?? null;
  const allowedTypes = new Set(settings.allowedTypes);

  return practices
    .filter((practice) => allowedTypes.has(practice.type))
    .map((practice) => {
      const matchedIntentions = practice.intentions
        .map(normalizeIntention)
        .filter((intention) => extractedIntentions.includes(intention));
      return { matchedIntentions, practice, score: matchedIntentions.length };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.practice.type !== right.practice.type) {
        return left.practice.type.localeCompare(right.practice.type);
      }
      return left.practice.id.localeCompare(right.practice.id);
    })
    .slice(0, limit)
    .map(({ matchedIntentions, practice }) => ({
      id: `spiritual_${practice.id}`,
      type: "spiritual",
      practiceType: practice.type,
      label: practice.label,
      displayText: practice.displayText,
      transliteration: practice.transliteration,
      matchedIntentions,
      optional: true,
      reason: `Matched ${matchedIntentions.join(", ")} in the confirmed context. This is optional reflective support and does not replace practical action steps.`,
      renderAs:
        settings.mode === "integrated" && settings.showInSolutionMap
          ? "spiritual_support_node"
          : "support_panel",
      schedule: {
        ...practice.schedule,
        timeOfDay: practice.schedule.timeOfDay ?? preferredTime,
      },
      source: practice.source,
    }));
}
