import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect, Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2, CheckCircle2 as CheckCircle2Icon, Mail, RefreshCw, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false),
});

const passwordStrengthSchema = z.object({
  length: z.boolean(),
  uppercase: z.boolean(),
  lowercase: z.boolean(),
  number: z.boolean(),
  special: z.boolean(),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

import { cn } from "@/lib/utils";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<"google" | "github" | null>(null);
  const isEnglish = t('language') === 'en';
  
  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsSocialLoading("google");
      
      // Debug Firebase configuratie
      console.log("Firebase login poging met configuratie:", {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: "techwithyouu.firebaseapp.com",
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: "techwithyouu.firebasestorage.app",
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      });
      
      const result = await signInWithGoogle();
      console.log("Google login resultaat:", result);
      
      const idToken = await result.user.getIdToken();
      console.log("Token verkregen, versturen naar server");
      
      // Verstuur het token naar de server voor verificatie
      const response = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });
      
      console.log("Server response status:", response.status);
      
      if (response.ok) {
        // Na succesvolle authenticatie, werk de gebruiker state bij
        trackEvent("login", "auth", "google_login");
        window.location.href = "/"; // Forceer een refresh om de authenticatie state bij te werken
      } else {
        const errorData = await response.json();
        console.error("Server authentication error:", errorData);
        throw new Error(errorData.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: isEnglish ? "Login Failed" : "Inloggen Mislukt",
        description: isEnglish 
          ? "Could not log in with Google. Please try again." 
          : "Kon niet inloggen met Google. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSocialLoading(null);
    }
  };
  
  // Handle GitHub Sign In
  const handleGithubSignIn = async () => {
    try {
      setIsSocialLoading("github");
      
      // Debug Firebase configuratie
      console.log("GitHub login poging met configuratie:", {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: "techwithyouu.firebaseapp.com",
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: "techwithyouu.firebasestorage.app",
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      });
      
      const result = await signInWithGithub();
      console.log("GitHub login resultaat:", result);
      
      const idToken = await result.user.getIdToken();
      console.log("Token verkregen, versturen naar server");
      
      // Verstuur het token naar de server voor verificatie
      const response = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });
      
      console.log("Server response status:", response.status);
      
      if (response.ok) {
        // Na succesvolle authenticatie, werk de gebruiker state bij
        trackEvent("login", "auth", "github_login");
        window.location.href = "/"; // Forceer een refresh om de authenticatie state bij te werken
      } else {
        const errorData = await response.json();
        console.error("Server authentication error:", errorData);
        throw new Error(errorData.message || "Authentication failed");
      }
    } catch (error) {
      console.error("GitHub sign in error:", error);
      toast({
        title: isEnglish ? "Login Failed" : "Inloggen Mislukt",
        description: isEnglish 
          ? "Could not log in with GitHub. Please try again." 
          : "Kon niet inloggen met GitHub. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSocialLoading(null);
    }
  };
  
  // Function to handle resending verification email
  const handleResendVerification = async () => {
    if (isResending || !verificationEmail) return;
    
    setIsResending(true);
    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: isEnglish ? "Email Sent" : "E-mail Verzonden",
          description: isEnglish 
            ? "Verification email has been resent to your inbox" 
            : "Verificatie-e-mail is opnieuw verzonden naar uw inbox",
          variant: "default",
        });
      } else {
        toast({
          title: isEnglish ? "Error" : "Fout",
          description: data.message || (isEnglish 
            ? "Failed to resend verification email" 
            : "Kon verificatie-e-mail niet opnieuw verzenden"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: isEnglish ? "Error" : "Fout",
        description: isEnglish 
          ? "An error occurred. Please try again later." 
          : "Er is een fout opgetreden. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = (values: LoginFormValues) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password
    });
    
    // Save remember me preference
    if (values.rememberMe) {
      localStorage.setItem("rememberUser", values.username);
    } else {
      localStorage.removeItem("rememberUser");
    }
    
    trackEvent("login_attempt", "auth", "login_form", 1);
  };
  
  const handleRegister = (values: RegisterFormValues) => {
    // Registration mutation
    registerMutation.mutate({
      username: values.username,
      email: values.email,
      password: values.password,
      name: values.username, // Using username as name for simplicity
      role: 'client'
    }, {
      onSuccess: (data: any) => {
        // Check if email verification is required
        if (data.requiresVerification) {
          setVerificationEmail(values.email);
        }
      }
    });
    
    trackEvent("register_attempt", "auth", "register_form", 1);
  };
  
  const handleForgotPassword = (values: ForgotPasswordFormValues) => {
    // TODO: Add server endpoint for password reset
    // Temporary toast notification for feedback
    toast({
      title: isEnglish ? "Reset Email Sent" : "Reset E-mail Verzonden",
      description: isEnglish
        ? "If an account with this email exists, we've sent a password reset link."
        : "Als er een account bestaat met deze e-mail, hebben we een link gestuurd om je wachtwoord te resetten.",
    });
    
    setShowForgotPassword(false);
    trackEvent("forgot_password", "auth", "forgot_password_form", 1);
  };
  
  // Handle password strength validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    
    let strength = 0;
    
    // Check password length
    if (password.length >= 8) strength++;
    
    // Check for uppercase letter
    if (/[A-Z]/.test(password)) strength++;
    
    // Check for lowercase letter
    if (/[a-z]/.test(password)) strength++;
    
    // Check for number
    if (/[0-9]/.test(password)) strength++;
    
    // Check for special character
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  };
  
  // Load remembered username on mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberUser");
    if (rememberedUser) {
      loginForm.setValue("username", rememberedUser);
      loginForm.setValue("rememberMe", true);
    }
  }, [loginForm]);

  // Redirect if already logged in - admin naar admin dashboard, client naar client dashboard
  if (user) {
    if (user.role === 'admin') {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/dashboard" />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${t('auth.login')} ${t('auth.register')} | TechWithYou`}
        description={t('auth.loginDescription') + " " + t('auth.registerDescription')}
      />
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {verificationEmail ? (
              // Email Verification Screen
              <div className="col-span-1 lg:col-span-2 flex justify-center">
                <Card className="border-2 border-primary/20 w-full max-w-md">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">
                      {t('auth.emailVerification')}
                    </CardTitle>
                    <CardDescription>
                      {t('auth.verificationSent')}:
                      <span className="block font-medium text-lg mt-1">{verificationEmail}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertTitle>
                        {t('auth.emailVerification')}
                      </AlertTitle>
                      <AlertDescription>
                        {t('auth.verificationInstructions')}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        {isEnglish 
                          ? "Didn't receive the email?" 
                          : "Geen e-mail ontvangen?"}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="space-x-2"
                      >
                        {isResending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span>
                          {isEnglish ? "Resend Email" : "E-mail Opnieuw Versturen"}
                        </span>
                      </Button>
                    </div>
                    
                    <div className="text-center pt-4 border-t">
                      <Button
                        variant="link"
                        onClick={() => setVerificationEmail(null)}
                        className="text-muted-foreground"
                      >
                        {isEnglish ? "Back to Login" : "Terug naar Inloggen"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Auth Forms */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                  >
                    {showForgotPassword ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-2xl text-center">
                            {isEnglish ? "Reset Password" : "Wachtwoord Resetten"}
                          </CardTitle>
                          <CardDescription className="text-center">
                            {isEnglish 
                              ? "Enter your email to receive a password reset link" 
                              : "Voer je e-mail in om een link te ontvangen om je wachtwoord te resetten"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...forgotPasswordForm}>
                            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                              <FormField
                                control={forgotPasswordForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{isEnglish ? "Email" : "E-mail"}</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="email" 
                                        placeholder={isEnglish ? "Enter your email" : "Voer je e-mail in"}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="pt-2">
                                <Button 
                                  type="submit" 
                                  className="w-full"
                                >
                                  {isEnglish ? "Send Reset Link" : "Verstuur Reset Link"}
                                </Button>
                              </div>
                              
                              <div className="text-center pt-2">
                                <Button
                                  variant="link"
                                  onClick={() => setShowForgotPassword(false)}
                                  className="text-muted-foreground"
                                >
                                  {isEnglish ? "Back to Login" : "Terug naar Inloggen"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    ) : (
                      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                          <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="login">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
                              <CardDescription>
                                {t('auth.loginDescription')}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                                  <FormField
                                    control={loginForm.control}
                                    name="username"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('auth.username')}</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="text" 
                                            placeholder={t('auth.username')}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center justify-between">
                                          <FormLabel>{t('auth.password')}</FormLabel>
                                          <Button
                                            variant="link"
                                            type="button"
                                            className="p-0 h-auto text-xs"
                                            onClick={() => setShowForgotPassword(true)}
                                          >
                                            {t('auth.forgotPassword')}
                                          </Button>
                                        </div>
                                        <FormControl>
                                          <Input 
                                            type="password" 
                                            placeholder={t('auth.password')}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={loginForm.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel>
                                            {t('auth.rememberMe')}
                                          </FormLabel>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                    {loginMutation.isPending ? (
                                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('auth.login')}...</>
                                    ) : (
                                      <>{t('auth.signIn')}</>
                                    )}
                                  </Button>
                                  
                                  <div className="mt-6">
                                    <div className="relative">
                                      <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                      </div>
                                      <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                          {isEnglish ? "Or continue with" : "Of ga verder met"}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 flex gap-2">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full" 
                                        onClick={handleGoogleSignIn}
                                        disabled={isSocialLoading !== null}
                                      >
                                        {isSocialLoading === "google" ? (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                          <FcGoogle className="mr-2 h-4 w-4" />
                                        )}
                                        Google
                                      </Button>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={handleGithubSignIn}
                                        disabled={isSocialLoading !== null}
                                      >
                                        {isSocialLoading === "github" ? (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                          <Github className="mr-2 h-4 w-4" />
                                        )}
                                        GitHub
                                      </Button>
                                    </div>
                                  </div>
                                </form>
                              </Form>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="register">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-2xl">{isEnglish ? "Create an Account" : "Account Aanmaken"}</CardTitle>
                              <CardDescription>
                                {isEnglish 
                                  ? "Enter your details to create a new account" 
                                  : "Voer je gegevens in om een nieuw account aan te maken"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                                  <FormField
                                    control={registerForm.control}
                                    name="username"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{isEnglish ? "Username" : "Gebruikersnaam"}</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="text" 
                                            placeholder={isEnglish ? "Choose a username" : "Kies een gebruikersnaam"}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{isEnglish ? "Email" : "E-mail"}</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="email"
                                            placeholder={isEnglish ? "Enter your email" : "Voer je e-mail in"}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{isEnglish ? "Password" : "Wachtwoord"}</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="password" 
                                            placeholder={isEnglish ? "Create a password" : "Maak een wachtwoord"}
                                            {...field} 
                                            onChange={(e) => {
                                              field.onChange(e);
                                              handlePasswordChange(e);
                                            }}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                        <div className="mt-2 space-y-2">
                                          <p className="text-xs text-muted-foreground">
                                            {isEnglish ? "Password strength:" : "Wachtwoordsterkte:"}
                                          </p>
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                              <div 
                                                className={cn(
                                                  "h-full transition-all",
                                                  passwordStrength === 0 && "w-0",
                                                  passwordStrength === 1 && "w-1/5 bg-destructive",
                                                  passwordStrength === 2 && "w-2/5 bg-amber-500",
                                                  passwordStrength === 3 && "w-3/5 bg-amber-500",
                                                  passwordStrength === 4 && "w-4/5 bg-lime-500",
                                                  passwordStrength === 5 && "w-full bg-green-500"
                                                )}
                                              />
                                            </div>
                                            <span className="text-xs font-medium">
                                              {passwordStrength === 0 && (isEnglish ? "Very Weak" : "Zeer Zwak")}
                                              {passwordStrength === 1 && (isEnglish ? "Weak" : "Zwak")}
                                              {passwordStrength === 2 && (isEnglish ? "Fair" : "Redelijk")}
                                              {passwordStrength === 3 && (isEnglish ? "Good" : "Goed")}
                                              {passwordStrength === 4 && (isEnglish ? "Strong" : "Sterk")}
                                              {passwordStrength === 5 && (isEnglish ? "Very Strong" : "Zeer Sterk")}
                                            </span>
                                          </div>
                                          <ul className="space-y-1 text-xs text-muted-foreground pt-2">
                                            <li className="flex items-center">
                                              <CheckCircle2Icon
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  passwordStrength >= 1 ? "text-green-500" : "text-muted-foreground"
                                                )}
                                              />
                                              {isEnglish ? "At least 8 characters" : "Minimaal 8 tekens"}
                                            </li>
                                            <li className="flex items-center">
                                              <CheckCircle2Icon
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  /[A-Z]/.test(registerForm.getValues("password") || "") ? "text-green-500" : "text-muted-foreground"
                                                )}
                                              />
                                              {isEnglish ? "One uppercase letter" : "Eén hoofdletter"}
                                            </li>
                                            <li className="flex items-center">
                                              <CheckCircle2Icon
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  /[a-z]/.test(registerForm.getValues("password") || "") ? "text-green-500" : "text-muted-foreground"
                                                )}
                                              />
                                              {isEnglish ? "One lowercase letter" : "Eén kleine letter"}
                                            </li>
                                            <li className="flex items-center">
                                              <CheckCircle2Icon
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  /[0-9]/.test(registerForm.getValues("password") || "") ? "text-green-500" : "text-muted-foreground"
                                                )}
                                              />
                                              {isEnglish ? "One number" : "Eén cijfer"}
                                            </li>
                                            <li className="flex items-center">
                                              <CheckCircle2Icon
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  /[^A-Za-z0-9]/.test(registerForm.getValues("password") || "") ? "text-green-500" : "text-muted-foreground"
                                                )}
                                              />
                                              {isEnglish ? "One special character" : "Eén speciaal teken"}
                                            </li>
                                          </ul>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={registerForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{isEnglish ? "Confirm Password" : "Bevestig Wachtwoord"}</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="password" 
                                            placeholder={isEnglish ? "Confirm your password" : "Bevestig je wachtwoord"}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={registerForm.control}
                                    name="terms"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel>
                                            {isEnglish 
                                              ? "I agree to the terms and conditions" 
                                              : "Ik ga akkoord met de algemene voorwaarden"}
                                          </FormLabel>
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                                    {registerMutation.isPending ? (
                                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEnglish ? "Registering..." : "Registreren..."}</>
                                    ) : (
                                      <>{isEnglish ? "Register" : "Registreren"}</>
                                    )}
                                  </Button>
                                  
                                  <div className="mt-6">
                                    <div className="relative">
                                      <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                      </div>
                                      <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                          {isEnglish ? "Or continue with" : "Of ga verder met"}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 flex gap-2">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full" 
                                        onClick={handleGoogleSignIn}
                                        disabled={isSocialLoading !== null}
                                      >
                                        {isSocialLoading === "google" ? (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                          <FcGoogle className="mr-2 h-4 w-4" />
                                        )}
                                        Google
                                      </Button>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={handleGithubSignIn}
                                        disabled={isSocialLoading !== null}
                                      >
                                        {isSocialLoading === "github" ? (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                          <Github className="mr-2 h-4 w-4" />
                                        )}
                                        GitHub
                                      </Button>
                                    </div>
                                  </div>
                                </form>
                              </Form>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                  </motion.div>
                </div>
                
                {/* Hero Section */}
                <div className="hidden lg:block">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h1 className="text-4xl font-bold tracking-tight">
                        {isEnglish 
                          ? "Welcome to TechWithYou" 
                          : "Welkom bij TechWithYou"}
                      </h1>
                      <p className="mt-4 text-lg text-muted-foreground">
                        {isEnglish 
                          ? "Your partner for exceptional digital experiences. Log in to access your project dashboard and collaborate with our team."
                          : "Uw partner voor uitzonderlijke digitale ervaringen. Log in om toegang te krijgen tot uw projectdashboard en samen te werken met ons team."}
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                          <CheckCircle2Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">
                          {isEnglish 
                            ? "Secure access to your project dashboard" 
                            : "Beveiligde toegang tot uw projectdashboard"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                          <CheckCircle2Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">
                          {isEnglish 
                            ? "Track project milestones and progress" 
                            : "Volg projectmijlpalen en voortgang"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                          <CheckCircle2Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">
                          {isEnglish 
                            ? "Communicate directly with our team" 
                            : "Communiceer direct met ons team"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                          <CheckCircle2Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-medium">
                          {isEnglish 
                            ? "Access and approve design materials" 
                            : "Bekijk en keur ontwerpmaterialen goed"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}