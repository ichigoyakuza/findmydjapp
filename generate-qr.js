#!/usr/bin/env node

import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs pour lesquelles générer des QR codes
const urls = {
  local: 'http://localhost:4173',
  github: 'https://ichigoyakuza.github.io/findmydj-app',
  netlify: 'https://glittery-melomakarona-085cdf.netlify.app'
};

async function generateQRCodes() {
  console.log('🎵 Génération des QR codes pour FindMyDJ...\n');
  
  for (const [name, url] of Object.entries(urls)) {
    try {
      // Générer QR code en PNG
      const pngPath = path.join(__dirname, `qr-${name}.png`);
      await QRCode.toFile(pngPath, url, {
        width: 512,
        height: 512,
        colorDark: '#333333',
        colorLight: '#ffffff',
        margin: 2,
        errorCorrectionLevel: 'M'
      });
      
      // Générer QR code en SVG
      const svgPath = path.join(__dirname, `qr-${name}.svg`);
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: 512,
        height: 512,
        colorDark: '#333333',
        colorLight: '#ffffff',
        margin: 2,
        errorCorrectionLevel: 'M'
      });
      
      fs.writeFileSync(svgPath, svgString);
      
      console.log(`✅ QR code généré pour ${name}:`);
      console.log(`   URL: ${url}`);
      console.log(`   PNG: ${pngPath}`);
      console.log(`   SVG: ${svgPath}\n`);
      
    } catch (error) {
      console.error(`❌ Erreur pour ${name}:`, error.message);
    }
  }
  
  console.log('🎯 QR codes générés avec succès !');
}



// Exécuter si appelé directement
generateQRCodes().catch(console.error);

export { generateQRCodes, urls };