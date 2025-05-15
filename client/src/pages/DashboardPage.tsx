import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { trackEvent } from "@/lib/analytics";
import { Project } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";

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
import { Loader2, MoreVertical, Bell, User, LogOut, Briefcase, Clock, FileText, ChevronRight, Star, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const { user, logoutMutation } = useAuth();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const locale = isEnglish ? enUS : nl;

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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "proposal":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "--";
    return format(new Date(dateString), "PPP", { locale });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "proposal":
        return isEnglish ? "Proposal" : "Voorstel";
      case "in-progress":
        return isEnglish ? "In Progress" : "In Uitvoering";
      case "review":
        return isEnglish ? "Review" : "Revisie";
      case "completed":
        return isEnglish ? "Completed" : "Voltooid";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={isEnglish ? "Client Dashboard | Digitaal Atelier" : "Klantendashboard | Digitaal Atelier"}
        description={
          isEnglish
            ? "Manage your projects and access important information in your personal Digitaal Atelier dashboard."
            : "Beheer je projecten en krijg toegang tot belangrijke informatie in je persoonlijke Digitaal Atelier dashboard."
        }
        noIndex={true}
      />
      <Header />
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
                  <Button variant="outline" size="icon" className="relative">
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
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="projects">
                <Briefcase className="h-4 w-4 mr-2" />
                {isEnglish ? "Projects" : "Projecten"}
              </TabsTrigger>
              <TabsTrigger value="files">
                <FileText className="h-4 w-4 mr-2" />
                {isEnglish ? "Documents" : "Documenten"}
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="h-4 w-4 mr-2" />
                {isEnglish ? "Activity" : "Activiteit"}
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{isEnglish ? "Your Projects" : "Jouw Projecten"}</h2>
                <Button onClick={() => setIsCreateProjectOpen(true)}>
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
                              <DropdownMenuItem>
                                {isEnglish ? "View Details" : "Bekijk Details"}
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
                        <Button variant="outline" size="sm" className="gap-1">
                          {isEnglish ? "View Project" : "Bekijk Project"} 
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{isEnglish ? "Project Documents" : "Projectdocumenten"}</h2>
                <Button>
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
            <TabsContent value="activity">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{isEnglish ? "Recent Activity" : "Recente Activiteit"}</h2>
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
      <AlertDialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <AlertDialogContent>
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
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? "Project creation form would be here. Currently, this is a placeholder as we need to implement the full form."
                : "Hier zou het formulier voor het aanmaken van projecten staan. Dit is momenteel een tijdelijke aanduiding, omdat we het volledige formulier nog moeten implementeren."}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isEnglish ? "Cancel" : "Annuleren"}
            </AlertDialogCancel>
            <AlertDialogAction>
              {isEnglish ? "Submit Project Request" : "Projectaanvraag Indienen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}