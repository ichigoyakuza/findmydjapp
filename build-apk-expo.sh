#!/bin/bash

# 🚀 BUILD APK AVEC EXPO EAS - SOLUTION ALTERNATIVE
# Utiliser si Capacitor Cloud ne fonctionne pas

echo "🚀 Installation Expo CLI..."
npm install -g @expo/cli eas-cli

echo "📱 Configuration Expo pour Capacitor..."
npx expo install expo

echo "🏗️ Build APK local gratuit..."
eas build --platform android --local

echo "✅ APK généré avec succès !"
echo "📁 Localisation : ./build/android/"

echo "🎯 Prochaine étape : Upload sur Google Play Console"
echo "🔗 https://play.google.com/console"