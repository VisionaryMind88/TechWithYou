import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { UploadFileForm } from "@/components/UploadFileForm";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { trackEvent } from "@/lib/analytics";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";

// Types
import { Project, Milestone, ProjectFile } from "@shared/schema";

// UI Components
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  MoreVertical,
  PlusCircle,
  Trash2,
  CheckCircle2,
  CircleDashed,
  Circle,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Loader2,
} from "lucide-react";

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const { user } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute<{ id: string }>("/project/:id");
  const [, navigate] = useLocation();
  const projectId = params?.id ? parseInt(params.id) : null;
  const locale = isEnglish ? enUS : nl;
  
  // Tab state
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialog states
  const [isAddMilestoneDialogOpen, setIsAddMilestoneDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Track project view
  useEffect(() => {
    if (projectId) {
      trackEvent("project_detail_view", "client", "project_management", 1);
    }
  }, [projectId]);
  
  // Redirect if no projectId
  useEffect(() => {
    if (!projectId) {
      navigate("/dashboard");
    }
  }, [projectId, navigate]);
  
  // Fetch project details
  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useQuery<Project>({
    queryKey: ["/api/dashboard/projects", projectId],
    queryFn: getQueryFn<Project>({ on401: "throw" }),
    enabled: !!projectId && !!user,
  });
  
  // Fetch project milestones
  const {
    data: milestones = [],
    isLoading: isLoadingMilestones,
  } = useQuery<Milestone[]>({
    queryKey: ["/api/dashboard/projects", projectId, "milestones"],
    queryFn: getQueryFn<Milestone[]>({ on401: "throw" }),
    enabled: !!projectId && !!user,
  });
  
  // Fetch project files
  const {
    data: files = [],
    isLoading: isLoadingFiles,
  } = useQuery<ProjectFile[]>({
    queryKey: ["/api/dashboard/projects", projectId, "files"],
    queryFn: getQueryFn<ProjectFile[]>({ on401: "throw" }),
    enabled: !!projectId && !!user,
  });
  
  // Format date helper
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "--";
    return format(new Date(dateString), "PPP", { locale });
  };
  
  // Get project status text based on status code
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return isEnglish ? "Pending Approval" : "Wacht op Goedkeuring";
      case "approved":
        return isEnglish ? "Approved" : "Goedgekeurd";
      case "rejected":
        return isEnglish ? "Changes Requested" : "Wijzigingen Gevraagd";
      case "proposal": // Oude status, behouden voor backward compatibility
        return isEnglish ? "Pending Approval" : "Wacht op Goedkeuring";
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
  
  // Calculate project completion percentage based on milestones
  const calculateProjectProgress = () => {
    if (!milestones || milestones.length === 0) return 0;
    
    const completedMilestones = milestones.filter(m => m.status === "completed").length;
    return Math.round((completedMilestones / milestones.length) * 100);
  };
  
  // Get milestone status icon
  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Circle className="h-5 w-5 text-yellow-500" />;
      case "pending":
      default:
        return <CircleDashed className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Handle loading and error states
  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-96" />
              </div>
              <Skeleton className="h-60 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (projectError || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              {isEnglish ? "Project Not Found" : "Project Niet Gevonden"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isEnglish
                ? "The project you are looking for does not exist or you don't have permission to view it."
                : "Het project dat je zoekt bestaat niet of je hebt geen toestemming om het te bekijken."}
            </p>
            <Button asChild>
              <Link href="/dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {isEnglish ? "Back to Dashboard" : "Terug naar Dashboard"}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate days remaining or overdue
  const calculateDaysRemaining = () => {
    if (!project.endDate) return null;
    
    const endDate = new Date(project.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining();
  const projectProgress = calculateProjectProgress();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${project.name} | ${isEnglish ? "Project Dashboard" : "Projectdashboard"} | Digitaal Atelier`}
        description={isEnglish
          ? `View details, milestones, and files for your project "${project.name}"`
          : `Bekijk details, mijlpalen en bestanden voor je project "${project.name}"`}
        noIndex={true}
      />
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-1 p-0 hover:bg-transparent">
              <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4" />
                <span>{isEnglish ? "Back to Dashboard" : "Terug naar Dashboard"}</span>
              </Link>
            </Button>
          </div>
          
          {/* Project header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`
                  ${project.status === "pending" || project.status === "proposal" ? "bg-orange-100 text-orange-800 border-orange-200" : ""}
                  ${project.status === "approved" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  ${project.status === "rejected" ? "bg-red-100 text-red-800 border-red-200" : ""}
                  ${project.status === "in-progress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                  ${project.status === "review" ? "bg-purple-100 text-purple-800 border-purple-200" : ""}
                  ${project.status === "completed" ? "bg-green-100 text-green-800 border-green-200" : ""}
                `}>
                  {getStatusText(project.status)}
                </Badge>
                <Badge variant="outline">{project.type}</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditProjectDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEnglish ? "Edit" : "Bewerken"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {isEnglish ? "Project Actions" : "Project Acties"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsUploadFileDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isEnglish ? "Upload Files" : "Bestanden Uploaden"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAddMilestoneDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isEnglish ? "Add Milestone" : "Mijlpaal Toevoegen"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isEnglish ? "Delete Project" : "Project Verwijderen"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Project stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isEnglish ? "Progress" : "Voortgang"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">{projectProgress}%</div>
                  <Progress value={projectProgress} className="h-2 flex-1" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isEnglish
                    ? `${milestones.filter(m => m.status === "completed").length} of ${milestones.length} milestones completed`
                    : `${milestones.filter(m => m.status === "completed").length} van ${milestones.length} mijlpalen voltooid`}
                </p>
              </CardContent>
            </Card>
            
            {/* Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isEnglish ? "Timeline" : "Tijdlijn"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{isEnglish ? "Start" : "Start"}</span>
                    </div>
                    <span className="font-medium">{formatDate(project.startDate)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{isEnglish ? "Deadline" : "Deadline"}</span>
                    </div>
                    <span className="font-medium">{formatDate(project.endDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Time Remaining */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isEnglish ? "Time Remaining" : "Resterende Tijd"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    {daysRemaining === null ? (
                      <div className="text-muted-foreground text-sm">
                        {isEnglish ? "No deadline set" : "Geen deadline ingesteld"}
                      </div>
                    ) : daysRemaining > 0 ? (
                      <>
                        <div className="text-2xl font-bold">{daysRemaining}</div>
                        <div className="text-xs text-muted-foreground">
                          {isEnglish
                            ? `${daysRemaining === 1 ? "day" : "days"} remaining`
                            : `${daysRemaining === 1 ? "dag" : "dagen"} resterend`}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-red-500">{Math.abs(daysRemaining)}</div>
                        <div className="text-xs text-red-500">
                          {isEnglish
                            ? `${Math.abs(daysRemaining) === 1 ? "day" : "days"} overdue`
                            : `${Math.abs(daysRemaining) === 1 ? "dag" : "dagen"} te laat`}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Budget */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isEnglish ? "Budget" : "Budget"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {project.budget || (isEnglish ? "Not set" : "Niet ingesteld")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Project content tabs */}
          <Tabs defaultValue="overview" className="mb-12" onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="overview">
                <Eye className="h-4 w-4 mr-2" />
                {isEnglish ? "Overview" : "Overzicht"}
              </TabsTrigger>
              <TabsTrigger value="milestones">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isEnglish ? "Milestones" : "Mijlpalen"}
              </TabsTrigger>
              <TabsTrigger value="files">
                <FileText className="h-4 w-4 mr-2" />
                {isEnglish ? "Files" : "Bestanden"}
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{isEnglish ? "Project Description" : "Projectbeschrijving"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{project.description}</p>
                      {project.metaData && typeof project.metaData === 'object' && (
                        <div className="mt-6">
                          <h3 className="font-semibold mb-3">{isEnglish ? "Additional Details" : "Aanvullende Details"}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(project.metaData as Record<string, unknown>).map(([key, value]) => (
                              <div key={key} className="flex flex-col">
                                <span className="text-sm text-muted-foreground">{key}</span>
                                <span>{typeof value === 'string' ? value : String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{isEnglish ? "Recent Files" : "Recente Bestanden"}</CardTitle>
                        <CardDescription>
                          {isEnglish ? "Recently added project files" : "Recent toegevoegde projectbestanden"}
                        </CardDescription>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href="#" onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("files");
                        }}>
                          {isEnglish ? "View All" : "Bekijk Alles"}
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {isLoadingFiles ? (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      ) : files.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          {isEnglish ? "No files have been uploaded yet" : "Er zijn nog geen bestanden geüpload"}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {files.slice(0, 3).map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center">
                                <File className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {`${file.fileType.toUpperCase()} • ${Math.round(file.fileSize / 1024)} KB • ${formatDate(file.createdAt)}`}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Download className="h-4 w-4" />
                                {isEnglish ? "Download" : "Download"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{isEnglish ? "Upcoming Milestones" : "Aankomende Mijlpalen"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingMilestones ? (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      ) : milestones.filter(m => m.status !== "completed").length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          {isEnglish ? "No upcoming milestones" : "Geen aankomende mijlpalen"}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {milestones
                            .filter(m => m.status !== "completed")
                            .sort((a, b) => {
                              if (!a.dueDate) return 1;
                              if (!b.dueDate) return -1;
                              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                            })
                            .slice(0, 3)
                            .map((milestone) => (
                              <div key={milestone.id} className="p-3 border rounded-md">
                                <div className="flex items-start mb-2">
                                  {getMilestoneStatusIcon(milestone.status)}
                                  <div className="ml-2">
                                    <h4 className="font-medium">{milestone.title}</h4>
                                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                                  </div>
                                </div>
                                {milestone.dueDate && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {isEnglish ? "Due: " : "Deadline: "}
                                    {formatDate(milestone.dueDate)}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full mt-4" 
                        onClick={() => setActiveTab("milestones")}
                      >
                        {isEnglish ? "View All Milestones" : "Bekijk Alle Mijlpalen"}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>{isEnglish ? "Project Details" : "Projectdetails"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            {isEnglish ? "Project Type" : "Projecttype"}
                          </span>
                          <span className="font-medium">{project.type}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            {isEnglish ? "Status" : "Status"}
                          </span>
                          <span className="font-medium">{getStatusText(project.status)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            {isEnglish ? "Created" : "Aangemaakt"}
                          </span>
                          <span className="font-medium">{formatDate(project.createdAt)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            {isEnglish ? "Last Updated" : "Laatst Bijgewerkt"}
                          </span>
                          <span className="font-medium">{formatDate(project.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Milestones Tab */}
            <TabsContent value="milestones">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      {isEnglish ? "Project Milestones" : "Projectmijlpalen"}
                    </CardTitle>
                    <CardDescription>
                      {isEnglish
                        ? "Track the progress of your project with milestones"
                        : "Volg de voortgang van je project met mijlpalen"}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsAddMilestoneDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isEnglish ? "Add Milestone" : "Mijlpaal Toevoegen"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingMilestones ? (
                    <div className="space-y-6">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : milestones.length === 0 ? (
                    <div className="text-center py-12">
                      <CircleDashed className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {isEnglish ? "No milestones yet" : "Nog geen mijlpalen"}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        {isEnglish
                          ? "Add milestones to track the progress of your project. Milestones help you stay on track and meet your deadlines."
                          : "Voeg mijlpalen toe om de voortgang van je project te volgen. Mijlpalen helpen je om op schema te blijven en je deadlines te halen."}
                      </p>
                      <Button onClick={() => setIsAddMilestoneDialogOpen(true)}>
                        {isEnglish ? "Add First Milestone" : "Voeg Eerste Mijlpaal Toe"}
                      </Button>
                    </div>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-muted">
                      {milestones
                        .sort((a, b) => a.order - b.order)
                        .map((milestone, index) => (
                          <div key={milestone.id} className="mb-10 relative">
                            <div className="absolute -left-[25px] mt-1">
                              {getMilestoneStatusIcon(milestone.status)}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                                  <p className="text-muted-foreground mt-1">{milestone.description}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      {isEnglish ? "Edit Milestone" : "Mijlpaal Bewerken"}
                                    </DropdownMenuItem>
                                    {milestone.status !== "completed" ? (
                                      <DropdownMenuItem>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        {isEnglish ? "Mark as Completed" : "Markeren als Voltooid"}
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem>
                                        <CircleDashed className="h-4 w-4 mr-2" />
                                        {isEnglish ? "Mark as In Progress" : "Markeren als In Uitvoering"}
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {isEnglish ? "Delete Milestone" : "Mijlpaal Verwijderen"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                {milestone.dueDate && (
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {isEnglish ? "Due: " : "Deadline: "}
                                    {formatDate(milestone.dueDate)}
                                  </div>
                                )}
                                {milestone.completedDate && (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    {isEnglish ? "Completed: " : "Voltooid: "}
                                    {formatDate(milestone.completedDate)}
                                  </div>
                                )}
                                <div className={`flex items-center ${
                                  milestone.status === "completed" 
                                    ? "text-green-600" 
                                    : milestone.status === "in-progress" 
                                      ? "text-yellow-600" 
                                      : "text-muted-foreground"
                                }`}>
                                  <Circle className="h-4 w-4 mr-1" />
                                  {milestone.status === "completed"
                                    ? (isEnglish ? "Completed" : "Voltooid")
                                    : milestone.status === "in-progress"
                                      ? (isEnglish ? "In Progress" : "In Uitvoering")
                                      : (isEnglish ? "Pending" : "In Afwachting")}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Files Tab */}
            <TabsContent value="files">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      {isEnglish ? "Project Files" : "Projectbestanden"}
                    </CardTitle>
                    <CardDescription>
                      {isEnglish
                        ? "Access and manage files related to your project"
                        : "Toegang tot en beheer van bestanden gerelateerd aan je project"}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsUploadFileDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isEnglish ? "Upload File" : "Bestand Uploaden"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingFiles ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : files.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {isEnglish ? "No files uploaded yet" : "Nog geen bestanden geüpload"}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        {isEnglish
                          ? "Upload files to share documents, designs, contracts, and other important documents for your project."
                          : "Upload bestanden om documenten, ontwerpen, contracten en andere belangrijke documenten voor je project te delen."}
                      </p>
                      <Button onClick={() => setIsUploadFileDialogOpen(true)}>
                        {isEnglish ? "Upload First File" : "Upload Eerste Bestand"}
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isEnglish ? "Name" : "Naam"}</TableHead>
                          <TableHead>{isEnglish ? "Type" : "Type"}</TableHead>
                          <TableHead>{isEnglish ? "Size" : "Grootte"}</TableHead>
                          <TableHead>{isEnglish ? "Uploaded On" : "Geüpload Op"}</TableHead>
                          <TableHead className="text-right">{isEnglish ? "Actions" : "Acties"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {files.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 text-muted-foreground" />
                                {file.name}
                              </div>
                            </TableCell>
                            <TableCell>{file.fileType.toUpperCase()}</TableCell>
                            <TableCell>{Math.round(file.fileSize / 1024)} KB</TableCell>
                            <TableCell>{formatDate(file.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                  <Download className="h-3 w-3" />
                                  {isEnglish ? "Download" : "Download"}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
      {/* Add milestone dialog - Just the structure for now */}
      <Dialog open={isAddMilestoneDialogOpen} onOpenChange={setIsAddMilestoneDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEnglish ? "Add New Milestone" : "Nieuwe Mijlpaal Toevoegen"}
            </DialogTitle>
            <DialogDescription>
              {isEnglish
                ? "Create a new milestone to track your project progress"
                : "Maak een nieuwe mijlpaal aan om je projectvoortgang te volgen"}
            </DialogDescription>
          </DialogHeader>
          
          {/* Milestone form would go here */}
          <div className="py-4">
            {/* Form placeholder */}
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                {isEnglish
                  ? "Milestone form will be implemented in the next phase."
                  : "Mijlpaalformulier wordt in de volgende fase geïmplementeerd."}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMilestoneDialogOpen(false)}>
              {isEnglish ? "Cancel" : "Annuleren"}
            </Button>
            <Button type="submit">
              {isEnglish ? "Save Milestone" : "Mijlpaal Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File upload dialog */}
      <Dialog open={isUploadFileDialogOpen} onOpenChange={setIsUploadFileDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEnglish ? "Upload File" : "Bestand Uploaden"}
            </DialogTitle>
            <DialogDescription>
              {isEnglish
                ? "Upload a file to share with the project team."
                : "Upload een bestand om te delen met het projectteam."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <UploadFileForm 
              projectId={projectId} 
              onSuccess={() => {
                setIsUploadFileDialogOpen(false);
                // Vernieuw de lijst met bestanden
                queryClient.invalidateQueries({
                  queryKey: ["/api/dashboard/projects", projectId, "files"]
                });
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete project confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEnglish ? "Delete Project" : "Project Verwijderen"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEnglish
                ? "Are you sure you want to delete this project? This action cannot be undone."
                : "Weet je zeker dat je dit project wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isEnglish ? "Cancel" : "Annuleren"}
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              {isEnglish ? "Delete Project" : "Project Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}