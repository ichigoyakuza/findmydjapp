#!/bin/bash

# 🚀 GITHUB CODESPACES - BUILD APK FINDMYDJ
# Copier-coller ce script complet dans le terminal Codespaces

echo "🚀 Début du build APK FindMyDJ dans GitHub Codespaces..."
echo "⏱️ Temps estimé: 5-8 minutes"
echo ""

# 1. Installation et build web
echo "📱 Étape 1/4: Installation des dépendances et build web..."
npm install && npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build web réussi !"
else
    echo "❌ Erreur build web"
    exit 1
fi

# 2. Synchronisation Capacitor
echo ""
echo "🔄 Étape 2/4: Synchronisation Capacitor Android..."
npx cap sync android
if [ $? -eq 0 ]; then
    echo "✅ Synchronisation réussie !"
else
    echo "❌ Erreur synchronisation"
    exit 1
fi

# 3. Permissions Gradle
echo ""
echo "🔧 Étape 3/4: Configuration permissions..."
chmod +x android/gradlew

# 4. Build APK
echo ""
echo "🏗️ Étape 4/4: Génération APK Android..."
cd android && ./gradlew assembleRelease
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ✅ APK GÉNÉRÉ AVEC SUCCÈS !"
    echo ""
    echo "📁 Localisation APK:"
    find . -name "*.apk" -type f
    echo ""
    echo "📋 PROCHAINES ÉTAPES:"
    echo "1. Clic droit sur app-release.apk → Download"
    echo "2. Aller sur https://play.google.com/console"
    echo "3. Créer app 'FindMyDJ'"
    echo "4. Upload APK"
    echo "5. Publier sur Google Play Store !"
    echo ""
else
    echo "❌ Erreur génération APK"
    echo "🔧 Essayez: ./gradlew clean && ./gradlew assembleRelease"
fi