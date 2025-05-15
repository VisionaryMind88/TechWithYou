import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { trackEvent } from "@/lib/analytics";
import { apiRequest } from "@/lib/queryClient";
import { uploadFileToStorage } from "@/lib/firebase";

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";

// Define the schema for file upload
const fileUploadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  file: z.instanceof(File, { message: "File is required" })
});

type FileUploadFormValues = z.infer<typeof fileUploadSchema>;

interface UploadFileFormProps {
  projectId: number | null;
  onSuccess?: () => void;
}

export function UploadFileForm({ projectId, onSuccess }: UploadFileFormProps) {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<FileUploadFormValues>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (data: FileUploadFormValues) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      
      // Gebruik FormData om het bestand te uploaden
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("file", data.file);
      formData.append("projectId", projectId.toString());
      formData.append("notifyAdmin", "true"); // Notificatie voor admin activeren
      
      // Log voor debugging
      console.log("Uploading file:", data.file.name, "for project:", projectId);
      
      const res = await fetch(`/api/dashboard/projects/${projectId}/files`, {
        method: "POST",
        body: formData,
        // Geen Content-Type header nodig bij FormData, browser stelt deze automatisch in
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload file");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: isEnglish ? "File Uploaded Successfully" : "Bestand Succesvol Geüpload",
        description: isEnglish
          ? "Your file has been uploaded and the team has been notified."
          : "Je bestand is geüpload en het team is op de hoogte gebracht.",
        className: "bg-green-50 border-green-200",
      });
      trackEvent("file_uploaded", "client", "project_management");
      form.reset();
      setSelectedFile(null);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: isEnglish ? "Upload Failed" : "Upload Mislukt",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = async (data: FileUploadFormValues) => {
    if (selectedFile) {
      try {
        // Upload het bestand naar Firebase Storage
        data.file = selectedFile;
        
        // Toon loading toast
        toast({
          title: isEnglish ? "Uploading File..." : "Bestand Uploaden...",
          description: isEnglish ? "Please wait while we upload your file." : "Even geduld terwijl we je bestand uploaden.",
        });
        
        // Genereer een uniek pad voor het bestand in Firebase Storage
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${selectedFile.name}`;
        const storagePath = `project-files/${projectId}/${fileName}`;
        
        // Upload het bestand naar Firebase Storage
        const fileUrl = await uploadFileToStorage(selectedFile, storagePath);
        
        // Formdata om te versturen naar de server
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.description) {
          formData.append("description", data.description);
        }
        formData.append("fileUrl", fileUrl);
        formData.append("fileType", selectedFile.type);
        formData.append("fileSize", selectedFile.size.toString());
        formData.append("notifyAdmin", "true");
        
        // Server API aanroepen
        uploadFileMutation.mutate({
          ...data,
          fileUrl, // Voeg de fileUrl toe aan de data
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: isEnglish ? "Upload Failed" : "Upload Mislukt",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: isEnglish ? "No File Selected" : "Geen Bestand Geselecteerd",
        description: isEnglish 
          ? "Please select a file to upload" 
          : "Selecteer een bestand om te uploaden",
        variant: "destructive",
      });
    }
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      // Als de gebruiker een bestand heeft geselecteerd maar nog geen naam heeft ingevuld,
      // gebruik dan de bestandsnaam als suggestie voor het naamveld
      if (!form.getValues("name")) {
        // Verwijder extensie uit bestandsnaam voor de suggestie
        const fileName = files[0].name.replace(/\.[^/.]+$/, "");
        form.setValue("name", fileName);
      }
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEnglish ? "File Name" : "Bestandsnaam"}</FormLabel>
              <FormControl>
                <Input placeholder={isEnglish ? "Enter file name" : "Voer bestandsnaam in"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEnglish ? "Description (optional)" : "Omschrijving (optioneel)"}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={isEnglish ? "Brief description of the file" : "Korte beschrijving van het bestand"} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel htmlFor="file-upload">
            {isEnglish ? "Select File" : "Selecteer Bestand"}
          </FormLabel>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="flex-1"
            />
          </div>
          {selectedFile && (
            <p className="text-xs text-muted-foreground">
              {isEnglish ? "Selected file:" : "Geselecteerd bestand:"} {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={uploadFileMutation.isPending || !selectedFile}
        >
          {uploadFileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEnglish ? "Uploading..." : "Uploaden..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {isEnglish ? "Upload File" : "Bestand Uploaden"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}