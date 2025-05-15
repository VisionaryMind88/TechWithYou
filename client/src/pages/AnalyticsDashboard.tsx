import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { TrendingUp, TrendingDown, Users, MousePointerClick, Clock, Activity, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";

interface StatsCardProps {
  title?: string;
  value?: string;
  change?: string;
  isPositive?: boolean;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, change, isPositive, isLoading = false }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoading ? <Skeleton className="h-4 w-[100px]" /> : title}
        </CardTitle>
        <div className="text-muted-foreground">
          {isLoading ? <Skeleton className="h-4 w-[20px]" /> : <Activity className="h-4 w-4" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-[100px]" /> : value}
        </div>
        <div className="text-xs text-muted-foreground flex gap-1 items-center mt-1">
          {isLoading ? (
            <Skeleton className="h-4 w-[80px]" />
          ) : (
            <>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {change}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const [isLoading, setIsLoading] = useState(true);
  const [hasGaKey, setHasGaKey] = useState(true);
  
  // Check if Google Analytics key is available
  useEffect(() => {
    // Check for the Google Analytics key
    const gaKey = import.meta.env.VITE_GA_MEASUREMENT_ID;
    setHasGaKey(!!gaKey);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Track page view with additional event for dashboard access
    if (gaKey) {
      setTimeout(() => {
        trackEvent('dashboard_visit', 'admin', 'analytics', 1);
      }, 500);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={isEnglish ? "Analytics Dashboard" : "Analytics Dashboard"}
        description={isEnglish 
          ? "View website performance data and visitor insights for Digitaal Atelier."
          : "Bekijk website prestaties en bezoekersgegevens voor Digitaal Atelier."
        }
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": isEnglish ? "Analytics Dashboard" : "Analytics Dashboard",
          "description": isEnglish 
            ? "View website performance data and visitor insights for Digitaal Atelier."
            : "Bekijk website prestaties en bezoekersgegevens voor Digitaal Atelier.",
          "isAccessibleForFree": "False",
          "audience": "Business owners, website administrators",
          "provider": {
            "@type": "Organization",
            "name": "Digitaal Atelier",
            "url": "https://digitaalatelier.com/"
          }
        }}
      />
      <Header />
      <div className="flex-1 container max-w-6xl mx-auto py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-6">{isEnglish ? "Analytics Dashboard" : "Analytics Dashboard"}</h1>
        
        {!hasGaKey && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isEnglish ? "Google Analytics Not Configured" : "Google Analytics Niet Geconfigureerd"}</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <div>
                {isEnglish 
                  ? "To use the analytics dashboard, you need to add your Google Analytics Measurement ID to the project's environment variables."
                  : "Om het analytics dashboard te gebruiken, moet je je Google Analytics Measurement ID toevoegen aan de omgevingsvariabelen van het project."
                }
              </div>
              <div className="bg-neutral-100 p-3 rounded-md">
                <p className="text-xs font-mono mb-2">Add this to your Replit Secrets:</p>
                <div className="flex items-center">
                  <code className="bg-neutral-200 p-1 rounded text-xs">VITE_GA_MEASUREMENT_ID</code>
                  <span className="mx-2">=</span>
                  <code className="bg-neutral-200 p-1 rounded text-xs">G-XXXXXXXXXX</code>
                </div>
                <p className="text-xs mt-2">
                  {isEnglish 
                    ? "You can find your Measurement ID in your Google Analytics account under Admin > Property > Data Streams > Web"
                    : "Je kunt je Measurement ID vinden in je Google Analytics-account onder Admin > Property > Data Streams > Web"
                  }
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-8">
            <TabsTrigger value="overview">{isEnglish ? "Overview" : "Overzicht"}</TabsTrigger>
            <TabsTrigger value="visitors">{isEnglish ? "Visitors" : "Bezoekers"}</TabsTrigger>
            <TabsTrigger value="pages">{isEnglish ? "Pages" : "Pagina's"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatsCard 
                title={isEnglish ? "Total Visitors" : "Totaal Bezoekers"}
                value="1,254"
                change="+12.5% from last month"
                isPositive={true}
                isLoading={isLoading}
              />
              <StatsCard 
                title={isEnglish ? "Page Views" : "Paginaweergaven"}
                value="5,783"
                change="+23.1% from last month"
                isPositive={true}
                isLoading={isLoading}
              />
              <StatsCard 
                title={isEnglish ? "Bounce Rate" : "Bouncepercentage"}
                value="42.8%"
                change="-3.2% from last month"
                isPositive={true}
                isLoading={isLoading}
              />
              <StatsCard 
                title={isEnglish ? "Avg. Session Duration" : "Gem. Sessieduur"}
                value="2m 14s"
                change="+0.8% from last month"
                isPositive={true}
                isLoading={isLoading}
              />
            </div>
            
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{isEnglish ? "Traffic Sources" : "Verkeersbronnen"}</CardTitle>
                  <CardDescription>{isEnglish ? "Where visitors come from" : "Waar bezoekers vandaan komen"}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-primary mr-2"></div>
                          <span>Organic Search</span>
                        </div>
                        <span className="font-bold">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-blue-400 mr-2"></div>
                          <span>Direct</span>
                        </div>
                        <span className="font-bold">30%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-green-400 mr-2"></div>
                          <span>Social Media</span>
                        </div>
                        <span className="font-bold">15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-yellow-400 mr-2"></div>
                          <span>Referral</span>
                        </div>
                        <span className="font-bold">10%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{isEnglish ? "Devices" : "Apparaten"}</CardTitle>
                  <CardDescription>{isEnglish ? "Types of devices visitors use" : "Type apparaten die bezoekers gebruiken"}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-primary mr-2"></div>
                          <span>Mobile</span>
                        </div>
                        <span className="font-bold">65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-blue-400 mr-2"></div>
                          <span>Desktop</span>
                        </div>
                        <span className="font-bold">30%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded bg-green-400 mr-2"></div>
                          <span>Tablet</span>
                        </div>
                        <span className="font-bold">5%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Visitor Demographics" : "Bezoekersdemografie"}</CardTitle>
                <CardDescription>{isEnglish ? "Visitor age and gender" : "Leeftijd en geslacht van bezoekers"}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{isEnglish ? "Age Groups" : "Leeftijdsgroepen"}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-16">18-24</span>
                          <div className="h-4 bg-primary rounded w-1/5"></div>
                          <span>20%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16">25-34</span>
                          <div className="h-4 bg-primary rounded w-2/5"></div>
                          <span>40%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16">35-44</span>
                          <div className="h-4 bg-primary rounded w-1/4"></div>
                          <span>25%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16">45-54</span>
                          <div className="h-4 bg-primary rounded w-[10%]"></div>
                          <span>10%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16">55+</span>
                          <div className="h-4 bg-primary rounded w-[5%]"></div>
                          <span>5%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{isEnglish ? "Gender" : "Geslacht"}</h3>
                      <div className="flex gap-8">
                        <div className="flex flex-col items-center">
                          <div className="h-32 w-16 bg-blue-400 rounded-t"></div>
                          <span>Male: 55%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-24 w-16 bg-pink-400 rounded-t"></div>
                          <span>Female: 45%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Top Pages" : "Populaire Pagina's"}</CardTitle>
                <CardDescription>{isEnglish ? "Most viewed pages on the website" : "Meest bekeken pagina's op de website"}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 font-bold pb-2 border-b">
                      <div>{isEnglish ? "Page" : "Pagina"}</div>
                      <div className="text-center">{isEnglish ? "Views" : "Weergaven"}</div>
                      <div className="text-center">{isEnglish ? "Avg. Time" : "Gem. Tijd"}</div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <div className="truncate">/</div>
                      <div className="text-center">2,341</div>
                      <div className="text-center">1m 20s</div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <div className="truncate">/services</div>
                      <div className="text-center">1,456</div>
                      <div className="text-center">2m 05s</div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <div className="truncate">/portfolio</div>
                      <div className="text-center">982</div>
                      <div className="text-center">1m 35s</div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <div className="truncate">/about</div>
                      <div className="text-center">721</div>
                      <div className="text-center">0m 50s</div>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <div className="truncate">/contact</div>
                      <div className="text-center">543</div>
                      <div className="text-center">1m 15s</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* SEO Recommendations */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{isEnglish ? "SEO Recommendations" : "SEO Aanbevelingen"}</CardTitle>
                <CardDescription>
                  {isEnglish 
                    ? "Suggestions to improve your website's search engine ranking"
                    : "Suggesties om de zoekmachinenranking van je website te verbeteren"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <h3 className="font-semibold text-amber-800 mb-2">
                        {isEnglish ? "Improve Page Speed" : "Verbeter Paginasnelheid"}
                      </h3>
                      <p className="text-amber-700 text-sm mb-2">
                        {isEnglish 
                          ? "Your homepage loading time is 3.2 seconds. Aim for under 2 seconds for better user experience and rankings."
                          : "Je homepage laadtijd is 3.2 seconden. Streef naar minder dan 2 seconden voor een betere gebruikerservaring en rankings."
                        }
                      </p>
                      <Button variant="outline" size="sm" className="text-amber-800 border-amber-300 hover:bg-amber-100">
                        {isEnglish ? "View Details" : "Bekijk Details"}
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="font-semibold text-green-800 mb-2">
                        {isEnglish ? "Good: Mobile Responsive" : "Goed: Mobiel Responsief"}
                      </h3>
                      <p className="text-green-700 text-sm mb-2">
                        {isEnglish
                          ? "Your website passes Google's mobile-friendly test. This positively impacts your SEO ranking."
                          : "Je website slaagt voor Google's mobielvriendelijke test. Dit heeft een positieve invloed op je SEO-ranking."
                        }
                      </p>
                      <Button variant="outline" size="sm" className="text-green-800 border-green-300 hover:bg-green-100">
                        {isEnglish ? "View Report" : "Bekijk Rapport"}
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        {isEnglish ? "Backlink Opportunities" : "Backlink Mogelijkheden"}
                      </h3>
                      <p className="text-blue-700 text-sm mb-2">
                        {isEnglish
                          ? "Identified 15 potential websites in your industry that may provide quality backlinks."
                          : "15 potentiële websites in je branche geïdentificeerd die kwalitatieve backlinks kunnen bieden."
                        }
                      </p>
                      <Button variant="outline" size="sm" className="text-blue-800 border-blue-300 hover:bg-blue-100">
                        {isEnglish ? "View Opportunities" : "Bekijk Mogelijkheden"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;