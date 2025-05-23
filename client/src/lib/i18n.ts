import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  language: 'en',
  header: {
    services: 'Services',
    portfolio: 'Portfolio',
    about: 'About us',
    contact: 'Contact',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    clientArea: 'Client Area'
  },
  auth: {
    login: 'Login',
    register: 'Register',
    loginTitle: 'Welcome back',
    loginDescription: 'Sign in to your account to access your dashboard.',
    registerTitle: 'Create an account',
    registerDescription: 'Sign up for an account to manage your projects.',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    alreadyAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    orContinueWith: 'Or continue with',
    continueWithGoogle: 'Continue with Google',
    continueWithGithub: 'Continue with Github',
    termsAgree: 'By creating an account, you agree to our Terms of Service and Privacy Policy',
    passwordRequirements: 'Password Requirements',
    requirementsLength: 'At least 8 characters',
    requirementsUppercase: 'At least 1 uppercase letter',
    requirementsNumber: 'At least 1 number',
    requirementsSpecial: 'At least 1 special character',
    requirementsMet: 'All requirements met',
    emailVerification: 'Email Verification',
    verificationSent: 'Verification email sent',
    verificationInstructions: 'Please check your email and click the verification link to activate your account.',
    resendVerification: 'Resend Verification Email',
    verifySuccess: 'Email verified successfully',
    verifyFailed: 'Verification failed'
  },
  dashboard: {
    welcomeBack: 'Welcome back',
    projects: 'Projects',
    notifications: 'Notifications',
    overview: 'Overview',
    recentProjects: 'Recent Projects',
    upcomingMilestones: 'Upcoming Milestones',
    activityFeed: 'Activity Feed',
    myProjects: 'My Projects',
    createProject: 'Create New Project',
    projectDetails: 'Project Details',
    projectName: 'Project Name',
    projectDescription: 'Project Description',
    projectStatus: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    clientName: 'Client Name',
    milestones: 'Milestones',
    files: 'Files',
    settings: 'Settings',
    team: 'Team',
    addMilestone: 'Add Milestone',
    uploadFile: 'Upload File',
    noProjects: 'No projects found',
    noMilestones: 'No milestones found',
    noFiles: 'No files found',
    downloadFile: 'Download',
    deleteFile: 'Delete',
    viewAll: 'View All',
    markAsRead: 'Mark as Read',
    markAllAsRead: 'Mark All as Read',
    noNotifications: 'No notifications found',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    lastUpdated: 'Last Updated',
    createNewProject: 'Create New Project',
    projectCreated: 'Project created successfully',
    projectUpdated: 'Project updated successfully',
    projectDeleted: 'Project deleted successfully'
  },
  hero: {
    title: 'We build <highlight>digital experiences</highlight> that make an impact',
    description: 'With state-of-the-art technology, we create websites, applications, and dashboards that take your business to the next level.',
    cta: 'Start your project',
    viewWork: 'View our work',
    discoverMore: 'Discover more'
  },
  services: {
    title: 'What we can do for you',
    subtitle: 'OUR SERVICES',
    description: 'We offer a complete portfolio of digital solutions to help your business grow and innovate in the digital landscape.',
    moreInfo: 'More information',
    items: [
      {
        icon: 'ri-layout-4-line',
        title: 'Website Development',
        description: 'Responsive, high-performance websites that strengthen your brand and engage your audience.',
        features: ['Responsive design', 'SEO-optimized', 'Intuitive CMS']
      },
      {
        icon: 'ri-code-box-line',
        title: 'Web Applications',
        description: 'Custom applications that optimize your business processes and improve the user experience.',
        features: ['Scalable architecture', 'Real-time functionality', 'Integration with existing systems']
      },
      {
        icon: 'ri-dashboard-3-line',
        title: 'Dashboards & Data Visualization',
        description: 'Insightful dashboards that convert complex data into actionable insights for your organization.',
        features: ['Interactive charts', 'Real-time data monitoring', 'Custom reporting']
      },
      {
        icon: 'ri-palette-line',
        title: 'UX/UI Design',
        description: 'User-friendly interfaces that provide your users with a seamless experience.',
        features: ['User research', 'Wireframing & prototyping', 'Usability testing']
      },
      {
        icon: 'ri-speed-up-line',
        title: 'Performance Optimization',
        description: 'Improve the loading time and performance of your existing web platforms.',
        features: ['Website audit', 'Core Web Vitals optimization', 'SEO improvements']
      },
      {
        icon: 'ri-shield-check-line',
        title: 'Security & Maintenance',
        description: 'Keep your digital platforms safe and up-to-date with our maintenance plan.',
        features: ['Security audits', 'Regular updates', 'Backup & recovery plan']
      }
    ]
  },
  technology: {
    title: 'Our technical expertise',
    subtitle: 'TECHNOLOGY',
    description: 'We work with the latest technologies to future-proof your projects.'
  },
  portfolio: {
    title: 'Our latest projects',
    subtitle: 'PORTFOLIO',
    description: 'Discover a selection of our recent projects that demonstrate the quality and diversity of our work.',
    viewAll: 'View all projects',
    viewCase: 'View case study'
  },
  process: {
    title: 'How we work',
    subtitle: 'WORK PROCESS',
    description: 'Our structured process ensures that each project runs efficiently and meets the highest quality standards.',
    steps: [
      {
        icon: 'ri-discuss-line',
        title: 'Discovery',
        description: 'We start with an in-depth analysis of your needs, goals, and the market in which you operate.'
      },
      {
        icon: 'ri-draft-line',
        title: 'Strategy & Design',
        description: 'We develop a blueprint and visual design that forms the foundation for your digital product.'
      },
      {
        icon: 'ri-code-s-slash-line',
        title: 'Development',
        description: 'Our developers build your product with the latest technologies and best practices.'
      },
      {
        icon: 'ri-rocket-line',
        title: 'Launch & Support',
        description: 'We ensure a smooth launch and provide ongoing support and optimization.'
      }
    ]
  },
  testimonials: {
    title: 'What our clients say',
    subtitle: 'TESTIMONIALS',
    description: 'Discover why businesses choose us for their digital transformation.'
  },
  about: {
    title: 'We are a team of passionate experts',
    subtitle: 'ABOUT US',
    description1: 'Digitaal Atelier was founded with one goal: to deliver exceptional digital experiences that help businesses grow. With over 10 years of industry experience, we have assembled a team of the best professionals in their field.',
    description2: 'Our mission is to turn technological challenges into opportunities by providing innovative solutions that truly make an impact. We work closely with our clients to understand their vision and translate it into successful digital products.',
    meetTeam: 'Meet our team',
    contact: 'Contact us'
  },
  stats: {
    projectsCompleted: 'Projects completed',
    satisfiedClients: 'Satisfied clients',
    experts: 'Experts in team',
    yearsExperience: 'Years experience'
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'FAQ',
    description: 'Find answers to common questions about our services and process.',
    items: [
      {
        question: 'What type of businesses do you work with?',
        answer: 'We work with businesses of all sizes, from startups to established enterprises, across various industries. Our solutions are tailored to meet the specific needs and goals of each client.'
      },
      {
        question: 'How long does it take to complete a website project?',
        answer: 'The timeline for a website project depends on its complexity and scope. A simple website might take 3-4 weeks, while more complex projects with custom features can take 8-12 weeks. We\'ll provide a detailed timeline during our initial consultation.'
      },
      {
        question: 'Do you provide website maintenance services?',
        answer: 'Yes, we offer ongoing maintenance and support services to ensure your website remains secure, up-to-date, and optimized for performance. We can set up a maintenance plan tailored to your specific needs.'
      },
      {
        question: 'What is your approach to website security?',
        answer: 'Security is a top priority in all our projects. We implement SSL certificates, security plugins, regular updates, and follow best practices for coding and server configuration to protect against potential vulnerabilities.'
      },
      {
        question: 'Can you help with SEO for my website?',
        answer: 'Absolutely! We build all our websites with SEO in mind, including proper HTML structure, fast loading times, and mobile optimization. We also offer additional SEO services such as keyword research, content optimization, and ongoing SEO strategy.'
      },
      {
        question: 'What is your payment structure?',
        answer: 'Our typical payment structure includes a 50% deposit to begin the project, with the remaining balance due upon completion. For larger projects, we may break payments into multiple milestones. We accept bank transfers and major credit cards.'
      },
      {
        question: 'What technologies do you use for development?',
        answer: 'We use the latest and most reliable technologies including React, Angular, Vue.js, Node.js, PHP, Python, and various CMS platforms like WordPress. Our technology choices are always based on your specific project requirements and long-term goals.'
      },
      {
        question: 'Do you provide hosting for websites?',
        answer: 'Yes, we offer high-performance, secure hosting solutions tailored to your website\'s needs. Our hosting includes 99.9% uptime guarantee, regular backups, security monitoring, and technical support. We can also work with your existing hosting provider if preferred.'
      },
      {
        question: 'How do you handle revisions during the development process?',
        answer: 'We include two rounds of revisions in our standard project scope. This gives you multiple opportunities to provide feedback and request changes. Additional revision rounds can be arranged if needed. We maintain clear communication throughout the process to ensure your satisfaction.'
      },
      {
        question: 'What information do you need to start a website project?',
        answer: 'To get started, we need to understand your business goals, target audience, brand guidelines, content requirements, and any specific functionality you need. During our initial consultation, we\'ll guide you through all the necessary details and help you organize your thoughts and materials.'
      },
      {
        question: 'Do you offer custom web application development?',
        answer: 'Yes, we specialize in developing custom web applications tailored to your business processes. Whether you need an internal tool, customer portal, or complex system, we can build a scalable, secure, and user-friendly solution that meets your specific requirements.'
      },
      {
        question: 'How do you ensure websites are mobile-friendly?',
        answer: 'All our websites are built with a mobile-first approach using responsive design techniques. We rigorously test on multiple devices and screen sizes to ensure optimal performance and user experience across all platforms. This approach also benefits your SEO as mobile-friendliness is a key ranking factor.'
      }
    ]
  },
  team: {
    title: 'The people behind our successes',
    subtitle: 'OUR TEAM',
    description: 'Meet our talented professionals who work every day to realize your digital ambitions.'
  },
  cta: {
    title: 'Ready to start your digital transformation?',
    description: 'Let us turn your ideas into high-quality digital solutions that help your business move forward.',
    startProject: 'Start a project',
    scheduleCall: 'Schedule a call'
  },
  contact: {
    title: 'Contact us',
    subtitle: 'CONTACT',
    description: 'Have a project in mind or want more information? Fill out the form and we will contact you as soon as possible.',
    form: {
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      company: 'Company',
      companyPlaceholder: 'Your company name',
      service: 'Desired service',
      serviceDefault: 'Select a service',
      message: 'Your message',
      messagePlaceholder: 'Tell us about your project...',
      send: 'Send message'
    },
    info: {
      title: 'Contact details',
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      followUs: 'Follow us',
      openingHours: 'Opening hours',
      hours: 'Monday - Friday: 9:00 - 17:30\nWeekend: Closed'
    }
  },
  footer: {
    description: 'We transform ideas into powerful digital solutions that help businesses grow and innovate.',
    services: 'Services',
    navigation: 'Navigation',
    newsletter: {
      title: 'Newsletter',
      description: 'Subscribe to our newsletter to stay up to date with our latest projects and developments.',
      placeholder: 'Your email address',
      subscribe: 'Subscribe'
    },
    rights: '© 2023 TechWithYou. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    cookies: 'Cookies'
  }
};

// Dutch translations
const nlTranslations = {
  language: 'nl',
  header: {
    services: 'Services',
    portfolio: 'Portfolio',
    about: 'Over ons',
    contact: 'Contact',
    login: 'Inloggen',
    logout: 'Uitloggen',
    dashboard: 'Dashboard',
    clientArea: 'Klantomgeving'
  },
  auth: {
    login: 'Inloggen',
    register: 'Registreren',
    loginTitle: 'Welkom terug',
    loginDescription: 'Log in op je account om toegang te krijgen tot je dashboard.',
    registerTitle: 'Account aanmaken',
    registerDescription: 'Maak een account aan om je projecten te beheren.',
    username: 'Gebruikersnaam',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    confirmPassword: 'Wachtwoord bevestigen',
    rememberMe: 'Onthoud mij',
    forgotPassword: 'Wachtwoord vergeten?',
    noAccount: 'Nog geen account?',
    alreadyAccount: 'Heb je al een account?',
    signUp: 'Registreren',
    signIn: 'Inloggen',
    orContinueWith: 'Of ga verder met',
    continueWithGoogle: 'Doorgaan met Google',
    continueWithGithub: 'Doorgaan met Github',
    termsAgree: 'Door een account aan te maken, ga je akkoord met onze Servicevoorwaarden en Privacybeleid',
    passwordRequirements: 'Wachtwoordvereisten',
    requirementsLength: 'Minimaal 8 tekens',
    requirementsUppercase: 'Minimaal 1 hoofdletter',
    requirementsNumber: 'Minimaal 1 cijfer',
    requirementsSpecial: 'Minimaal 1 speciaal teken',
    requirementsMet: 'Aan alle vereisten voldaan',
    emailVerification: 'E-mailverificatie',
    verificationSent: 'Verificatie e-mail verzonden',
    verificationInstructions: 'Controleer je e-mail en klik op de verificatielink om je account te activeren.',
    resendVerification: 'Verificatie e-mail opnieuw versturen',
    verifySuccess: 'E-mail succesvol geverifieerd',
    verifyFailed: 'Verificatie mislukt'
  },
  dashboard: {
    welcomeBack: 'Welkom terug',
    projects: 'Projecten',
    notifications: 'Notificaties',
    overview: 'Overzicht',
    recentProjects: 'Recente projecten',
    upcomingMilestones: 'Aankomende mijlpalen',
    activityFeed: 'Activiteitenoverzicht',
    myProjects: 'Mijn projecten',
    createProject: 'Nieuw project aanmaken',
    projectDetails: 'Projectdetails',
    projectName: 'Projectnaam',
    projectDescription: 'Projectbeschrijving',
    projectStatus: 'Status',
    startDate: 'Startdatum',
    endDate: 'Einddatum',
    clientName: 'Klantnaam',
    milestones: 'Mijlpalen',
    files: 'Bestanden',
    settings: 'Instellingen',
    team: 'Team',
    addMilestone: 'Mijlpaal toevoegen',
    uploadFile: 'Bestand uploaden',
    noProjects: 'Geen projecten gevonden',
    noMilestones: 'Geen mijlpalen gevonden',
    noFiles: 'Geen bestanden gevonden',
    downloadFile: 'Downloaden',
    deleteFile: 'Verwijderen',
    viewAll: 'Alles bekijken',
    markAsRead: 'Markeren als gelezen',
    markAllAsRead: 'Alles markeren als gelezen',
    noNotifications: 'Geen notificaties gevonden',
    saveChanges: 'Wijzigingen opslaan',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    lastUpdated: 'Laatst bijgewerkt',
    createNewProject: 'Nieuw project aanmaken',
    projectCreated: 'Project succesvol aangemaakt',
    projectUpdated: 'Project succesvol bijgewerkt',
    projectDeleted: 'Project succesvol verwijderd'
  },
  hero: {
    title: 'Wij bouwen <highlight>digitale ervaringen</highlight> die impact maken',
    description: 'Met state-of-the-art technologie creëren wij websites, applicaties en dashboards die uw bedrijf naar een hoger niveau tillen.',
    cta: 'Start uw project',
    viewWork: 'Bekijk ons werk',
    discoverMore: 'Ontdek meer'
  },
  services: {
    title: 'Wat we voor u kunnen doen',
    subtitle: 'ONZE DIENSTEN',
    description: 'Wij bieden een compleet portfolio aan digitale oplossingen om uw bedrijf te helpen groeien en te innoveren in het digitale landschap.',
    moreInfo: 'Meer informatie',
    items: [
      {
        icon: 'ri-layout-4-line',
        title: 'Website Development',
        description: 'Responsieve, high-performance websites die uw merk versterken en uw doelgroep engageren.',
        features: ['Responsive design', 'SEO-geoptimaliseerd', 'Intuïtief CMS']
      },
      {
        icon: 'ri-code-box-line',
        title: 'Web Applicaties',
        description: 'Custom applicaties die uw bedrijfsprocessen optimaliseren en de gebruikerservaring verbeteren.',
        features: ['Schaalbare architectuur', 'Real-time functionaliteit', 'Integratie met bestaande systemen']
      },
      {
        icon: 'ri-dashboard-3-line',
        title: 'Dashboards & Data Visualisatie',
        description: 'Inzichtelijke dashboards die complexe data omzetten in bruikbare inzichten voor uw organisatie.',
        features: ['Interactieve grafieken', 'Realtime data monitoring', 'Custom rapportages']
      },
      {
        icon: 'ri-palette-line',
        title: 'UX/UI Design',
        description: 'Gebruiksvriendelijke interfaces die uw gebruikers een naadloze ervaring bieden.',
        features: ['User research', 'Wireframing & prototyping', 'Usability testing']
      },
      {
        icon: 'ri-speed-up-line',
        title: 'Performance Optimalisatie',
        description: 'Verbeter de laadtijd en prestaties van uw bestaande web platformen.',
        features: ['Website audit', 'Core Web Vitals optimalisatie', 'SEO verbeteringen']
      },
      {
        icon: 'ri-shield-check-line',
        title: 'Beveiliging & Onderhoud',
        description: 'Houd uw digitale platformen veilig en up-to-date met ons onderhoudsplan.',
        features: ['Beveiligingsaudits', 'Regelmatige updates', 'Backup & recovery plan']
      }
    ]
  },
  technology: {
    title: 'Onze technische expertise',
    subtitle: 'TECHNOLOGIE',
    description: 'Wij werken met de nieuwste technologieën om uw projecten toekomstbestendig te maken.'
  },
  portfolio: {
    title: 'Onze nieuwste projecten',
    subtitle: 'PORTFOLIO',
    description: 'Ontdek een selectie van onze recente projecten die de kwaliteit en diversiteit van ons werk demonstreren.',
    viewAll: 'Bekijk alle projecten',
    viewCase: 'Case study bekijken'
  },
  process: {
    title: 'Hoe wij werken',
    subtitle: 'WERKPROCES',
    description: 'Ons gestructureerde proces zorgt ervoor dat elk project efficiënt verloopt en aan de hoogste kwaliteitseisen voldoet.',
    steps: [
      {
        icon: 'ri-discuss-line',
        title: 'Ontdekking',
        description: 'We beginnen met een diepgaande analyse van uw behoeften, doelen en de markt waarin u opereert.'
      },
      {
        icon: 'ri-draft-line',
        title: 'Strategie & Design',
        description: 'We ontwikkelen een blueprint en visueel ontwerp dat de basis vormt voor uw digitale product.'
      },
      {
        icon: 'ri-code-s-slash-line',
        title: 'Ontwikkeling',
        description: 'Onze ontwikkelaars bouwen uw product met de nieuwste technologieën en best practices.'
      },
      {
        icon: 'ri-rocket-line',
        title: 'Lancering & Ondersteuning',
        description: 'We zorgen voor een soepele lancering en bieden doorlopende ondersteuning en optimalisatie.'
      }
    ]
  },
  testimonials: {
    title: 'Wat onze klanten zeggen',
    subtitle: 'TESTIMONIALS',
    description: 'Ontdek waarom bedrijven ons kiezen voor hun digitale transformatie.'
  },
  about: {
    title: 'Wij zijn een team van gepassioneerde experts',
    subtitle: 'OVER ONS',
    description1: 'TechWithYou is opgericht met één doel: het leveren van uitzonderlijke digitale ervaringen die bedrijven helpen groeien. Met meer dan 10 jaar ervaring in de branche hebben we een team samengesteld van de beste professionals in hun vakgebied.',
    description2: 'Onze missie is om technologische uitdagingen om te zetten in kansen door innovatieve oplossingen te bieden die écht impact maken. We werken nauw samen met onze klanten om hun visie te begrijpen en te vertalen naar succesvolle digitale producten.',
    meetTeam: 'Ontmoet ons team',
    contact: 'Neem contact op'
  },
  stats: {
    projectsCompleted: 'Projecten voltooid',
    satisfiedClients: 'Tevreden klanten',
    experts: 'Experts in team',
    yearsExperience: 'Jaren ervaring'
  },
  faq: {
    title: 'Veelgestelde Vragen',
    subtitle: 'FAQ',
    description: 'Vind antwoorden op veelvoorkomende vragen over onze diensten en werkwijze.',
    items: [
      {
        question: 'Met welk type bedrijven werkt u samen?',
        answer: 'Wij werken samen met bedrijven van alle groottes, van startups tot gevestigde ondernemingen, in verschillende sectoren. Onze oplossingen zijn toegespitst op de specifieke behoeften en doelen van elke klant.'
      },
      {
        question: 'Hoe lang duurt het om een websiteproject te voltooien?',
        answer: 'De tijdlijn voor een websiteproject hangt af van de complexiteit en omvang. Een eenvoudige website kan 3-4 weken duren, terwijl meer complexe projecten met aangepaste functies 8-12 weken kunnen duren. We geven een gedetailleerde planning tijdens ons eerste consult.'
      },
      {
        question: 'Biedt u websiteonderhoudsdiensten aan?',
        answer: 'Ja, wij bieden doorlopende onderhouds- en ondersteuningsdiensten om ervoor te zorgen dat uw website veilig, up-to-date en geoptimaliseerd blijft voor prestaties. We kunnen een onderhoudsplan opstellen dat is afgestemd op uw specifieke behoeften.'
      },
      {
        question: 'Wat is uw aanpak van websitebeveiliging?',
        answer: 'Beveiliging is een topprioriteit in al onze projecten. We implementeren SSL-certificaten, beveiligingsplugins, regelmatige updates en volgen best practices voor codering en serverconfiguratie om te beschermen tegen potentiële kwetsbaarheden.'
      },
      {
        question: 'Kunt u helpen met SEO voor mijn website?',
        answer: 'Absoluut! We bouwen al onze websites met SEO in gedachten, inclusief de juiste HTML-structuur, snelle laadtijden en mobiele optimalisatie. We bieden ook aanvullende SEO-diensten zoals trefwoordonderzoek, contentoptimalisatie en doorlopende SEO-strategie.'
      },
      {
        question: 'Wat is uw betalingsstructuur?',
        answer: 'Onze typische betalingsstructuur omvat een aanbetaling van 50% om het project te starten, waarbij het resterende saldo verschuldigd is bij voltooiing. Voor grotere projecten kunnen we betalingen in meerdere mijlpalen verdelen. We accepteren bankoverschrijvingen en belangrijke creditcards.'
      },
      {
        question: 'Welke technologieën gebruikt u voor ontwikkeling?',
        answer: 'We gebruiken de nieuwste en meest betrouwbare technologieën waaronder React, Angular, Vue.js, Node.js, PHP, Python en verschillende CMS-platforms zoals WordPress. Onze technologiekeuzes zijn altijd gebaseerd op uw specifieke projectvereisten en langetermijndoelen.'
      },
      {
        question: 'Biedt u hosting aan voor websites?',
        answer: 'Ja, we bieden hoogwaardige, beveiligde hostingoplossingen op maat van de behoeften van uw website. Onze hosting omvat 99,9% uptime garantie, regelmatige back-ups, beveiligingsmonitoring en technische ondersteuning. We kunnen ook werken met uw bestaande hostingprovider indien gewenst.'
      },
      {
        question: 'Hoe gaat u om met revisies tijdens het ontwikkelingsproces?',
        answer: 'We nemen twee revisierondes op in onze standaard projectomvang. Dit geeft u meerdere mogelijkheden om feedback te geven en wijzigingen aan te vragen. Extra revisierondes kunnen indien nodig worden geregeld. We houden de communicatie duidelijk gedurende het hele proces om uw tevredenheid te garanderen.'
      },
      {
        question: 'Welke informatie heeft u nodig om een websiteproject te starten?',
        answer: 'Om te beginnen moeten we inzicht hebben in uw bedrijfsdoelen, doelgroep, merkrichtlijnen, content-vereisten en specifieke functionaliteiten die u nodig heeft. Tijdens ons eerste consult begeleiden we u door alle benodigde details en helpen we u bij het organiseren van uw gedachten en materialen.'
      },
      {
        question: 'Biedt u aangepaste webapplicatie-ontwikkeling aan?',
        answer: 'Ja, we zijn gespecialiseerd in het ontwikkelen van aangepaste webapplicaties die zijn afgestemd op uw bedrijfsprocessen. Of u nu een interne tool, klantenportaal of complex systeem nodig heeft, we kunnen een schaalbare, veilige en gebruiksvriendelijke oplossing bouwen die aan uw specifieke eisen voldoet.'
      },
      {
        question: 'Hoe zorgt u ervoor dat websites mobiel-vriendelijk zijn?',
        answer: 'Al onze websites worden gebouwd met een mobile-first benadering en responsieve ontwerptechnieken. We testen uitvoerig op meerdere apparaten en schermformaten om optimale prestaties en gebruikerservaring op alle platforms te garanderen. Deze aanpak komt ook uw SEO ten goede, aangezien mobiel-vriendelijkheid een belangrijke rankingfactor is.'
      }
    ]
  },
  team: {
    title: 'De mensen achter onze successen',
    subtitle: 'ONS TEAM',
    description: 'Maak kennis met onze getalenteerde professionals die elke dag werken aan het realiseren van uw digitale ambities.'
  },
  cta: {
    title: 'Klaar om uw digitale transformatie te starten?',
    description: 'Laat ons uw ideeën omzetten in hoogwaardige digitale oplossingen die uw bedrijf vooruit helpen.',
    startProject: 'Start een project',
    scheduleCall: 'Plan een gesprek'
  },
  contact: {
    title: 'Neem contact met ons op',
    subtitle: 'CONTACT',
    description: 'Heeft u een project in gedachten of wilt u meer informatie? Vul het formulier in en we nemen zo snel mogelijk contact met u op.',
    form: {
      name: 'Naam',
      namePlaceholder: 'Uw naam',
      email: 'E-mail',
      emailPlaceholder: 'uw@email.nl',
      company: 'Bedrijf',
      companyPlaceholder: 'Uw bedrijfsnaam',
      service: 'Gewenste dienst',
      serviceDefault: 'Selecteer een dienst',
      message: 'Uw bericht',
      messagePlaceholder: 'Vertel ons over uw project...',
      send: 'Verstuur bericht'
    },
    info: {
      title: 'Contactgegevens',
      address: 'Adres',
      email: 'E-mail',
      phone: 'Telefoon',
      followUs: 'Volg ons',
      openingHours: 'Openingstijden',
      hours: 'Maandag - Vrijdag: 9:00 - 17:30\nWeekend: Gesloten'
    }
  },
  footer: {
    description: 'Wij transformeren ideeën in krachtige digitale oplossingen die bedrijven helpen groeien en innoveren.',
    services: 'Diensten',
    navigation: 'Navigatie',
    newsletter: {
      title: 'Nieuwsbrief',
      description: 'Schrijf u in voor onze nieuwsbrief om op de hoogte te blijven van onze nieuwste projecten en ontwikkelingen.',
      placeholder: 'Uw e-mail adres',
      subscribe: 'Inschrijven'
    },
    rights: '© 2023 TechWithYou. Alle rechten voorbehouden.',
    privacy: 'Privacy Policy',
    terms: 'Algemene Voorwaarden',
    cookies: 'Cookies'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      nl: { translation: nlTranslations }
    },
    lng: 'nl',
    fallbackLng: 'nl',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
