// Service de gestion de la réinitialisation de mot de passe
// En production, ces fonctions feraient appel à une API backend

interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

class PasswordResetService {
  private tokens: Map<string, ResetToken> = new Map();

  // Génère un token de réinitialisation
  generateResetToken(email: string): string {
    const token = this.generateRandomToken();
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 heure

    this.tokens.set(token, {
      token,
      email,
      expiresAt,
      used: false
    });

    return token;
  }

  // Valide un token de réinitialisation
  validateResetToken(token: string): { isValid: boolean; email?: string; error?: string } {
    const resetToken = this.tokens.get(token);

    if (!resetToken) {
      return { isValid: false, error: 'Token invalide' };
    }

    if (resetToken.used) {
      return { isValid: false, error: 'Ce token a déjà été utilisé' };
    }

    if (Date.now() > resetToken.expiresAt) {
      return { isValid: false, error: 'Ce token a expiré' };
    }

    return { isValid: true, email: resetToken.email };
  }

  // Marque un token comme utilisé
  markTokenAsUsed(token: string): void {
    const resetToken = this.tokens.get(token);
    if (resetToken) {
      resetToken.used = true;
    }
  }

  // Simule l'envoi d'un email de réinitialisation
  async sendResetEmail(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Adresse email invalide' };
    }

    // Simulation : vérifier si l'email existe dans la base de données
    const existingEmails = ['test@example.com', 'dj@findmydj.com', 'user@test.com'];
    if (!existingEmails.includes(email)) {
      // En production, on ne révèle pas si l'email existe ou non pour des raisons de sécurité
      // Ici, on simule un succès même si l'email n'existe pas
      return { success: true, token: 'fake-token-for-non-existing-email' };
    }

    const token = this.generateResetToken(email);
    
    // En production, ici on enverrait un vrai email avec le lien de réinitialisation
    console.log(`Email de réinitialisation envoyé à ${email} avec le token: ${token}`);
    
    return { success: true, token };
  }

  // Réinitialise le mot de passe
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validation = this.validateResetToken(token);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Validation du mot de passe
    if (newPassword.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    // Marquer le token comme utilisé
    this.markTokenAsUsed(token);

    // En production, ici on mettrait à jour le mot de passe dans la base de données
    console.log(`Mot de passe réinitialisé pour l'email: ${validation.email}`);

    return { success: true };
  }

  // Génère un token aléatoire
  private generateRandomToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Nettoie les tokens expirés (à appeler périodiquement)
  cleanExpiredTokens(): void {
    const now = Date.now();
    for (const [token, resetToken] of this.tokens.entries()) {
      if (now > resetToken.expiresAt) {
        this.tokens.delete(token);
      }
    }
  }
}

// Instance singleton
export const passwordResetService = new PasswordResetService();

// Nettoie les tokens expirés toutes les heures
setInterval(() => {
  passwordResetService.cleanExpiredTokens();
}, 60 * 60 * 1000);

export default passwordResetService;