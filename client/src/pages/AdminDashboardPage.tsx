import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Redirect } from "wouter";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, PlusCircle, Edit, Trash, UserIcon, Search, FileText, Bell, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Import types from schema
import { User as UserType, Project, Contact, Notification } from "@shared/schema";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("clients");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  
  // Tracking analytics on page visit
  useEffect(() => {
    trackEvent("admin_dashboard_visit", "admin", "dashboard_page", 1);
  }, []);

  // Redirect if not logged in or not an admin
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  if (user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  // Fetch clients (users with role 'client')
  const {
    data: clients = [],
    isLoading: isLoadingClients,
  } = useQuery<UserType[]>({
    queryKey: ["/api/admin/clients"],
    queryFn: getQueryFn<UserType[]>({ on401: "throw" }),
    enabled: !!user && user.role === "admin",
  });

  // Type for project metadata
  interface ProjectMetaData {
    services?: string[];
    domain?: {
      hasOwn: boolean;
      name?: string;
    };
    logo?: {
      hasOwn: boolean;
      fileUrl?: string;
    };
    [key: string]: any;
  }

  // Fetch all projects
  const {
    data: projects = [],
    isLoading: isLoadingProjects,
  } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
    queryFn: getQueryFn<Project[]>({ on401: "throw" }),
    enabled: !!user && user.role === "admin",
  });

  // Approve project mutation
  const approveProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const res = await apiRequest("PUT", `/api/admin/projects/${projectId}`, {
        status: "planning"
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({
        title: isEnglish ? "Project approved" : "Project goedgekeurd",
        description: isEnglish 
          ? "The project has been approved and moved to planning stage" 
          : "Het project is goedgekeurd en verplaatst naar de planningsfase",
      });
      trackEvent("project_approved", "admin", "project_management");
    },
    onError: (error: Error) => {
      toast({
        title: isEnglish ? "Failed to approve project" : "Project goedkeuring mislukt",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Fetch all contact form submissions
  const {
    data: contacts = [],
    isLoading: isLoadingContacts,
  } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: getQueryFn<Contact[]>({ on401: "throw" }),
    enabled: !!user && user.role === "admin",
  });

  // Mark contact as read mutation
  const markContactReadMutation = useMutation({
    mutationFn: async (contactId: number) => {
      const res = await apiRequest("POST", `/api/admin/contacts/${contactId}/read`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      trackEvent("mark_contact_read", "admin", "contact_management", 1);
    },
  });
  
  // Create new client account mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: { 
      username: string; 
      email: string; 
      name: string; 
      password: string 
    }) => {
      const res = await apiRequest("POST", "/api/admin/clients", clientData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create client");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      setIsAddClientDialogOpen(false);
      form.reset();
      toast({
        title: isEnglish ? "Client created successfully" : "Klant succesvol aangemaakt",
        description: isEnglish 
          ? `${data.name} can now log in using their credentials` 
          : `${data.name} kan nu inloggen met deze gegevens`,
        variant: "default",
      });
      trackEvent("create_client", "admin", "client_management", 1);
    },
    onError: (error: Error) => {
      toast({
        title: isEnglish ? "Failed to create client" : "Klant aanmaken mislukt",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Define client form schema inside component
  const clientFormSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters"
    }),
    email: z.string().email({
      message: "Please enter a valid email address"
    }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters"
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters"
    }),
  });
  
  // Define the form
  type ClientFormValues = z.infer<typeof clientFormSchema>;
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
    },
  });
  
  // Handle form submission
  function onSubmit(data: ClientFormValues) {
    createClientMutation.mutate(data);
  }
  
  return (
    <>
      <SEO 
        title={isEnglish ? "Admin Dashboard | Digitaal Atelier" : "Admin Dashboard | Digitaal Atelier"} 
        description={isEnglish 
          ? "Admin control panel for managing clients, projects, and contacts at Digitaal Atelier" 
          : "Administratiepaneel voor het beheren van klanten, projecten en contacten bij Digitaal Atelier"} 
        noIndex={true}
      />
      
      {/* Add Client Dialog */}
      <Dialog 
        open={isAddClientDialogOpen} 
        onOpenChange={(open) => {
          setIsAddClientDialogOpen(open);
          if (!open) form.reset();
        }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEnglish ? "Add New Client" : "Nieuwe Klant Toevoegen"}</DialogTitle>
            <DialogDescription>
              {isEnglish 
                ? "Create a new client account. The client will be able to log in using these credentials." 
                : "Maak een nieuw klantaccount. De klant kan inloggen met deze gegevens."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Full Name" : "Volledige Naam"}</FormLabel>
                    <FormControl>
                      <Input placeholder={isEnglish ? "John Doe" : "Jan Jansen"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Email" : "E-mail"}</FormLabel>
                    <FormControl>
                      <Input placeholder={isEnglish ? "client@example.com" : "klant@voorbeeld.nl"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Username" : "Gebruikersnaam"}</FormLabel>
                    <FormControl>
                      <Input placeholder={isEnglish ? "client123" : "klant123"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? "Password" : "Wachtwoord"}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      {isEnglish ? "Must be at least 6 characters." : "Moet minimaal 6 tekens bevatten."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createClientMutation.isPending}
                >
                  {createClientMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEnglish ? "Creating..." : "Aanmaken..."}
                    </>
                  ) : (
                    isEnglish ? "Create Client" : "Klant Aanmaken"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Header />
      
      <main className="py-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEnglish ? "Admin Dashboard" : "Admin Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEnglish 
                  ? "Manage clients, projects, and website contact forms" 
                  : "Beheer klanten, projecten en website contactformulieren"}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Badge variant="outline" className="font-normal">
                {isEnglish ? "Logged in as" : "Ingelogd als"} {user?.name || user?.username}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {isEnglish ? "Logout" : "Uitloggen"}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="clients" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
              <TabsTrigger value="clients">
                <UserIcon className="h-4 w-4 mr-2" />
                {isEnglish ? "Clients" : "Klanten"}
              </TabsTrigger>
              <TabsTrigger value="newprojects">
                <PlusCircle className="h-4 w-4 mr-2" />
                {isEnglish ? "New Projects" : "Nieuwe Projecten"}
                {projects.filter(p => p.status === "new").length > 0 && (
                  <Badge className="ml-2" variant="destructive">
                    {projects.filter(p => p.status === "new").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="projects">
                <FileText className="h-4 w-4 mr-2" />
                {isEnglish ? "All Projects" : "Alle Projecten"}
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <Bell className="h-4 w-4 mr-2" />
                {isEnglish ? "Contact Requests" : "Contactverzoeken"}
                {contacts.filter(c => !c.read).length > 0 && (
                  <Badge className="ml-2" variant="destructive">
                    {contacts.filter(c => !c.read).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{isEnglish ? "Client Management" : "Klantenbeheer"}</CardTitle>
                    <CardDescription>
                      {isEnglish 
                        ? "Manage client accounts and access" 
                        : "Beheer klantaccounts en toegang"}
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsAddClientDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isEnglish ? "Add Client" : "Klant Toevoegen"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={isEnglish ? "Search clients..." : "Zoek klanten..."}
                      className="flex-1"
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {isLoadingClients ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>
                        {isEnglish 
                          ? `Total clients: ${clients.length}` 
                          : `Totaal aantal klanten: ${clients.length}`}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isEnglish ? "Name" : "Naam"}</TableHead>
                          <TableHead>{isEnglish ? "Email" : "E-mail"}</TableHead>
                          <TableHead>{isEnglish ? "Company" : "Bedrijf"}</TableHead>
                          <TableHead>{isEnglish ? "Projects" : "Projecten"}</TableHead>
                          <TableHead className="text-right">{isEnglish ? "Actions" : "Acties"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.length > 0 ? (
                          clients
                            .filter(client => 
                              !clientSearchQuery || 
                              client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                              client.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                              (client.company && client.company.toLowerCase().includes(clientSearchQuery.toLowerCase()))
                            )
                            .map((client) => {
                              const clientProjects = projects.filter(p => p.userId === client.id);
                              return (
                                <TableRow key={client.id}>
                                  <TableCell className="font-medium">{client.name}</TableCell>
                                  <TableCell>{client.email}</TableCell>
                                  <TableCell>{client.company || "-"}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {clientProjects.length}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="destructive" size="icon">
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              {isEnglish 
                                ? "No clients found. Add a client to get started." 
                                : "Geen klanten gevonden. Voeg een klant toe om te beginnen."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* New Projects Tab */}
            <TabsContent value="newprojects" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{isEnglish ? "New Project Requests" : "Nieuwe Projectaanvragen"}</CardTitle>
                    <CardDescription>
                      {isEnglish 
                        ? "Review and process new project requests from clients" 
                        : "Beoordeel en verwerk nieuwe projectaanvragen van klanten"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingProjects ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>
                        {isEnglish 
                          ? `New project requests: ${projects.filter(p => p.status === "new").length}` 
                          : `Nieuwe projectaanvragen: ${projects.filter(p => p.status === "new").length}`}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isEnglish ? "Project Name" : "Projectnaam"}</TableHead>
                          <TableHead>{isEnglish ? "Client" : "Klant"}</TableHead>
                          <TableHead>{isEnglish ? "Requested Services" : "Aangevraagde Diensten"}</TableHead>
                          <TableHead>{isEnglish ? "Date Submitted" : "Datum Ingediend"}</TableHead>
                          <TableHead className="text-right">{isEnglish ? "Actions" : "Acties"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.filter(p => p.status === "new").length > 0 ? (
                          projects
                            .filter(p => p.status === "new")
                            .map((project) => {
                              const client = clients.find(c => c.id === project.userId);
                              return (
                                <TableRow key={project.id}>
                                  <TableCell className="font-medium">{project.name}</TableCell>
                                  <TableCell>{client?.name || "Unknown"}</TableCell>
                                  <TableCell>
                                    {project.metaData ? 
                                      (() => {
                                        const meta = project.metaData as ProjectMetaData;
                                        return meta.services && Array.isArray(meta.services) ? 
                                          meta.services.map((service: string, index: number) => (
                                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                                              {service}
                                            </Badge>
                                          )) 
                                        : "-";
                                      })()
                                    : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" size="sm" onClick={() => {
                                        // View details / edit functionality would go here
                                      }}>
                                        {isEnglish ? "View Details" : "Bekijk Details"}
                                      </Button>
                                      <Button 
                                        variant="default" 
                                        size="sm" 
                                        onClick={() => approveProjectMutation.mutate(project.id)}
                                        disabled={approveProjectMutation.isPending}
                                      >
                                        {approveProjectMutation.isPending ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : null}
                                        {isEnglish ? "Approve" : "Goedkeuren"}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              {isEnglish 
                                ? "No new project requests found." 
                                : "Geen nieuwe projectaanvragen gevonden."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{isEnglish ? "All Projects" : "Alle Projecten"}</CardTitle>
                    <CardDescription>
                      {isEnglish 
                        ? "Manage projects across all clients" 
                        : "Beheer projecten voor alle klanten"}
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {isEnglish ? "New Project" : "Nieuw Project"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={isEnglish ? "Search projects..." : "Zoek projecten..."}
                      className="flex-1"
                    />
                  </div>
                  
                  {isLoadingProjects ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>
                        {isEnglish 
                          ? `Total projects: ${projects.length}` 
                          : `Totaal aantal projecten: ${projects.length}`}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isEnglish ? "Project Name" : "Projectnaam"}</TableHead>
                          <TableHead>{isEnglish ? "Client" : "Klant"}</TableHead>
                          <TableHead>{isEnglish ? "Status" : "Status"}</TableHead>
                          <TableHead>{isEnglish ? "Deadline" : "Deadline"}</TableHead>
                          <TableHead className="text-right">{isEnglish ? "Actions" : "Acties"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.length > 0 ? (
                          projects.map((project) => {
                            const client = clients.find(c => c.id === project.userId);
                            return (
                              <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell>{client?.name || "Unknown"}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      project.status === "completed" ? "default" :
                                      project.status === "in_progress" ? "default" :
                                      project.status === "planning" ? "secondary" : "outline"
                                    }
                                  >
                                    {project.status === "completed" ? (isEnglish ? "Completed" : "Voltooid") :
                                     project.status === "in_progress" ? (isEnglish ? "In Progress" : "In Uitvoering") :
                                     project.status === "planning" ? (isEnglish ? "Planning" : "Planning") :
                                     (isEnglish ? "Unknown" : "Onbekend")}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              {isEnglish 
                                ? "No projects found. Create a new project to get started." 
                                : "Geen projecten gevonden. Maak een nieuw project aan om te beginnen."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{isEnglish ? "Contact Form Submissions" : "Contactformulier Inzendingen"}</CardTitle>
                    <CardDescription>
                      {isEnglish 
                        ? "Messages from the website contact form" 
                        : "Berichten van het website contactformulier"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingContacts ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>
                        {isEnglish 
                          ? `Total messages: ${contacts.length}` 
                          : `Totaal aantal berichten: ${contacts.length}`}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isEnglish ? "Name" : "Naam"}</TableHead>
                          <TableHead>{isEnglish ? "Email" : "E-mail"}</TableHead>
                          <TableHead>{isEnglish ? "Subject" : "Onderwerp"}</TableHead>
                          <TableHead>{isEnglish ? "Date" : "Datum"}</TableHead>
                          <TableHead>{isEnglish ? "Status" : "Status"}</TableHead>
                          <TableHead className="text-right">{isEnglish ? "Actions" : "Acties"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.length > 0 ? (
                          contacts.map((contact) => (
                            <TableRow key={contact.id} className={!contact.read ? "bg-muted/30" : ""}>
                              <TableCell className="font-medium">{contact.name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.service}</TableCell>
                              <TableCell>
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {contact.read ? (
                                  <Badge variant="outline" className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {isEnglish ? "Read" : "Gelezen"}
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="flex items-center">
                                    <Bell className="h-3 w-3 mr-1" />
                                    {isEnglish ? "Unread" : "Ongelezen"}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        {isEnglish ? "View Message" : "Bericht Bekijken"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="space-y-2">
                                        <h4 className="font-medium">{contact.service}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {isEnglish ? "From" : "Van"}: {contact.name} ({contact.email})
                                        </p>
                                        <div className="text-sm border rounded-lg p-3 mt-2 bg-muted/50">
                                          {contact.message}
                                        </div>
                                        {!contact.read && (
                                          <Button 
                                            variant="default" 
                                            size="sm" 
                                            className="w-full mt-2"
                                            onClick={() => markContactReadMutation.mutate(contact.id)}
                                          >
                                            {isEnglish ? "Mark as Read" : "Markeren als Gelezen"}
                                          </Button>
                                        )}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              {isEnglish 
                                ? "No contact submissions found." 
                                : "Geen contactformulier inzendingen gevonden."}
                            </TableCell>
                          </TableRow>
                        )}
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
    </>
  );
}