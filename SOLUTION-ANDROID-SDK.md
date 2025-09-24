# 🔧 Solution : Installer Android SDK

## ❌ **Problème détecté :**
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable
```

## ✅ **Solution simple :**

### **Étape 1 : Télécharger Android Studio**
1. Aller sur : https://developer.android.com/studio
2. Cliquer sur "Download Android Studio"
3. Télécharger le fichier DMG pour Mac

### **Étape 2 : Installer Android Studio**
1. Ouvrir le fichier DMG téléchargé
2. Glisser Android Studio dans Applications
3. Lancer Android Studio
4. Suivre l'assistant d'installation (accepter tout par défaut)

### **Étape 3 : Configuration automatique**
Android Studio va automatiquement :
- ✅ Installer Android SDK
- ✅ Configurer ANDROID_HOME
- ✅ Installer les outils de build

### **Étape 4 : Vérification**
```bash
# Après installation, vérifier :
echo $ANDROID_HOME
# Devrait afficher : /Users/[username]/Library/Android/sdk
```

### **Étape 5 : Construire l'APK**
```bash
npx cap build android
```

## ⏱️ **Temps estimé :** 10-15 minutes

## 🎯 **Résultat :** APK généré dans `android/app/build/outputs/apk/debug/`