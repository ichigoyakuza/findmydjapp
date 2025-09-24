#!/bin/bash

# Script de build Android pour FindMyDJ
# Ce script reproduit les étapes du workflow GitHub Actions

# Désactiver la télémétrie Capacitor
export CAPACITOR_TELEMETRY=false

set -e  # Arrêter en cas d'erreur

echo "🚀 Début du build Android FindMyDJ..."
echo "======================================="

# Vérifier les prérequis
echo "🔍 Vérification des prérequis..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ npx n'est pas installé"
    exit 1
fi

echo "✅ Prérequis OK"

# Nettoyer les builds précédents
echo "🧹 Nettoyage des builds précédents..."
rm -rf dist/
rm -rf android/app/build/

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build de l'application web
echo "🏗️ Build de l'application web..."
npm run build

# Vérifier que le build web existe
if [ ! -d "dist" ]; then
    echo "❌ Le dossier dist n'existe pas après le build"
    exit 1
fi

echo "✅ Build web terminé"

# Synchronisation Capacitor
echo "🔄 Synchronisation Capacitor..."
npx cap telemetry off
npx cap sync android

# Vérifier que les fichiers Android existent
if [ ! -f "android/gradlew" ]; then
    echo "❌ Le fichier gradlew n'existe pas"
    exit 1
fi

# Rendre gradlew exécutable
echo "🔧 Configuration des permissions..."
chmod +x android/gradlew

# Nettoyer le build Android
echo "🧹 Nettoyage du build Android..."
cd android
./gradlew clean --no-daemon

# Build de l'APK
echo "📱 Build de l'APK Android..."
./gradlew assembleDebug --no-daemon --stacktrace --info

# Vérifier que l'APK a été créé
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo "✅ APK créé avec succès !"
    echo "📁 Fichier: android/$APK_PATH"
    echo "📊 Taille: $(du -h "$APK_PATH" | cut -f1)"
    
    # Retourner au dossier racine
    cd ..
    
    # Copier l'APK dans le dossier racine pour faciliter l'accès
    cp "android/$APK_PATH" "findmydj-debug.apk"
    echo "📋 APK copié vers: findmydj-debug.apk"
    
    echo ""
    echo "🎉 Build Android terminé avec succès !"
    echo "🚀 Vous pouvez maintenant installer l'APK sur votre appareil Android"
else
    echo "❌ Échec de la création de l'APK"
    echo "📁 Contenu du dossier de sortie:"
    ls -la app/build/outputs/apk/debug/ || echo "Dossier introuvable"
    exit 1
fi