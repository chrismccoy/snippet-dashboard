/**
 * Language Slug to File Extension Map.
 */
const languageExtensionMap = {
  // Web Development
  html: ".html",
  css: ".css",
  javascript: ".js",
  typescript: ".ts",
  php: ".php",

  // Scripting & General Purpose
  python: ".py",
  ruby: ".rb",
  bash: ".sh",
  powershell: ".ps1",
  perl: ".pl",

  // Compiled Languages
  c: ".c",
  cpp: ".cpp",
  csharp: ".cs",
  go: ".go",
  java: ".java",
  kotlin: ".kt",
  rust: ".rs",
  swift: ".swift",

  // Data & Markup
  json: ".json",
  xml: ".xml",
  yaml: ".yaml",
  markdown: ".md",
  sql: ".sql",

  // Default fallback for any other language
  plaintext: ".txt",
};

module.exports = languageExtensionMap;
