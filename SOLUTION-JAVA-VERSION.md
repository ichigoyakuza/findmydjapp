# 🔧 Solution Java Version

## Problème
Java 25 est trop récent pour Gradle. Il faut Java 17 LTS.

## Solution Simple

### 1. Télécharger Java 17 LTS
- Aller sur : https://adoptium.net/temurin/releases/
- Choisir :
  - **Operating System** : macOS
  - **Architecture** : x64 (ou arm64 si Mac M1/M2)
  - **Package Type** : JDK
  - **Version** : 17 - LTS

### 2. Installer
- Télécharger le fichier `.pkg`
- Double-cliquer pour installer
- Suivre l'assistant d'installation

### 3. Vérifier
```bash
java -version
```
Doit afficher : `openjdk version "17.x.x"`

### 4. Construire l'APK
```bash
./build-android.sh
```

## Temps estimé
- Installation : 2-3 minutes
- Construction APK : 3-5 minutes

## Résultat attendu
✅ APK généré dans `android/app/build/outputs/apk/debug/`