# ☕ Solution Simple - Installer Java sans Complications

## 🎯 Méthode la Plus Simple

### Option 1: Téléchargement Direct (Recommandé)
1. **Ouvrez ce lien** : https://adoptium.net/temurin/releases/
2. **Sélectionnez** :
   - Operating System: **macOS**
   - Architecture: **x64** (ou **aarch64** si Mac M1/M2)
   - Package Type: **PKG**
   - Version: **17 - LTS**
3. **Cliquez** sur le bouton de téléchargement
4. **Double-cliquez** sur le fichier `.pkg` téléchargé
5. **Suivez** l'assistant d'installation
6. **Redémarrez** le terminal

### Option 2: Via le Site Oracle
1. Allez sur : https://www.java.com/download/
2. Cliquez sur **"Téléchargement gratuit de Java"**
3. Installez le fichier téléchargé

## 🔍 Vérification
Après installation, dans un nouveau terminal :
```bash
java -version
```

Vous devriez voir quelque chose comme :
```
openjdk version "17.0.x" 2023-xx-xx
```

## 🚀 Ensuite
Une fois Java installé :
```bash
./build-android.sh
```

## ⏱️ Temps Total
- **Téléchargement** : 1-2 minutes
- **Installation** : 1 minute
- **Build APK** : 3-5 minutes
- **Total** : 5-8 minutes

---

**🎯 Action** : Utilisez l'Option 1 (Adoptium) - c'est la version officielle et gratuite !