#!/bin/bash

# 🚀 BUILD APK AVEC ANDROID STUDIO - SOLUTION SIMPLE
echo "🚀 Préparation du build APK avec Android Studio..."

# 1. Build de l'app web
echo "📱 Build de l'application web..."
npm run build

# 2. Synchronisation Capacitor
echo "🔄 Synchronisation avec Android..."
npx cap sync android

# 3. Ouverture dans Android Studio
echo "🛠️ Ouverture dans Android Studio..."
npx cap open android

echo ""
echo "✅ ÉTAPES DANS ANDROID STUDIO :"
echo "1. Attendre que le projet se charge complètement"
echo "2. Aller dans : Build → Generate Signed Bundle/APK"
echo "3. Sélectionner : APK"
echo "4. Créer un nouveau keystore (première fois)"
echo "5. Cliquer : Build Release APK"
echo ""
echo "📁 APK généré dans : android/app/build/outputs/apk/release/"
echo "🎯 Ensuite : Upload sur Google Play Console"
echo ""