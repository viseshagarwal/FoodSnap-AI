const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const size = 512; // Base size for the logo
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, size, size);

// Draw the logo
ctx.strokeStyle = '#F97316';
ctx.lineWidth = 20;

// Plate circle
ctx.beginPath();
ctx.arc(size/2, size/2, size/2 - 30, 0, Math.PI * 2);
ctx.stroke();

// Fork
const forkX = size * 0.375;
ctx.lineWidth = 15;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Main fork line
ctx.beginPath();
ctx.moveTo(forkX, size * 0.25);
ctx.lineTo(forkX, size * 0.75);
ctx.stroke();

// Fork prongs
ctx.beginPath();
ctx.moveTo(forkX - 20, size * 0.25);
ctx.lineTo(forkX - 20, size * 0.375);
ctx.quadraticCurveTo(forkX - 20, size * 0.425, forkX, size * 0.425);
ctx.quadraticCurveTo(forkX + 20, size * 0.425, forkX + 20, size * 0.375);
ctx.lineTo(forkX + 20, size * 0.25);
ctx.stroke();

// Knife
ctx.beginPath();
ctx.moveTo(size * 0.625, size * 0.25);
ctx.quadraticCurveTo(size * 0.625, size * 0.4375, size * 0.625, size * 0.4375);
ctx.quadraticCurveTo(size * 0.625, size * 0.5625, size * 0.78125, size * 0.5625);
ctx.lineTo(size * 0.78125, size * 0.75);
ctx.stroke();

// Sparkle effects
ctx.lineWidth = 10;
const sparkleLength = 20;

// Top sparkle
ctx.beginPath();
ctx.moveTo(size/2, size * 0.125);
ctx.lineTo(size/2, size * 0.0625);
ctx.stroke();

// Right sparkle
ctx.beginPath();
ctx.moveTo(size * 0.875, size/2);
ctx.lineTo(size * 0.9375, size/2);
ctx.stroke();

// Bottom sparkle
ctx.beginPath();
ctx.moveTo(size/2, size * 0.875);
ctx.lineTo(size/2, size * 0.9375);
ctx.stroke();

// Left sparkle
ctx.beginPath();
ctx.moveTo(size * 0.125, size/2);
ctx.lineTo(size * 0.0625, size/2);
ctx.stroke();

// Diagonal sparkles
const diagonalOffset = size * 0.0625;
const diagonalStart = size * 0.25;
const diagonalEnd = size * 0.3125;

// Top-right sparkle
ctx.beginPath();
ctx.moveTo(diagonalStart + diagonalOffset, diagonalStart - diagonalOffset);
ctx.lineTo(diagonalEnd + diagonalOffset, diagonalEnd - diagonalOffset);
ctx.stroke();

// Bottom-right sparkle
ctx.beginPath();
ctx.moveTo(diagonalStart + diagonalOffset, size - diagonalStart + diagonalOffset);
ctx.lineTo(diagonalEnd + diagonalOffset, size - diagonalEnd + diagonalOffset);
ctx.stroke();

// Bottom-left sparkle
ctx.beginPath();
ctx.moveTo(size - diagonalStart - diagonalOffset, size - diagonalStart + diagonalOffset);
ctx.lineTo(size - diagonalEnd - diagonalOffset, size - diagonalEnd + diagonalOffset);
ctx.stroke();

// Top-left sparkle
ctx.beginPath();
ctx.moveTo(size - diagonalStart - diagonalOffset, diagonalStart - diagonalOffset);
ctx.lineTo(size - diagonalEnd - diagonalOffset, diagonalEnd - diagonalOffset);
ctx.stroke();

// Save the logo
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/logo.png'), buffer); 