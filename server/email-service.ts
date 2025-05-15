import crypto from 'crypto';

// Interface for email service
export interface EmailService {
  sendVerificationEmail(email: string, username: string, token: string): Promise<boolean>;
  sendPasswordResetEmail(email: string, token: string): Promise<boolean>;
}

// Mock implementation for testing (when SendGrid API key is not available)
export class MockEmailService implements EmailService {
  async sendVerificationEmail(email: string, username: string, token: string): Promise<boolean> {
    console.log(`[MOCK EMAIL] Sending verification email to ${email} for user ${username}`);
    console.log(`[MOCK EMAIL] Verification token: ${token}`);
    console.log(`[MOCK EMAIL] Verification link would be: http://localhost:5000/verify-email?token=${token}`);
    
    // Mock successful email sending
    return true;
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    console.log(`[MOCK EMAIL] Sending password reset email to ${email}`);
    console.log(`[MOCK EMAIL] Reset token: ${token}`);
    console.log(`[MOCK EMAIL] Reset link would be: http://localhost:5000/reset-password?token=${token}`);
    
    // Mock successful email sending
    return true;
  }
}

// Helper function to generate random tokens
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to generate verification token expiration (24 hours from now)
export function generateTokenExpiration(): Date {
  const now = new Date();
  return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
}

// Export a singleton instance of the email service
export const emailService = new MockEmailService();