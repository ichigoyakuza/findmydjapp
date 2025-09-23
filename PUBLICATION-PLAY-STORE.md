# 🚀 Guide de Publication - Google Play Store
## FindMyDJ App

### 📋 **ÉTAPES COMPLÈTES**

---

## **1. 🔧 Générer l'APK (GRATUIT)**

### **Option A: GitHub Actions (Recommandé)**
```bash
# 1. Créer un repo GitHub
git init
git add .
git commit -m "Initial commit - FindMyDJ App"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/findmydj-app.git
git push -u origin main

# 2. L'APK se génère automatiquement !
# Télécharger depuis: Actions > Build Android APK > Artifacts
```

### **Option B: Build Local (si vous avez Android Studio)**
```bash
# Installer les dépendances
npm install

# Build web
npm run build

# Sync Capacitor
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android

# Ou build en ligne de commande
cd android
./gradlew assembleRelease
```

---

## **2. 💳 Créer le Compte Développeur Google Play**

### **Coût: 25€ (paiement unique)**

1. **Aller sur:** https://play.google.com/console
2. **Créer un compte développeur**
3. **Payer les 25€** (une seule fois)
4. **Vérifier votre identité** (peut prendre 1-2 jours)

---

## **3. 📱 Préparer l'Application**

### **Assets déjà créés dans `/assets/`:**
- ✅ **Icône:** `play-store-icon.svg` (512x512px)
- ✅ **Image vedette:** `feature-graphic.svg` (1024x500px)  
- ✅ **Descriptions:** `play-store-descriptions.md`

### **Captures d'écran nécessaires:**
- **Téléphone:** 2-8 captures (16:9 ou 9:16)
- **Tablette:** 1-8 captures (optionnel)

---

## **4. 🔐 Signature de l'App (IMPORTANT)**

### **Générer une clé de signature:**
```bash
# Créer le keystore de production
keytool -genkey -v -keystore findmydj-release-key.keystore \
  -alias findmydj -keyalg RSA -keysize 2048 -validity 10000

# Sauvegarder ces informations:
# - Mot de passe du keystore
# - Mot de passe de la clé
# - Alias: findmydj
```

### **⚠️ CRUCIAL:** 
- **Sauvegarder le fichier `.keystore`**
- **Noter les mots de passe**
- **Sans ça, impossible de mettre à jour l'app !**

---

## **5. 📤 Upload sur Play Store**

### **Dans Google Play Console:**

1. **Créer une nouvelle application**
   - Nom: FindMyDJ
   - Langue par défaut: Français
   - Type: Application

2. **Remplir les informations:**
   - **Description courte:** (voir `play-store-descriptions.md`)
   - **Description complète:** (voir `play-store-descriptions.md`)
   - **Icône:** Upload `play-store-icon.svg` (convertir en PNG 512x512)
   - **Image vedette:** Upload `feature-graphic.svg` (convertir en PNG 1024x500)

3. **Upload de l'APK/AAB:**
   - Aller dans "Production" > "Créer une version"
   - Upload votre APK signé
   - Ajouter les notes de version

4. **Politique de confidentialité:**
   - URL: `https://votre-site.com/privacy-policy`
   - (Créer une page simple sur votre site)

5. **Classification du contenu:**
   - Catégorie: Musique et audio
   - Public cible: Tout public
   - Pas de contenu sensible

---

## **6. 🎯 Checklist Final**

### **Avant soumission:**
- [ ] APK signé et testé
- [ ] Toutes les captures d'écran ajoutées
- [ ] Description complète et optimisée
- [ ] Politique de confidentialité en ligne
- [ ] Classification du contenu complétée
- [ ] Prix défini (gratuit ou payant)
- [ ] Pays de distribution sélectionnés

### **Après soumission:**
- [ ] Examen Google (1-3 jours)
- [ ] Corrections si nécessaire
- [ ] Publication finale
- [ ] Promotion de l'app

---

## **💡 Conseils Pro**

### **Pour un lancement réussi:**
1. **Testez l'APK** sur plusieurs appareils
2. **Optimisez les mots-clés** dans la description
3. **Préparez des captures attrayantes**
4. **Créez une page de destination** pour l'app
5. **Planifiez la promotion** sur les réseaux sociaux

### **Après publication:**
- **Surveillez les avis** et répondez rapidement
- **Analysez les statistiques** dans Play Console
- **Préparez les mises à jour** régulières
- **Collectez les retours** des utilisateurs

---

## **🔗 Liens Utiles**

- **Play Console:** https://play.google.com/console
- **Guide officiel:** https://developer.android.com/distribute/google-play
- **Politiques:** https://play.google.com/about/developer-content-policy/
- **Aide:** https://support.google.com/googleplay/android-developer

---

## **📞 Support**

En cas de problème:
1. Vérifiez les guides dans ce projet
2. Consultez la documentation officielle
3. Contactez le support Google Play

**🎵 Bonne chance avec FindMyDJ sur le Play Store ! 🎵**