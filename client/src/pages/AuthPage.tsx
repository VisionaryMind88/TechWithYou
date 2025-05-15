import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect, Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";

import {
  Form,
  FormControl,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, loginMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const isEnglish = t('language') === 'en';

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values);
    trackEvent("login_attempt", "auth", "login_form", 1);
  };

  const handleForgotPassword = (values: ForgotPasswordFormValues) => {
    // In a real implementation, this would call an API endpoint to send a reset email
    console.log('Password reset requested for:', values.email);
    
    // Show a success message to the user
    alert(isEnglish 
      ? `Password reset instructions sent to ${values.email}`
      : `Wachtwoord reset instructies verzonden naar ${values.email}`);
    
    // Track the event
    trackEvent("forgot_password_attempt", "auth", "forgot_password_form", 1);
    
    // Reset the form and return to login
    forgotPasswordForm.reset();
    setShowForgotPassword(false);
  };

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
        title={isEnglish ? "Login or Register | Digitaal Atelier" : "Inloggen of Registreren | Digitaal Atelier"}
        description={
          isEnglish
            ? "Login to your Digitaal Atelier account or register for a new account to access your dashboard and manage your projects."
            : "Log in op je Digitaal Atelier-account of registreer voor een nieuw account om toegang te krijgen tot je dashboard en je projecten te beheren."
        }
      />
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Auth Forms */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">
                      {!showForgotPassword 
                        ? (isEnglish ? "Welcome back" : "Welkom terug")
                        : (isEnglish ? "Reset Password" : "Wachtwoord Resetten")}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {!showForgotPassword 
                        ? (isEnglish 
                            ? "Sign in to access your dashboard"
                            : "Log in om toegang te krijgen tot je dashboard")
                        : (isEnglish 
                            ? "Enter your email to receive reset instructions"
                            : "Voer je e-mail in om reset-instructies te ontvangen")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!showForgotPassword ? (
                      // Login Form
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{isEnglish ? "Username or Email" : "Gebruikersnaam of E-mail"}</FormLabel>
                                <FormControl>
                                  <Input placeholder={isEnglish ? "Enter your username" : "Voer je gebruikersnaam in"} {...field} />
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
                                <FormLabel>{isEnglish ? "Password" : "Wachtwoord"}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder={isEnglish ? "Enter your password" : "Voer je wachtwoord in"} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="button" 
                              variant="link" 
                              className="p-0 h-auto font-normal text-sm"
                              onClick={() => setShowForgotPassword(true)}
                            >
                              {isEnglish ? "Forgot password?" : "Wachtwoord vergeten?"}
                            </Button>
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEnglish ? "Logging in..." : "Inloggen..."}
                              </>
                            ) : (
                              isEnglish ? "Login" : "Inloggen"
                            )}
                          </Button>
                        </form>
                      </Form>
                    ) : (
                      // Forgot Password Form
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
                          <div className="flex justify-between pt-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setShowForgotPassword(false)}
                            >
                              {isEnglish ? "Back to Login" : "Terug naar Inloggen"}
                            </Button>
                            <Button type="submit">
                              {isEnglish ? "Reset Password" : "Reset Wachtwoord"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    <p>
                      {isEnglish 
                        ? "For registration inquiries, please contact us" 
                        : "Voor registratie-aanvragen, neem contact met ons op"}{" "}
                      <Link href="/contact">
                        <Button variant="link" className="p-0">
                          {isEnglish ? "here" : "hier"}
                        </Button>
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-first lg:order-last"
            >
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  {isEnglish 
                    ? "Your personal client dashboard" 
                    : "Je persoonlijke klantendashboard"}
                </h1>
                <p className="text-lg text-muted-foreground max-w-prose">
                  {isEnglish
                    ? "Access your projects, track progress, and communicate with our team from one secure location."
                    : "Krijg toegang tot je projecten, volg de voortgang en communiceer met ons team vanaf één veilige locatie."}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">{isEnglish ? "Project Management" : "Projectbeheer"}</h3>
                    <p className="text-muted-foreground text-sm">
                      {isEnglish
                        ? "Track your project milestones and stay informed on progress."
                        : "Volg je projectmijlpalen en blijf op de hoogte van de voortgang."}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">{isEnglish ? "Document Sharing" : "Documenten delen"}</h3>
                    <p className="text-muted-foreground text-sm">
                      {isEnglish
                        ? "Upload and access project documents in a secure environment."
                        : "Upload en krijg toegang tot projectdocumenten in een veilige omgeving."}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">{isEnglish ? "Communication" : "Communicatie"}</h3>
                    <p className="text-muted-foreground text-sm">
                      {isEnglish
                        ? "Direct messaging with our team for real-time updates."
                        : "Directe berichten met ons team voor real-time updates."}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">{isEnglish ? "Notifications" : "Meldingen"}</h3>
                    <p className="text-muted-foreground text-sm">
                      {isEnglish
                        ? "Stay updated with important project notifications."
                        : "Blijf op de hoogte met belangrijke projectmeldingen."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}