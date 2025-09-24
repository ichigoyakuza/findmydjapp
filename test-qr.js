import QRCode from 'qrcode';
import fs from 'fs';

// URLs à tester
const urls = {
  local: 'http://localhost:4173',
  network: 'http://10.210.252.158:4173',
  github: 'https://djichigo.github.io/FindMyDj-app/',
  netlify: 'https://findmydj.netlify.app'
};

async function testAndGenerateQR() {
  console.log('🔍 Test et génération des QR codes...\n');
  
  for (const [name, url] of Object.entries(urls)) {
    try {
      console.log(`📱 Génération QR pour ${name}: ${url}`);
      
      // Générer QR code avec options optimisées
      const qrOptions = {
        errorCorrectionLevel: 'M',
        type: 'png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      };
      
      // Générer PNG
      const pngBuffer = await QRCode.toBuffer(url, qrOptions);
      fs.writeFileSync(`qr-${name}-test.png`, pngBuffer);
      
      // Générer SVG
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 300
      });
      fs.writeFileSync(`qr-${name}-test.svg`, svgString);
      
      console.log(`✅ QR généré: qr-${name}-test.png et qr-${name}-test.svg`);
      console.log(`   URL encodée: ${url}\n`);
      
    } catch (error) {
      console.error(`❌ Erreur pour ${name}:`, error.message);
    }
  }
  
  // Créer un QR code de test simple
  console.log('🧪 Création d\'un QR code de test simple...');
  try {
    const testUrl = 'https://google.com';
    await QRCode.toFile('qr-test-google.png', testUrl, {
      errorCorrectionLevel: 'M',
      width: 300
    });
    console.log('✅ QR code de test créé: qr-test-google.png');
    console.log(`   URL de test: ${testUrl}`);
  } catch (error) {
    console.error('❌ Erreur QR test:', error.message);
  }
}

testAndGenerateQR().catch(console.error);