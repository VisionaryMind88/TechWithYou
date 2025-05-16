import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Form validation schema with improved error messages and trimming
const formSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  company: z.string().trim().min(1, { message: "Company name is required" }),
  service: z.string().min(1, { message: "Please select a service" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters long" })
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/contact', data);
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      // More detailed error handling
      let errorMessage = "Please try again later.";
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('Network error')) {
          errorMessage = "Connection problem. Please check your internet and try again.";
        } else if (error.message.includes('429')) {
          errorMessage = "Too many requests. Please wait a moment before trying again.";
        } else if (error.message.includes('500')) {
          errorMessage = "Server error. Our team has been notified.";
        }
        
        console.error("Error sending message:", error.message);
      }
      
      toast({
        title: "Could not send message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            {t('contact.form.name')}
          </label>
          <input
            type="text"
            id="name"
            {...form.register('name')}
            className={`w-full px-4 py-3 border ${form.formState.errors.name ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
            placeholder={t('contact.form.namePlaceholder')}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            {t('contact.form.email')}
          </label>
          <input
            type="email"
            id="email"
            {...form.register('email')}
            className={`w-full px-4 py-3 border ${form.formState.errors.email ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
            placeholder={t('contact.form.emailPlaceholder')}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1">
          {t('contact.form.company')}
        </label>
        <input
          type="text"
          id="company"
          {...form.register('company')}
          className={`w-full px-4 py-3 border ${form.formState.errors.company ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
          placeholder={t('contact.form.companyPlaceholder')}
        />
        {form.formState.errors.company && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.company.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-neutral-700 mb-1">
          {t('contact.form.service')}
        </label>
        <select
          id="service"
          {...form.register('service')}
          className={`w-full px-4 py-3 border ${form.formState.errors.service ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
        >
          <option value="" disabled>
            {t('contact.form.serviceDefault')}
          </option>
          <option value="website">Website Development</option>
          <option value="webapp">Web Applicatie</option>
          <option value="dashboard">Dashboard & Data Visualisatie</option>
          <option value="design">UX/UI Design</option>
          <option value="optimization">Performance Optimalisatie</option>
          <option value="maintenance">Beveiliging & Onderhoud</option>
        </select>
        {form.formState.errors.service && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.service.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          {...form.register('message')}
          rows={5}
          className={`w-full px-4 py-3 border ${form.formState.errors.message ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
          placeholder={t('contact.form.messagePlaceholder')}
        ></textarea>
        {form.formState.errors.message && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.message.message}</p>
        )}
      </div>

      <div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              {t('contact.form.send')}
              <i className="ri-send-plane-fill ml-2"></i>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};
