import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { trackEvent } from "@/lib/analytics";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { DashboardTour } from "@/components/DashboardTour";
import { ChatInterface } from "@/components/ChatInterface";
import { Project, InsertProject } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Bell, User, LogOut, Briefcase, Clock, FileText, ChevronRight, Star, PlusCircle, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Projectformulier validatieschema
const projectFormSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  type: z.string().min(1, {
    message: "Please select a project type.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  existingWebsite: z.string().optional(),
  targetAudience: z.string().optional(),
  designPreferences: z.string().optional(),
  features: z.string().optional(),
  competitors: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  timeframe: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  needsDomain: z.boolean(),
  hasDomain: z.boolean(),
  domainName: z.string().optional(),
  needsLogo: z.boolean(),
  hasLogo: z.boolean(),
  logoFile: z.any().optional(),
  needsHosting: z.boolean(),
  needsDesign: z.boolean(),
  needsDevelopment: z.boolean(),
  needsSEO: z.boolean(),
  needsMaintenance: z.boolean(),
}).refine((data) => {
  // Tenminste één TechWithYou dienst moet geselecteerd zijn
  return data.needsDesign || data.needsDevelopment || data.needsHosting || data.needsSEO || data.needsMaintenance;
}, {
  message: "Select at least one TechWithYou service",
  path: ["services"]
}).refine((data) => {
  // Voor domein moet ofwel needsDomain of hasDomain true zijn
  return data.needsDomain || data.hasDomain;
}, {
  message: "Select domain option",
  path: ["domainOption"]  
}).refine((data) => {
  // Voor logo moet ofwel needsLogo of hasLogo true zijn
  return data.needsLogo || data.hasLogo;
}, {
  message: "Select logo option",
  path: ["logoOption"]
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function DashboardPage() {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const { user, logoutMutation } = useAuth();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = isEnglish ? enUS : nl;
  const { toast } = useToast();
  
  // State voor welkomstscherm en tour
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  
  // Controleer of dit de eerste keer is dat de gebruiker inlogt
  useEffect(() => {
    // Controleer of de gebruiker de tour of welkomstscherm al heeft gezien
    const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user?.id}`);
    const hasCompletedTour = localStorage.getItem(`tour_completed_${user?.id}`);
    
    if (user && !hasSeenWelcome) {
      // Wacht even zodat de pagina eerst goed kan laden
      const timer = setTimeout(() => {
        setShowWelcomeScreen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      existingWebsite: "",
      targetAudience: "",
      designPreferences: "",
      features: "",
      competitors: "",
      budget: "",
      deadline: "",
      timeframe: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      needsDomain: false,
      hasDomain: false,
      domainName: "",
      needsLogo: false,
      hasLogo: false,
      logoFile: null,
      needsHosting: false,
      needsDesign: false,
      needsDevelopment: false,
      needsSEO: false,
      needsMaintenance: false,
    },
    mode: "onChange", // Valideren bij iedere wijziging
  });

  // Mutation for creating a new project
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      console.log("Creating project with data:", data);
      console.log("User ID:", user?.id);
      
      // Creëer het juiste formaat voor de API
      const projectData = {
        ...data,
        userId: user?.id,
        status: "pending", // Project start als 'pending' en wacht op goedkeuring door admin
        metaData: {
          notifyAdmin: true,
          submittedAt: new Date().toISOString(),
          services: {
            needsHosting: data.needsHosting,
            needsDesign: data.needsDesign,
            needsDevelopment: data.needsDevelopment,
            needsSEO: data.needsSEO,
            needsMaintenance: data.needsMaintenance
          },
          domain: {
            needsDomain: data.needsDomain,
            hasDomain: data.hasDomain,
            domainName: data.domainName
          },
          logo: {
            needsLogo: data.needsLogo,
            hasLogo: data.hasLogo
          },
          contact: {
            person: data.contactPerson,
            email: data.contactEmail,
            phone: data.contactPhone
          }
        }
      };
      
      console.log("Formatted project data:", projectData);
      
      const res = await apiRequest("POST", "/api/dashboard/projects", projectData);
      return await res.json();
    },
    onSuccess: (response) => {
      console.log("Project created successfully:", response);
      
      // Reset form and close dialog
      form.reset();
      setIsCreateProjectOpen(false);
      
      // Invalidate de projecten query
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/projects"] });
      
      // Invalidate admin notifications en projecten
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      
      // Show success toast with green color
      toast({
        title: isEnglish ? "Project Request Submitted!" : "Projectaanvraag Ingediend!",
        description: isEnglish 
          ? "Your project request has been sent to our team and will appear in your dashboard with 'Pending' status."
          : "Je projectaanvraag is verzonden naar ons team en zal in je dashboard verschijnen met de status 'In afwachting'.",
        variant: "default",
        className: "bg-green-50 border-green-200",
      });
      
      // Track event
      trackEvent("project_created", "engagement", "dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: isEnglish ? "Failed to Create Project" : "Project Aanmaken Mislukt",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Track dashboard visit
  useState(() => {
    trackEvent("dashboard_visit", "client", "dashboard_page", 1);
  });

  const {
    data: projects = [],
    isLoading: isLoadingProjects,
  } = useQuery<Project[]>({
    queryKey: ["/api/dashboard/projects"],
    queryFn: getQueryFn<Project[]>({ on401: "throw" }),
    enabled: !!user,
  });

  type Notification = {
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link?: string;
    createdAt: string;
  };
  
  const {
    data: notifications = [],
    isLoading: isLoadingNotifications,
  } = useQuery<Notification[]>({
    queryKey: ["/api/dashboard/notifications"],
    queryFn: getQueryFn<Notification[]>({ on401: "throw" }),
    enabled: !!user,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Handlers voor welkomstscherm en tour
  const handleCloseWelcome = useCallback(() => {
    // Sla op dat de gebruiker het welkomstscherm heeft gezien
    if (user?.id) {
      localStorage.setItem(`welcome_seen_${user.id}`, 'true');
    }
    setShowWelcomeScreen(false);
  }, [user?.id]);
  
  const handleStartTour = useCallback(() => {
    // Sluit welkomstscherm en start tour
    setShowWelcomeScreen(false);
    
    // Toon debug informatie
    console.log("Tour started - preparation"); 
    console.log("Current dashboard elements:");
    console.log("- .dashboard-sidebar:", document.querySelector(".dashboard-sidebar"));
    console.log("- .dashboard-projects:", document.querySelector(".dashboard-projects"));
    console.log("- .dashboard-files:", document.querySelector(".dashboard-files"));
    console.log("- .dashboard-milestones:", document.querySelector(".dashboard-milestones"));
    console.log("- .dashboard-notifications:", document.querySelector(".dashboard-notifications"));
    
    // Forceer een refresh van de tour component door state te manipuleren
    localStorage.removeItem(`tour_completed_${user?.id}`);
    
    // Geef de DOM tijd om zich volledig te renderen voordat we de tour starten
    setTimeout(() => {
      console.log("Starting tour after delay");
      setShowTour(true);
      // Track gebeurtenis
      trackEvent("tour_started", "onboarding", "dashboard");
    }, 500);
  }, [user?.id, trackEvent]);
  
  const handleCompleteTour = useCallback(() => {
    // Sla op dat de gebruiker de tour heeft voltooid
    if (user?.id) {
      localStorage.setItem(`tour_completed_${user.id}`, 'true');
    }
    setShowTour(false);
    
    // Toon een bericht dat de tour is voltooid
    toast({
      title: isEnglish ? "Tour Completed" : "Rondleiding Voltooid",
      description: isEnglish 
        ? "You're all set! Explore your dashboard to manage your projects." 
        : "Je bent er helemaal klaar voor! Verken je dashboard om je projecten te beheren.",
    });
    
    // Track gebeurtenis
    trackEvent("tour_completed", "onboarding", "dashboard");
  }, [user?.id, isEnglish, toast, trackEvent]);
  
  const handleSkipTour = useCallback(() => {
    // Sla op dat de gebruiker de tour heeft overgeslagen
    if (user?.id) {
      localStorage.setItem(`tour_completed_${user.id}`, 'skipped');
    }
    setShowTour(false);
    
    // Track gebeurtenis
    trackEvent("tour_skipped", "onboarding", "dashboard");
  }, [user?.id, trackEvent]);

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "new": // Oude status, behouden voor backward compatibility
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "--";
    return format(new Date(dateString), "PPP", { locale });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return isEnglish ? "Pending Approval" : "Wacht op Goedkeuring";
      case "approved":
        return isEnglish ? "Approved" : "Goedgekeurd";
      case "rejected":
        return isEnglish ? "Changes Requested" : "Wijzigingen Gevraagd";
      case "new": // Oude status, behouden voor backward compatibility
        return isEnglish ? "Pending Approval" : "Wacht op Goedkeuring";
      case "planning":
        return isEnglish ? "Planning" : "Planning";
      case "in_progress":
      case "in-progress":
        return isEnglish ? "In Progress" : "In Uitvoering";
      case "review":
        return isEnglish ? "Review" : "Revisie";
      case "completed":
        return isEnglish ? "Completed" : "Voltooid";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={isEnglish ? "Client Dashboard | TechWithYou" : "Klantendashboard | TechWithYou"}
        description={
          isEnglish
            ? "Manage your projects and access important information in your personal TechWithYou dashboard."
            : "Beheer je projecten en krijg toegang tot belangrijke informatie in je persoonlijke TechWithYou dashboard."
        }
        noIndex={true}
      />
      
      {/* Welkomstscherm bij eerste login */}
      {showWelcomeScreen && (
        <WelcomeScreen 
          onClose={handleCloseWelcome}
          onStartTour={handleStartTour}
        />
      )}
      
      {/* Dashboard tour voor nieuwe gebruikers */}
      {showTour && (
        <DashboardTour
          onComplete={handleCompleteTour}
          onSkip={handleSkipTour}
        />
      )}
      <div className="dashboard-sidebar"><Header /></div>
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEnglish ? "Welcome back, " : "Welkom terug, "}
                <span className="text-primary">{user?.name || user?.username}</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEnglish
                  ? "Manage your projects and track progress from your dashboard"
                  : "Beheer je projecten en volg de voortgang vanaf je dashboard"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Notification icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative dashboard-notifications">
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 transform translate-x-1/4 -translate-y-1/4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>
                    {isEnglish ? "Notifications" : "Meldingen"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isLoadingNotifications ? (
                    <div className="py-4 text-center">
                      <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">
                      {isEnglish ? "No new notifications" : "Geen nieuwe meldingen"}
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification: any) => (
                      <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-sm text-muted-foreground">{notification.message}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || user?.username || ""} />
                      <AvatarFallback>{user?.name?.[0] || user?.username?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user?.name || user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{isEnglish ? "My Account" : "Mijn Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {isEnglish ? "Profile" : "Profiel"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {isEnglish ? "Projects" : "Projecten"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    {isEnglish ? "Documents" : "Documenten"}
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <a href="/admin">
                        <User className="mr-2 h-4 w-4" />
                        {isEnglish ? "Admin Dashboard" : "Admin Dashboard"}
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutMutation.isPending 
                      ? (isEnglish ? "Logging out..." : "Uitloggen...") 
                      : (isEnglish ? "Log out" : "Uitloggen")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="projects">
            <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
              <TabsTrigger value="projects" data-tour-target="projects-tab-trigger">
                <Briefcase className="h-4 w-4 mr-2" />
                {isEnglish ? "Projects" : "Projecten"}
              </TabsTrigger>
              <TabsTrigger value="files" data-tour-target="files-tab-trigger">
                <FileText className="h-4 w-4 mr-2" />
                {isEnglish ? "Documents" : "Documenten"}
              </TabsTrigger>
              <TabsTrigger value="activity" data-tour-target="activity-tab-trigger">
                <Clock className="h-4 w-4 mr-2" />
                {isEnglish ? "Activity" : "Activiteit"}
              </TabsTrigger>
              <TabsTrigger value="chat" data-tour-target="chat-tab-trigger">
                <MessageSquare className="h-4 w-4 mr-2" />
                {isEnglish ? "Chat" : "Chat"}
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="dashboard-projects">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold" data-tour-target="projects-title">{isEnglish ? "Your Projects" : "Jouw Projecten"}</h2>
                <Button onClick={() => setIsCreateProjectOpen(true)} className="create-project-button">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {isEnglish ? "New Project" : "Nieuw Project"}
                </Button>
              </div>

              {isLoadingProjects ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {isEnglish ? "No projects yet" : "Nog geen projecten"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      {isEnglish
                        ? "Get started by creating your first project or contact us to discuss your needs."
                        : "Begin met het aanmaken van je eerste project of neem contact met ons op om je wensen te bespreken."}
                    </p>
                    <Button onClick={() => setIsCreateProjectOpen(true)}>
                      {isEnglish ? "Create Your First Project" : "Maak Je Eerste Project Aan"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="relative h-40 bg-gradient-to-r from-primary/20 to-secondary/20">
                        {project.thumbnailUrl && (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/project/${project.id}`}>
                                  {isEnglish ? "View Details" : "Bekijk Details"}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {isEnglish ? "Edit Project" : "Project Bewerken"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                {isEnglish ? "Delete Project" : "Project Verwijderen"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className={getProjectStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Badge>
                            <CardTitle className="mt-2 text-lg">{project.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {project.description}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>{isEnglish ? "Type:" : "Type:"}</span>
                            <span className="font-medium text-foreground">{project.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{isEnglish ? "Start Date:" : "Startdatum:"}</span>
                            <span className="font-medium text-foreground">{formatDate(project.startDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button variant="outline" size="sm" className="gap-1" asChild>
                          <Link href={`/project/${project.id}`}>
                            {isEnglish ? "View Project" : "Bekijk Project"} 
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="dashboard-files" data-tour-target="files-tab">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold" data-tour-target="files-title">{isEnglish ? "Project Documents" : "Projectdocumenten"}</h2>
                <Button className="upload-document-button">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {isEnglish ? "Upload Document" : "Document Uploaden"}
                </Button>
              </div>

              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isEnglish ? "No documents yet" : "Nog geen documenten"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    {isEnglish
                      ? "Upload project documents to share them with the team."
                      : "Upload projectdocumenten om ze te delen met het team."}
                  </p>
                  <Button>
                    {isEnglish ? "Upload Your First Document" : "Upload Je Eerste Document"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="dashboard-milestones" data-tour-target="activity-tab">
              <div className="mb-6">
                <h2 className="text-xl font-semibold" data-tour-target="activity-title">{isEnglish ? "Recent Activity" : "Recente Activiteit"}</h2>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Sample activity items - these would come from the API in a real implementation */}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {isEnglish ? "Project started" : "Project gestart"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isEnglish ? "Your project 'Website Redesign' has been initiated" : "Je project 'Website Redesign' is gestart"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isEnglish ? "2 days ago" : "2 dagen geleden"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Create Project Dialog */}
      <AlertDialog open={isCreateProjectOpen} onOpenChange={(open) => {
        setIsCreateProjectOpen(open);
        if (!open) form.reset();
      }}>
        <AlertDialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEnglish ? "Create New Project" : "Nieuw Project Aanmaken"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEnglish
                ? "This will create a new project request that will be reviewed by our team."
                : "Dit maakt een nieuw projectverzoek aan dat door ons team zal worden beoordeeld."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createProjectMutation.mutate(data))} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isEnglish ? "Project Name" : "Projectnaam"} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={isEnglish ? "My New Website" : "Mijn Nieuwe Website"} {...field} />
                    </FormControl>
                    <FormDescription>
                      {isEnglish ? "Required field" : "Verplicht veld"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isEnglish ? "Project Type" : "Projecttype"} <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isEnglish ? "Select project type" : "Selecteer projecttype"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">{isEnglish ? "Website" : "Website"}</SelectItem>
                        <SelectItem value="webapp">{isEnglish ? "Web Application" : "Webapplicatie"}</SelectItem>
                        <SelectItem value="ecommerce">{isEnglish ? "E-commerce" : "E-commerce"}</SelectItem>
                        <SelectItem value="dashboard">{isEnglish ? "Dashboard" : "Dashboard"}</SelectItem>
                        <SelectItem value="mobile">{isEnglish ? "Mobile App" : "Mobiele App"}</SelectItem>
                        <SelectItem value="other">{isEnglish ? "Other" : "Anders"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Description" : "Omschrijving"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={isEnglish ? "Describe your project requirements..." : "Beschrijf je projectvereisten..."} 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="existingWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Existing Website (if any)" : "Bestaande Website (indien van toepassing)"}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isEnglish ? "e.g. https://example.com" : "bijv. https://voorbeeld.nl"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {isEnglish ? "If you have an existing website you want to redesign" : "Als je een bestaande website hebt die je wilt vernieuwen"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Target Audience" : "Doelgroep"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={isEnglish ? "Describe your target audience..." : "Beschrijf je doelgroep..."} 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="designPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Design Preferences" : "Design Voorkeuren"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={isEnglish ? "Describe your design preferences, style, colors, etc..." : "Beschrijf je design voorkeuren, stijl, kleuren, etc..."} 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Key Features Required" : "Gewenste Functionaliteiten"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={isEnglish ? "List the main features your project needs..." : "Noem de belangrijkste functionaliteiten die je project nodig heeft..."} 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="competitors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Competitors or Reference Sites" : "Concurrenten of Referentie Websites"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={isEnglish ? "List websites you like or competitors..." : "Noem websites die je leuk vindt of concurrenten..."} 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? "Budget (Optional)" : "Budget (Optioneel)"}</FormLabel>
                      <FormControl>
                        <Input placeholder="€" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? "Deadline (Optional)" : "Deadline (Optioneel)"}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Preferred Timeframe" : "Gewenste Tijdsbestek"}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isEnglish ? "e.g. 2-3 months, ASAP, etc." : "bijv. 2-3 maanden, zo snel mogelijk, etc."} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? "Contact Person" : "Contactpersoon"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? "Contact Email" : "Contact E-mail"}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? "Contact Phone" : "Telefoonnummer"}</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-6" />

              {/* TechWithYou Services Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {isEnglish ? "TechWithYou Services" : "TechWithYou Diensten"} <span className="text-destructive">*</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isEnglish 
                    ? "Select which services you need from TechWithYou (at least one required)" 
                    : "Selecteer welke diensten je nodig hebt van TechWithYou (tenminste één vereist)"}
                </p>
                {form.formState.errors.root?.message && form.formState.errors.root.message.includes("service") && (
                  <p className="text-sm text-destructive mb-2">
                    {isEnglish 
                      ? "Please select at least one service" 
                      : "Selecteer tenminste één dienst"}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="needsDesign"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {isEnglish ? "Website Design" : "Website Ontwerp"}
                          </FormLabel>
                          <FormDescription>
                            {isEnglish ? "UI/UX design for your project" : "UI/UX ontwerp voor je project"}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="needsDevelopment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {isEnglish ? "Development" : "Ontwikkeling"}
                          </FormLabel>
                          <FormDescription>
                            {isEnglish ? "Full development of your project" : "Volledige ontwikkeling van je project"}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="needsHosting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {isEnglish ? "Hosting" : "Hosting"}
                          </FormLabel>
                          <FormDescription>
                            {isEnglish ? "Managed hosting for your website" : "Beheerde hosting voor je website"}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="needsSEO"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {isEnglish ? "SEO Optimization" : "SEO Optimalisatie"}
                          </FormLabel>
                          <FormDescription>
                            {isEnglish ? "Improve search engine visibility" : "Verbeter zichtbaarheid in zoekmachines"}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="needsMaintenance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {isEnglish ? "Maintenance" : "Onderhoud"}
                          </FormLabel>
                          <FormDescription>
                            {isEnglish ? "Ongoing maintenance and updates" : "Doorlopend onderhoud en updates"}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Domain Name Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {isEnglish ? "Domain Name" : "Domeinnaam"} <span className="text-destructive">*</span>
                </h3>
                {form.formState.errors.root?.message && form.formState.errors.root.message.includes("domain") && (
                  <p className="text-sm text-destructive mb-2">
                    {isEnglish 
                      ? "Please select a domain option" 
                      : "Selecteer een domein optie"}
                  </p>
                )}
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hasDomain"
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
                            {isEnglish ? "I already have a domain name" : "Ik heb al een domeinnaam"}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("hasDomain") && (
                    <FormField
                      control={form.control}
                      name="domainName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isEnglish ? "Your Domain Name" : "Je Domeinnaam"}</FormLabel>
                          <FormControl>
                            <Input placeholder="example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {!form.watch("hasDomain") && (
                    <FormField
                      control={form.control}
                      name="needsDomain"
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
                              {isEnglish ? "I need TechWithYou to register a domain for me" : "Ik wil dat TechWithYou een domein voor me registreert"}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Logo Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {isEnglish ? "Logo" : "Logo"} <span className="text-destructive">*</span>
                </h3>
                {form.formState.errors.root?.message && form.formState.errors.root.message.includes("logo") && (
                  <p className="text-sm text-destructive mb-2">
                    {isEnglish 
                      ? "Please select a logo option" 
                      : "Selecteer een logo optie"}
                  </p>
                )}
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hasLogo"
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
                            {isEnglish ? "I already have a logo" : "Ik heb al een logo"}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("hasLogo") && (
                    <div className="grid gap-2">
                      <Label htmlFor="logo-upload">
                        {isEnglish ? "Upload your logo" : "Upload je logo"}
                      </Label>
                      <Input 
                        id="logo-upload" 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            form.setValue("logoFile", file);
                          }
                        }}
                      />
                    </div>
                  )}
                  
                  {!form.watch("hasLogo") && (
                    <FormField
                      control={form.control}
                      name="needsLogo"
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
                              {isEnglish ? "I need TechWithYou to design a logo for me" : "Ik wil dat TechWithYou een logo voor me ontwerpt"}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white dark:bg-gray-950 py-2 border-t mt-6">
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">
                    {isEnglish ? "Cancel" : "Annuleren"}
                  </AlertDialogCancel>
                  <AlertDialogAction type="submit" disabled={createProjectMutation.isPending || !form.formState.isValid}>
                    {createProjectMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEnglish ? "Submitting..." : "Bezig met indienen..."}
                      </>
                    ) : (
                      isEnglish ? "Submit Project Request" : "Projectaanvraag Indienen"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}