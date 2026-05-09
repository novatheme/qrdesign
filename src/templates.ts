import { QRStyle } from "./types";

export const templates: (QRStyle & { name: string })[] = [
  {
    name: "Classic Blue",
    dotsType: "square",
    dotsColor: "#2563eb",
    backgroundColor: "#ffffff",
    cornersSquareType: "square",
    cornersSquareColor: "#1e40af",
    cornersDotType: "square",
    cornersDotColor: "#1e40af"
  },
  {
    name: "Modern Emerald",
    dotsType: "rounded",
    dotsColor: "#059669",
    backgroundColor: "#ffffff",
    cornersSquareType: "extra-rounded",
    cornersSquareColor: "#065f46",
    cornersDotType: "dot",
    cornersDotColor: "#065f46"
  },
  {
    name: "Elegant Black",
    dotsType: "classy",
    dotsColor: "#1a1a1a",
    backgroundColor: "#ffffff",
    cornersSquareType: "square",
    cornersSquareColor: "#000000",
    cornersDotType: "square",
    cornersDotColor: "#000000"
  },
  {
    name: "Sunset Orange",
    dotsType: "dots",
    dotsColor: "#ea580c",
    backgroundColor: "#fff7ed",
    cornersSquareType: "dot",
    cornersSquareColor: "#9a3412",
    cornersDotType: "dot",
    cornersDotColor: "#9a3412"
  },
  {
    name: "Royal Purple",
    dotsType: "extra-rounded",
    dotsColor: "#7c3aed",
    backgroundColor: "#ffffff",
    cornersSquareType: "extra-rounded",
    cornersSquareColor: "#5b21b6",
    cornersDotType: "dot",
    cornersDotColor: "#5b21b6"
  },
  {
    name: "Cyberpunk",
    dotsType: "classy-rounded",
    dotsColor: "#f0abfc",
    backgroundColor: "#000000",
    cornersSquareType: "dot",
    cornersSquareColor: "#e879f9",
    cornersDotType: "dot",
    cornersDotColor: "#ff00ff"
  },
  {
    name: "Soft Pink",
    dotsType: "rounded",
    dotsColor: "#db2777",
    backgroundColor: "#fdf2f8",
    cornersSquareType: "extra-rounded",
    cornersSquareColor: "#9d174d",
    cornersDotType: "dot",
    cornersDotColor: "#9d174d"
  },
  {
    name: "Ocean Teal",
    dotsType: "classy",
    dotsColor: "#0d9488",
    backgroundColor: "#f0fdfa",
    cornersSquareType: "square",
    cornersSquareColor: "#115e59",
    cornersDotType: "square",
    cornersDotColor: "#115e59"
  },
  {
    name: "Coffee Brown",
    dotsType: "dots",
    dotsColor: "#78350f",
    backgroundColor: "#fffbeb",
    cornersSquareType: "dot",
    cornersSquareColor: "#451a03",
    cornersDotType: "dot",
    cornersDotColor: "#451a03"
  },
  {
    name: "Gold & White",
    dotsType: "classy-rounded",
    dotsColor: "#b45309",
    backgroundColor: "#ffffff",
    cornersSquareType: "extra-rounded",
    cornersSquareColor: "#92400e",
    cornersDotType: "dot",
    cornersDotColor: "#92400e"
  },
  // Adding more to reach 30
  { name: "Template 11", dotsType: "square", dotsColor: "#334155", backgroundColor: "#f8fafc", cornersSquareType: "square", cornersSquareColor: "#1e293b", cornersDotType: "square", cornersDotColor: "#1e293b" },
  { name: "Template 12", dotsType: "rounded", dotsColor: "#4f46e5", backgroundColor: "#eef2ff", cornersSquareType: "extra-rounded", cornersSquareColor: "#3730a3", cornersDotType: "dot", cornersDotColor: "#3730a3" },
  { name: "Template 13", dotsType: "dots", dotsColor: "#be123c", backgroundColor: "#fff1f2", cornersSquareType: "dot", cornersSquareColor: "#9f1239", cornersDotType: "dot", cornersDotColor: "#9f1239" },
  { name: "Template 14", dotsType: "classy-rounded", dotsColor: "#0369a1", backgroundColor: "#f0f9ff", cornersSquareType: "extra-rounded", cornersSquareColor: "#075985", cornersDotType: "dot", cornersDotColor: "#075985" },
  { name: "Template 15", dotsType: "extra-rounded", dotsColor: "#166534", backgroundColor: "#f0fdf4", cornersSquareType: "extra-rounded", cornersSquareColor: "#14532d", cornersDotType: "dot", cornersDotColor: "#14532d" },
  { name: "Template 16", dotsType: "square", dotsColor: "#7c2d12", backgroundColor: "#fff7ed", cornersSquareType: "square", cornersSquareColor: "#431407", cornersDotType: "square", cornersDotColor: "#431407" },
  { name: "Template 17", dotsType: "rounded", dotsColor: "#4338ca", backgroundColor: "#e0e7ff", cornersSquareType: "extra-rounded", cornersSquareColor: "#312e81", cornersDotType: "dot", cornersDotColor: "#312e81" },
  { name: "Template 18", dotsType: "classy", dotsColor: "#a21caf", backgroundColor: "#fdf4ff", cornersSquareType: "square", cornersSquareColor: "#701a75", cornersDotType: "square", cornersDotColor: "#701a75" },
  { name: "Template 19", dotsType: "dots", dotsColor: "#155e75", backgroundColor: "#ecfeff", cornersSquareType: "dot", cornersSquareColor: "#164e63", cornersDotType: "dot", cornersDotColor: "#164e63" },
  { name: "Template 20", dotsType: "classy-rounded", dotsColor: "#c2410c", backgroundColor: "#fff7ed", cornersSquareType: "extra-rounded", cornersSquareColor: "#7c2d12", cornersDotType: "dot", cornersDotColor: "#7c2d12" },
  { name: "Template 21", dotsType: "square", dotsColor: "#a21caf", backgroundColor: "#fdf4ff", cornersSquareType: "square", cornersSquareColor: "#701a75", cornersDotType: "square", cornersDotColor: "#701a75" },
  { name: "Template 22", dotsType: "rounded", dotsColor: "#b91c1c", backgroundColor: "#fef2f2", cornersSquareType: "extra-rounded", cornersSquareColor: "#7f1d1d", cornersDotType: "dot", cornersDotColor: "#7f1d1d" },
  { name: "Template 23", dotsType: "dots", dotsColor: "#0e7490", backgroundColor: "#ecfeff", cornersSquareType: "dot", cornersSquareColor: "#164e63", cornersDotType: "dot", cornersDotColor: "#164e63" },
  { name: "Template 24", dotsType: "classy", dotsColor: "#1d4ed8", backgroundColor: "#eff6ff", cornersSquareType: "square", cornersSquareColor: "#1e40af", cornersDotType: "square", cornersDotColor: "#1e40af" },
  { name: "Template 25", dotsType: "extra-rounded", dotsColor: "#047857", backgroundColor: "#ecfdf5", cornersSquareType: "extra-rounded", cornersSquareColor: "#065f46", cornersDotType: "dot", cornersDotColor: "#065f46" },
  { name: "Template 26", dotsType: "square", dotsColor: "#334155", backgroundColor: "#ffffff", cornersSquareType: "square", cornersSquareColor: "#000000", cornersDotType: "square", cornersDotColor: "#000000" },
  { name: "Template 27", dotsType: "rounded", dotsColor: "#2563eb", backgroundColor: "#eff6ff", cornersSquareType: "extra-rounded", cornersSquareColor: "#1e40af", cornersDotType: "dot", cornersDotColor: "#1e40af" },
  { name: "Template 28", dotsType: "dots", dotsColor: "#db2777", backgroundColor: "#fdf2f8", cornersSquareType: "dot", cornersSquareColor: "#9d174d", cornersDotType: "dot", cornersDotColor: "#9d174d" },
  { name: "Template 29", dotsType: "classy-rounded", dotsColor: "#d946ef", backgroundColor: "#fdf4ff", cornersSquareType: "extra-rounded", cornersSquareColor: "#86198f", cornersDotType: "dot", cornersDotColor: "#86198f" },
  { name: "Template 30", dotsType: "extra-rounded", dotsColor: "#14b8a6", backgroundColor: "#f0fdfa", cornersSquareType: "extra-rounded", cornersSquareColor: "#0d9488", cornersDotType: "dot", cornersDotColor: "#0d9488" },
];
