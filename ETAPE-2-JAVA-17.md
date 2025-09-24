# 🔧 Étape 2 : Installer Java 17 (Remplacer Java 25)

## Problème actuel
Vous avez Java 25, mais il faut Java 17 pour Android.

## Solution en 3 étapes

### 1. Télécharger Java 17 LTS
🔗 **Lien direct** : https://adoptium.net/temurin/releases/

**Configuration à choisir :**
- **Operating System** : macOS
- **Architecture** : x64 (ou arm64 si Mac M1/M2/M3)
- **Package Type** : JDK
- **Version** : 17 - LTS ⭐

### 2. Installer Java 17
- Télécharger le fichier `.pkg`
- Double-cliquer pour ouvrir
- Suivre l'assistant d'installation
- ✅ Accepter les paramètres par défaut

### 3. Vérifier l'installation
Après installation, taper dans le terminal :
```bash
java -version
```

**Résultat attendu :**
```
openjdk version "17.x.x"
```

## Ensuite
Une fois Java 17 installé, on pourra construire l'APK !

## Temps estimé
⏱️ 3-5 minutes au total