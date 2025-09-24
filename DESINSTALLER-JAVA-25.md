# 🗑️ Désinstaller Java 25 sur Mac

## Méthode Simple (Recommandée)

### 1. Ouvrir le Terminal
- Appuyer sur `Cmd + Espace`
- Taper "Terminal"
- Appuyer sur Entrée

### 2. Supprimer Java 25
Copier-coller cette commande :
```bash
sudo rm -rf /Library/Java/JavaVirtualMachines/temurin-25.jdk
```

**Note :** Il va demander votre mot de passe Mac.

### 3. Vérifier la suppression
```bash
java -version
```

**Résultat attendu :**
```
zsh: command not found: java
```
ou
```
No Java runtime present
```

## Alternative : Supprimer TOUS les Java
Si vous voulez tout nettoyer :
```bash
sudo rm -rf /Library/Java/JavaVirtualMachines/*
```

## Ensuite
1. ✅ Java 25 supprimé
2. 📥 Installer Java 17 LTS
3. 🔨 Construire l'APK

## Temps estimé
⏱️ 2-3 minutes