#!/bin/bash

# 🚀 Script de Build Android pour FindMyDJ
# Ce script automatise la création de l'APK/AAB pour Google Play Store

echo "🎵 FindMyDJ - Build Android pour Google Play Store"
echo "=================================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Erreur: Veuillez exécuter ce script depuis la racine du projet FindMyDJ"
    exit 1
fi

# Étape 1: Build de l'application web
echo "📦 Étape 1: Build de l'application web..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build web"
    exit 1
fi
echo "✅ Build web terminé"

# Étape 2: Synchronisation avec Capacitor
echo "🔄 Étape 2: Synchronisation Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la synchronisation Capacitor"
    exit 1
fi
echo "✅ Synchronisation terminée"

# Étape 3: Vérifier la configuration Android
echo "🔍 Étape 3: Vérification de la configuration..."
if [ ! -d "android" ]; then
    echo "❌ Le dossier android n'existe pas"
    exit 1
fi

# Étape 4: Options de build
echo "🛠️  Étape 4: Choisissez votre méthode de build:"
echo "1. Build avec Capacitor Cloud (Recommandé)"
echo "2. Build local avec Gradle (nécessite Java/Android SDK)"
echo "3. Ouvrir dans Android Studio"
echo "4. Générer les clés de signature"

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        echo "☁️  Build avec Capacitor Cloud..."
        echo "Installez Capacitor Cloud CLI si ce n'est pas fait:"
        echo "npm install -g @capacitor/cli"
        echo ""
        echo "Puis exécutez:"
        echo "npx cap cloud login"
        echo "npx cap cloud build android --release"
        ;;
    2)
        echo "🏗️  Build local avec Gradle..."
        cd android
        if [ -f "./gradlew" ]; then
            echo "Génération de l'APK debug..."
            ./gradlew assembleDebug
            echo "✅ APK debug généré dans: android/app/build/outputs/apk/debug/"
            
            echo "Génération de l'AAB release..."
            ./gradlew bundleRelease
            echo "✅ AAB release généré dans: android/app/build/outputs/bundle/release/"
        else
            echo "❌ Gradle wrapper non trouvé"
        fi
        cd ..
        ;;
    3)
        echo "📱 Ouverture dans Android Studio..."
        if command -v studio &> /dev/null; then
            studio android/
        else
            echo "Ouvrez manuellement le dossier 'android' dans Android Studio"
        fi
        ;;
    4)
        echo "🔐 Génération des clés de signature..."
        echo "Création de la clé de signature pour le Play Store..."
        keytool -genkey -v -keystore android/app/findmydj-release-key.keystore -alias findmydj -keyalg RSA -keysize 2048 -validity 10000
        echo "✅ Clé générée dans: android/app/findmydj-release-key.keystore"
        echo ""
        echo "⚠️  IMPORTANT: Sauvegardez cette clé en lieu sûr !"
        echo "Elle sera nécessaire pour toutes les mises à jour futures."
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "🎉 Build terminé !"
echo ""
echo "📋 Prochaines étapes pour publier sur Google Play Store:"
echo "1. Créer un compte développeur Google Play (25$)"
echo "2. Uploader l'APK/AAB sur Play Console"
echo "3. Compléter les informations de l'app"
echo "4. Ajouter les captures d'écran et assets"
echo "5. Soumettre pour révision"
echo ""
echo "📚 Guide complet: GOOGLE-PLAY-GUIDE.md"
echo "🎨 Assets créés: dossier assets/"