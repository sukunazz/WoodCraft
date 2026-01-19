const commonPasswords = new Set([
  "123456",
  "12345678",
  "123456789",
  "password",
  "qwerty",
  "abc123",
  "111111",
  "letmein",
  "password1",
  "admin",
  "welcome",
  "iloveyou",
  "123123",
  "000000",
  "monkey",
  "dragon",
  "sunshine",
  "princess",
  "football",
  "baseball",
  "master",
  "shadow",
  "freedom",
  "trustno1",
  "hello123",
]);

type PasswordStrengthResult = {
  score: number;
  label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";
  hints: string[];
  isCommon: boolean;
};

const strengthLabels: PasswordStrengthResult["label"][] = [
  "Very weak",
  "Weak",
  "Fair",
  "Strong",
  "Very strong",
];

const hasLower = (value: string) => /[a-z]/.test(value);
const hasUpper = (value: string) => /[A-Z]/.test(value);
const hasNumber = (value: string) => /\d/.test(value);
const hasSymbol = (value: string) => /[^A-Za-z0-9]/.test(value);

export const getPasswordStrength = (password: string): PasswordStrengthResult => {
  const trimmed = password.trim();
  const hints: string[] = [];
  const isCommon = commonPasswords.has(trimmed.toLowerCase());

  if (!trimmed) {
    return { score: 0, label: "Very weak", hints: [], isCommon };
  }

  let score = 0;
  if (trimmed.length >= 8) score += 1;
  if (trimmed.length >= 12) score += 1;
  if (hasLower(trimmed) && hasUpper(trimmed)) score += 1;
  if (hasNumber(trimmed)) score += 1;
  if (hasSymbol(trimmed)) score += 1;

  if (trimmed.length < 8) hints.push("Use at least 8 characters");
  if (!hasLower(trimmed) || !hasUpper(trimmed)) {
    hints.push("Mix uppercase and lowercase letters");
  }
  if (!hasNumber(trimmed)) hints.push("Add at least one number");
  if (!hasSymbol(trimmed)) hints.push("Add a symbol like ! or #");
  if (isCommon) hints.push("Avoid common passwords");

  if (isCommon) {
    score = Math.min(score, 1);
  }

  const normalizedScore = Math.min(score, 4);
  const label = strengthLabels[normalizedScore];

  return {
    score: normalizedScore,
    label,
    hints,
    isCommon,
  };
};

export const isPasswordAllowed = (password: string): boolean => {
  const result = getPasswordStrength(password);
  return !result.isCommon && password.trim().length >= 8;
};
