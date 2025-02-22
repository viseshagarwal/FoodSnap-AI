const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

// Common configuration
const size = 512;
const mainColor = "#F97316";
const strokeWidth = size * 0.04;
const backgroundColor = "#FFFFFF";

// Generate PNG version
const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

// Set background
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, size, size);
ctx.fillStyle = "transparent";

// Common drawing functions
function drawPlate(ctx) {
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = strokeWidth;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - strokeWidth * 1.5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFork(ctx) {
  const forkX = size * 0.375;
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = strokeWidth * 0.75;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Main fork line
  ctx.beginPath();
  ctx.moveTo(forkX, size * 0.25);
  ctx.lineTo(forkX, size * 0.75);
  ctx.stroke();

  // Fork prongs
  ctx.beginPath();
  ctx.moveTo(forkX - strokeWidth, size * 0.25);
  ctx.lineTo(forkX - strokeWidth, size * 0.375);
  ctx.quadraticCurveTo(forkX - strokeWidth, size * 0.425, forkX, size * 0.425);
  ctx.quadraticCurveTo(forkX + strokeWidth, size * 0.425, forkX + strokeWidth, size * 0.375);
  ctx.lineTo(forkX + strokeWidth, size * 0.25);
  ctx.stroke();
}

function drawKnife(ctx) {
  ctx.beginPath();
  ctx.moveTo(size * 0.625, size * 0.25);
  ctx.quadraticCurveTo(size * 0.625, size * 0.4375, size * 0.625, size * 0.4375);
  ctx.quadraticCurveTo(size * 0.625, size * 0.5625, size * 0.78125, size * 0.5625);
  ctx.lineTo(size * 0.78125, size * 0.75);
  ctx.stroke();
}

function drawSparkles(ctx) {
  ctx.lineWidth = strokeWidth * 0.5;
  const sparkleLength = strokeWidth;

  // Cardinal sparkles
  [[size/2, size * 0.125, size/2, size * 0.0625], // top
   [size * 0.875, size/2, size * 0.9375, size/2], // right
   [size/2, size * 0.875, size/2, size * 0.9375], // bottom
   [size * 0.125, size/2, size * 0.0625, size/2]  // left
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Diagonal sparkles
  const diagonalOffset = size * 0.0625;
  const diagStart = size * 0.25;
  const diagEnd = size * 0.3125;

  [[diagStart + diagonalOffset, diagStart - diagonalOffset, diagEnd + diagonalOffset, diagEnd - diagonalOffset],
   [diagStart + diagonalOffset, size - diagStart + diagonalOffset, diagEnd + diagonalOffset, size - diagEnd + diagonalOffset],
   [size - diagStart - diagonalOffset, size - diagStart + diagonalOffset, size - diagEnd - diagonalOffset, size - diagEnd + diagonalOffset],
   [size - diagStart - diagonalOffset, diagStart - diagonalOffset, size - diagEnd - diagonalOffset, diagEnd - diagonalOffset]
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
}

// Draw PNG version
drawPlate(ctx);
drawFork(ctx);
drawKnife(ctx);
drawSparkles(ctx);

// Save PNG with transparent background
const buffer = canvas.toBuffer("image/png", { 
  compressionLevel: 9,
  filters: canvas.PNG_ALL_FILTERS,
  background: backgroundColor 
});
fs.writeFileSync(path.join(__dirname, "../public/logo.png"), buffer);

// Generate SVG version with explicit background and transparency
const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <style>
    svg { background: white; }
    path, circle { 
      fill: none;
      stroke: ${mainColor};
      stroke-opacity: 1;
    }
  </style>
  <rect width="100%" height="100%" fill="white"/>
  <circle 
    cx="${size/2}" 
    cy="${size/2}" 
    r="${size/2 - strokeWidth * 1.5}" 
    stroke-width="${strokeWidth}"
  />
  
  <!-- Fork -->
  <path 
    d="M${size * 0.375} ${size * 0.25}L${size * 0.375} ${size * 0.75}M${size * 0.375 - strokeWidth} ${size * 0.25}L${size * 0.375 - strokeWidth} ${size * 0.375}Q${size * 0.375 - strokeWidth} ${size * 0.425} ${size * 0.375} ${size * 0.425}Q${size * 0.375 + strokeWidth} ${size * 0.425} ${size * 0.375 + strokeWidth} ${size * 0.375}L${size * 0.375 + strokeWidth} ${size * 0.25}"
    stroke-width="${strokeWidth * 0.75}"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  
  <!-- Knife -->
  <path 
    d="M${size * 0.625} ${size * 0.25}Q${size * 0.625} ${size * 0.4375} ${size * 0.625} ${size * 0.4375}Q${size * 0.625} ${size * 0.5625} ${size * 0.78125} ${size * 0.5625}L${size * 0.78125} ${size * 0.75}"
    stroke-width="${strokeWidth * 0.75}"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  
  <!-- Sparkles -->
  ${[
    `M${size/2} ${size * 0.125}L${size/2} ${size * 0.0625}`,
    `M${size * 0.875} ${size/2}L${size * 0.9375} ${size/2}`,
    `M${size/2} ${size * 0.875}L${size/2} ${size * 0.9375}`,
    `M${size * 0.125} ${size/2}L${size * 0.0625} ${size/2}`
  ].map(d => `<path d="${d}" stroke-width="${strokeWidth * 0.5}" stroke-linecap="round"/>`).join('\n  ')}
  
  <!-- Diagonal Sparkles -->
  ${[
    `M${size * 0.25 + size * 0.0625} ${size * 0.25 - size * 0.0625}L${size * 0.3125 + size * 0.0625} ${size * 0.3125 - size * 0.0625}`,
    `M${size * 0.25 + size * 0.0625} ${size - size * 0.25 + size * 0.0625}L${size * 0.3125 + size * 0.0625} ${size - size * 0.3125 + size * 0.0625}`,
    `M${size - size * 0.25 - size * 0.0625} ${size - size * 0.25 + size * 0.0625}L${size - size * 0.3125 - size * 0.0625} ${size - size * 0.3125 + size * 0.0625}`,
    `M${size - size * 0.25 - size * 0.0625} ${size * 0.25 - size * 0.0625}L${size - size * 0.3125 - size * 0.0625} ${size * 0.3125 - size * 0.0625}`
  ].map(d => `<path d="${d}" stroke-width="${strokeWidth * 0.5}" stroke-linecap="round"/>`).join('\n  ')}
</svg>`;

fs.writeFileSync(path.join(__dirname, "../public/favicon.svg"), svgContent);
