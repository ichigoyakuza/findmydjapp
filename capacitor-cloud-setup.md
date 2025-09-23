# ☁️ Configuration Capacitor Cloud - FindMyDJ

## 🚀 **Méthode Recommandée pour Générer l'APK**

Capacitor Cloud est la solution la plus simple pour générer votre APK sans installer Android Studio localement.

## 📋 **Étapes de Configuration**

### **1. Installation de Capacitor Cloud CLI**
```bash
npm install -g @capacitor/cli
```

### **2. Connexion à Capacitor Cloud**
```bash
npx cap cloud login
```
- Créez un compte sur [Capacitor Cloud](https://capacitorjs.com/cloud)
- Suivez les instructions de connexion

### **3. Configuration du Projet**
```bash
# Initialiser le projet cloud
npx cap cloud init

# Configurer pour Android
npx cap cloud config set platform android
```

### **4. Build de Production**
```bash
# Build web + sync + build Android
npx cap cloud build android --release

# Ou pour un build de test
npx cap cloud build android --debug
```

## 🔧 **Configuration Avancée**

### **Fichier capacitor-cloud.yml**
Créez ce fichier à la racine du projet :

```yaml
# capacitor-cloud.yml
project_id: "findmydj-app"
platforms:
  android:
    build_type: "release"
    gradle_version: "8.0"
    java_version: "17"
    android_api_level: "34"
    
build:
  web_command: "npm run build"
  web_dir: "dist"
  
signing:
  android:
    keystore_path: "android/app/findmydj-release-key.keystore"
    keystore_password: "${KEYSTORE_PASSWORD}"
    key_alias: "findmydj"
    key_password: "${KEY_PASSWORD}"
```

### **Variables d'Environnement**
```bash
# Définir les mots de passe de signature
export KEYSTORE_PASSWORD="votre_mot_de_passe"
export KEY_PASSWORD="votre_mot_de_passe"
```

## 📱 **Avantages de Capacitor Cloud**

✅ **Pas d'installation locale** d'Android Studio/Java
✅ **Build dans le cloud** avec infrastructure optimisée
✅ **Support multi-plateforme** (Android + iOS)
✅ **Intégration CI/CD** facile
✅ **Builds reproductibles** et cohérents
✅ **Support technique** de l'équipe Ionic

## 💰 **Tarification**

- **Plan Gratuit** : 100 builds/mois
- **Plan Pro** : 500 builds/mois ($29/mois)
- **Plan Team** : Builds illimités ($99/mois)

Pour FindMyDJ, le plan gratuit est largement suffisant pour commencer !

## 🔄 **Workflow Complet**

```bash
# 1. Build web
npm run build

# 2. Sync Capacitor
npx cap sync android

# 3. Build cloud
npx cap cloud build android --release

# 4. Télécharger l'APK/AAB
# Le fichier sera disponible dans votre dashboard Capacitor Cloud
```

## 📥 **Récupération des Fichiers**

Après le build, vous pouvez :

1. **Télécharger depuis le dashboard** Capacitor Cloud
2. **Utiliser la CLI** pour télécharger automatiquement :
   ```bash
   npx cap cloud download android
   ```

## 🐛 **Dépannage**

### **Erreur de connexion**
```bash
# Vérifier la connexion
npx cap cloud status

# Se reconnecter
npx cap cloud logout
npx cap cloud login
```

### **Erreur de build**
```bash
# Voir les logs détaillés
npx cap cloud logs --build-id YOUR_BUILD_ID

# Nettoyer et recommencer
npx cap clean android
npx cap sync android
```

### **Problème de signature**
- Vérifiez que votre keystore existe
- Confirmez les mots de passe
- Assurez-vous que l'alias est correct

## 🎯 **Alternative : GitHub Actions**

Si vous préférez GitHub Actions, voici un workflow basique :

```yaml
# .github/workflows/android-build.yml
name: Build Android
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web
        run: npm run build
      
      - name: Build Android
        run: |
          npx cap sync android
          npx cap cloud build android --release
```

---

**🎉 Avec Capacitor Cloud, votre APK sera prêt en quelques minutes !**