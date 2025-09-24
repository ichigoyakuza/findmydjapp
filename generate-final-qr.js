import QRCode from 'qrcode';
import fs from 'fs';

// URL publique Netlify
const publicUrl = 'https://calm-narwhal-a45d06.netlify.app';

async function generateFinalQR() {
  console.log('🎯 Génération du QR code final pour l\'URL publique...\n');
  
  try {
    // Options optimisées pour le QR code final
    const qrOptions = {
      errorCorrectionLevel: 'M',
      type: 'png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400 // Plus grand pour une meilleure lisibilité
    };
    
    // Générer PNG final
    console.log(`📱 Génération QR pour URL publique: ${publicUrl}`);
    const pngBuffer = await QRCode.toBuffer(publicUrl, qrOptions);
    fs.writeFileSync('qr-findmydj-public.png', pngBuffer);
    
    // Générer SVG final
    const svgString = await QRCode.toString(publicUrl, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 400
    });
    fs.writeFileSync('qr-findmydj-public.svg', svgString);
    
    console.log('✅ QR code final généré avec succès !');
    console.log('📁 Fichiers créés:');
    console.log('   - qr-findmydj-public.png (pour impression/partage)');
    console.log('   - qr-findmydj-public.svg (vectoriel)');
    console.log(`🌐 URL: ${publicUrl}`);
    console.log('\n🎉 Votre app FindMyDJ est maintenant accessible publiquement !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
  }
}

generateFinalQR();