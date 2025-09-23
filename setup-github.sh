#!/bin/bash

# 🚀 Script de Configuration GitHub pour FindMyDJ
# Ce script configure automatiquement le repo GitHub pour générer l'APK

echo "🎵 Configuration GitHub pour FindMyDJ 🎵"
echo "========================================"

# Vérifier si git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez-le d'abord."
    exit 1
fi

# Initialiser le repo git si nécessaire
if [ ! -d ".git" ]; then
    echo "📁 Initialisation du repo Git..."
    git init
    git branch -M main
else
    echo "✅ Repo Git déjà initialisé"
fi

# Créer .gitignore si nécessaire
if [ ! -f ".gitignore" ]; then
    echo "📝 Création du .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Android
android/app/build/
android/app/release/
android/app/debug/
*.keystore
!debug.keystore

# iOS
ios/App/build/
ios/App/Pods/

# Capacitor
.capacitor/
EOF
fi

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers au repo..."
git add .

# Commit initial
echo "💾 Commit initial..."
git commit -m "🎵 Initial commit - FindMyDJ App

✨ Features:
- DJ discovery and booking platform
- Music streaming and playlists
- Real-time chat and notifications
- Payment integration with Stripe
- Mobile app with Capacitor

🚀 Ready for Google Play Store deployment
📱 Android build configured with GitHub Actions"

echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo "===================="
echo ""
echo "1. 📱 Créer un repo sur GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. 🔗 Ajouter l'origine remote:"
echo "   git remote add origin https://github.com/VOTRE-USERNAME/findmydj-app.git"
echo ""
echo "3. 🚀 Pousser le code:"
echo "   git push -u origin main"
echo ""
echo "4. ⚡ L'APK se génère automatiquement dans GitHub Actions!"
echo ""
echo "5. 📥 Télécharger l'APK depuis:"
echo "   GitHub > Actions > Build Android APK > Artifacts"
echo ""
echo "6. 💳 Créer le compte Google Play (25€):"
echo "   https://play.google.com/console"
echo ""
echo "7. 📤 Uploader l'APK sur Play Store"
echo ""
echo "✅ Configuration terminée ! Votre app est prête pour le Play Store 🎵"