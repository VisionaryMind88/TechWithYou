import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
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

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  role: z.enum(["client", "admin"]).default("client"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const isEnglish = t('language') === 'en';

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      company: "",
      role: "client",
    },
  });

  const handleLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values);
    trackEvent("login_attempt", "auth", "login_form");
  };

  const handleRegister = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
    trackEvent("register_attempt", "auth", "register_form");
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
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
                      {activeTab === "login"
                        ? (isEnglish ? "Welcome back" : "Welkom terug")
                        : (isEnglish ? "Create an account" : "Maak een account aan")}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {activeTab === "login"
                        ? (isEnglish 
                            ? "Sign in to access your dashboard"
                            : "Log in om toegang te krijgen tot je dashboard")
                        : (isEnglish 
                            ? "Join Digitaal Atelier to manage your projects"
                            : "Word lid van Digitaal Atelier om je projecten te beheren")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">{isEnglish ? "Login" : "Inloggen"}</TabsTrigger>
                        <TabsTrigger value="register">{isEnglish ? "Register" : "Registreren"}</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login">
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
                      </TabsContent>
                      
                      <TabsContent value="register">
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
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{isEnglish ? "Full Name" : "Volledige naam"}</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder={isEnglish ? "Enter your full name" : "Voer je volledige naam in"} 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{isEnglish ? "Company (optional)" : "Bedrijf (optioneel)"}</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder={isEnglish ? "Enter your company name" : "Voer je bedrijfsnaam in"} 
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
                                      placeholder={isEnglish ? "Create a password" : "Maak een wachtwoord aan"} 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  {isEnglish ? "Creating account..." : "Account aanmaken..."}
                                </>
                              ) : (
                                isEnglish ? "Create Account" : "Account aanmaken"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    {activeTab === "login" ? (
                      <p>
                        {isEnglish ? "Don't have an account?" : "Nog geen account?"}{" "}
                        <Button variant="link" className="p-0" onClick={() => setActiveTab("register")}>
                          {isEnglish ? "Register" : "Registreer"}
                        </Button>
                      </p>
                    ) : (
                      <p>
                        {isEnglish ? "Already have an account?" : "Heb je al een account?"}{" "}
                        <Button variant="link" className="p-0" onClick={() => setActiveTab("login")}>
                          {isEnglish ? "Login" : "Log in"}
                        </Button>
                      </p>
                    )}
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