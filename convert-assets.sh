#!/bin/bash

# 🎨 Script de Conversion Assets pour Google Play Store
# Convertit les SVG en PNG aux bonnes dimensions

echo "🎨 Conversion des assets pour Google Play Store"
echo "=============================================="

# Créer le dossier de sortie
mkdir -p assets/png

echo "📱 Conversion de l'icône Play Store (512x512px)..."

# Méthode 1: Si vous avez ImageMagick installé
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick détecté, conversion en cours..."
    convert assets/play-store-icon.svg -resize 512x512 assets/png/play-store-icon-512.png
    convert assets/feature-graphic.svg -resize 1024x500 assets/png/feature-graphic-1024x500.png
    echo "✅ Conversion terminée avec ImageMagick"
    
# Méthode 2: Si vous avez rsvg-convert installé
elif command -v rsvg-convert &> /dev/null; then
    echo "✅ rsvg-convert détecté, conversion en cours..."
    rsvg-convert -w 512 -h 512 assets/play-store-icon.svg -o assets/png/play-store-icon-512.png
    rsvg-convert -w 1024 -h 500 assets/feature-graphic.svg -o assets/png/feature-graphic-1024x500.png
    echo "✅ Conversion terminée avec rsvg-convert"
    
else
    echo "⚠️  Aucun outil de conversion SVG détecté"
    echo ""
    echo "🔧 Solutions disponibles:"
    echo ""
    echo "1. 🌐 Conversion en ligne (Recommandé):"
    echo "   - Aller sur: https://convertio.co/svg-png/"
    echo "   - Upload: assets/play-store-icon.svg"
    echo "   - Redimensionner à: 512x512px"
    echo "   - Télécharger le PNG"
    echo ""
    echo "2. 📱 Avec votre navigateur:"
    echo "   - Ouvrir le SVG dans le navigateur"
    echo "   - Faire clic droit > Inspecter"
    echo "   - Prendre une capture d'écran"
    echo "   - Redimensionner avec un éditeur d'image"
    echo ""
    echo "3. 🛠️  Installer ImageMagick:"
    echo "   - Mac: brew install imagemagick"
    echo "   - Ubuntu: sudo apt install imagemagick"
    echo "   - Windows: Télécharger depuis imagemagick.org"
    echo ""
    echo "4. 🎨 Utiliser un éditeur graphique:"
    echo "   - GIMP (gratuit)"
    echo "   - Photoshop"
    echo "   - Canva (en ligne)"
    echo ""
fi

echo ""
echo "📋 Assets nécessaires pour Google Play Store:"
echo "============================================="
echo "✅ Icône app: 512x512px (PNG)"
echo "✅ Image vedette: 1024x500px (PNG)"
echo "📸 Captures d'écran: 1080x1920px ou 1920x1080px (PNG/JPEG)"
echo ""
echo "📁 Fichiers sources disponibles:"
echo "- assets/play-store-icon.svg"
echo "- assets/feature-graphic.svg"
echo "- assets/play-store-descriptions.md"
echo ""
echo "🎯 Une fois convertis, vous aurez tout pour publier sur le Play Store !"