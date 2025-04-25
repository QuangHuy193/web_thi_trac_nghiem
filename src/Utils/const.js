const EMAILREGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex kiểm tra email chuẩn

const SPECIAL_CHAR = [
  "∞",
  "π",
  "√",
  "∑",
  "±",
  "≠",
  "≈",
  "∆",
  "∫",
  "λ",
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "φ",
  "θ",
  "σ",
  "τ",
  "χ",
  "Ω",
];

const TOP_INDEX = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

const BOTTOM_INDEX = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

export { EMAILREGEX, SPECIAL_CHAR, TOP_INDEX, BOTTOM_INDEX };
