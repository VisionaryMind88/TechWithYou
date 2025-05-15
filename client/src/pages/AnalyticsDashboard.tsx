import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/use-translation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data - in a real implementation, this would come from your Google Analytics API
const mockPageViews = [
  { name: 'Home', views: 1200, users: 980 },
  { name: 'Services', views: 890, users: 750 },
  { name: 'Portfolio', views: 780, users: 620 },
  { name: 'About', views: 590, users: 470 },
  { name: 'Contact', views: 390, users: 310 },
];

const mockTrafficSources = [
  { name: 'Direct', value: 40 },
  { name: 'Organic Search', value: 30 },
  { name: 'Social Media', value: 15 },
  { name: 'Referral', value: 10 },
  { name: 'Email', value: 5 },
];

const mockDailyVisitors = [
  { date: '2023-05-01', visitors: 120 },
  { date: '2023-05-02', visitors: 140 },
  { date: '2023-05-03', visitors: 160 },
  { date: '2023-05-04', visitors: 180 },
  { date: '2023-05-05', visitors: 200 },
  { date: '2023-05-06', visitors: 220 },
  { date: '2023-05-07', visitors: 240 },
  { date: '2023-05-08', visitors: 260 },
  { date: '2023-05-09', visitors: 280 },
  { date: '2023-05-10', visitors: 300 },
  { date: '2023-05-11', visitors: 320 },
  { date: '2023-05-12', visitors: 340 },
  { date: '2023-05-13', visitors: 360 },
  { date: '2023-05-14', visitors: 380 },
];

const mockDeviceData = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 50 },
  { name: 'Tablet', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // In a real implementation, this would change the date range for the data
  const handleTimeRangeChange = (value: string) => {
    setIsLoading(true);
    setTimeRange(value);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>{isEnglish ? 'Analytics Dashboard' : 'Analytics Dashboard'} | Digitaal Atelier</title>
        <meta name="description" content={isEnglish 
          ? 'View detailed analytics data for your website, including page views, user behavior, and traffic sources.'
          : 'Bekijk gedetailleerde analysegegevens voor uw website, inclusief paginaweergaven, gebruikersgedrag en verkeersbronnen.'
        } />
        <meta name="robots" content="noindex, nofollow" /> {/* Don't index admin pages */}
      </Helmet>
      
      <Header />
      <div className="pt-20 min-h-screen bg-neutral-50"> {/* Padding to account for fixed header */}
        {/* Hero Section */}
        <section className="relative py-12 bg-neutral-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-primary/40"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                {isEnglish ? 'Analytics Dashboard' : 'Analytics Dashboard'}
              </h1>
              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                {isEnglish 
                  ? 'Monitor your website performance, user behavior, and search engine visibility metrics.'
                  : 'Monitor de prestaties van uw website, gebruikersgedrag en zichtbaarheid in zoekmachines.'}
              </p>
              
              <div className="flex items-center gap-4">
                <p className="text-white/80">
                  {isEnglish ? 'Time Range:' : 'Tijdsbestek:'}
                </p>
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={isEnglish ? "Select time range" : "Selecteer tijdsbestek"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">{isEnglish ? "Last 7 days" : "Laatste 7 dagen"}</SelectItem>
                    <SelectItem value="30d">{isEnglish ? "Last 30 days" : "Laatste 30 dagen"}</SelectItem>
                    <SelectItem value="90d">{isEnglish ? "Last 90 days" : "Laatste 90 dagen"}</SelectItem>
                    <SelectItem value="1y">{isEnglish ? "Last year" : "Afgelopen jaar"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">{isEnglish ? 'Overview' : 'Overzicht'}</TabsTrigger>
                <TabsTrigger value="acquisition">{isEnglish ? 'Acquisition' : 'Acquisitie'}</TabsTrigger>
                <TabsTrigger value="behavior">{isEnglish ? 'Behavior' : 'Gedrag'}</TabsTrigger>
                <TabsTrigger value="seo">{isEnglish ? 'SEO' : 'SEO'}</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {isLoading ? (
                    <>
                      <StatsCard isLoading={true} />
                      <StatsCard isLoading={true} />
                      <StatsCard isLoading={true} />
                      <StatsCard isLoading={true} />
                    </>
                  ) : (
                    <>
                      <StatsCard 
                        title={isEnglish ? "Users" : "Gebruikers"}
                        value="3,245"
                        change="+5.2%"
                        isPositive={true}
                      />
                      <StatsCard 
                        title={isEnglish ? "Page Views" : "Paginaweergaven"}
                        value="12,890"
                        change="+8.4%"
                        isPositive={true}
                      />
                      <StatsCard 
                        title={isEnglish ? "Avg. Session" : "Gem. Sessie"}
                        value="2:34"
                        change="-0.5%"
                        isPositive={false}
                      />
                      <StatsCard 
                        title={isEnglish ? "Bounce Rate" : "Bouncepercentage"}
                        value="32.8%"
                        change="-3.1%"
                        isPositive={true}
                      />
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Visitors Over Time' : 'Bezoekers in de Tijd'}</h3>
                    {isLoading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockDailyVisitors}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Device Distribution' : 'Apparaatverdeling'}</h3>
                    {isLoading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={mockDeviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockDeviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Card>
                </div>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Popular Pages' : 'Populaire Pagina\'s'}</h3>
                  {isLoading ? (
                    <div className="w-full h-[400px] flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={mockPageViews}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" name={isEnglish ? "Page Views" : "Paginaweergaven"} fill="#8884d8" />
                        <Bar dataKey="users" name={isEnglish ? "Users" : "Gebruikers"} fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </TabsContent>
              
              {/* Acquisition Tab */}
              <TabsContent value="acquisition">
                <Card className="p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Traffic Sources' : 'Verkeersbronnen'}</h3>
                  {isLoading ? (
                    <div className="w-full h-[400px] flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={mockTrafficSources}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value}% (${(percent * 100).toFixed(0)}%)`}
                        >
                          {mockTrafficSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Top Referrers' : 'Belangrijkste Verwijzers'}</h3>
                    {isLoading ? (
                      <SkeletonTable />
                    ) : (
                      <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Source' : 'Bron'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Users' : 'Gebruikers'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Conversion Rate' : 'Conversiepercentage'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">google.com</td>
                              <td className="px-4 py-3 whitespace-nowrap">1,245</td>
                              <td className="px-4 py-3 whitespace-nowrap">3.2%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">facebook.com</td>
                              <td className="px-4 py-3 whitespace-nowrap">845</td>
                              <td className="px-4 py-3 whitespace-nowrap">2.7%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">linkedin.com</td>
                              <td className="px-4 py-3 whitespace-nowrap">532</td>
                              <td className="px-4 py-3 whitespace-nowrap">4.1%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">twitter.com</td>
                              <td className="px-4 py-3 whitespace-nowrap">328</td>
                              <td className="px-4 py-3 whitespace-nowrap">2.3%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">instagram.com</td>
                              <td className="px-4 py-3 whitespace-nowrap">215</td>
                              <td className="px-4 py-3 whitespace-nowrap">1.9%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Search Keywords' : 'Zoekwoorden'}</h3>
                    {isLoading ? (
                      <SkeletonTable />
                    ) : (
                      <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Keyword' : 'Trefwoord'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Clicks' : 'Klikken'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Position' : 'Positie'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">web development</td>
                              <td className="px-4 py-3 whitespace-nowrap">324</td>
                              <td className="px-4 py-3 whitespace-nowrap">3.2</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">professional website</td>
                              <td className="px-4 py-3 whitespace-nowrap">258</td>
                              <td className="px-4 py-3 whitespace-nowrap">4.6</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">ui/ux design</td>
                              <td className="px-4 py-3 whitespace-nowrap">143</td>
                              <td className="px-4 py-3 whitespace-nowrap">5.3</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">app development</td>
                              <td className="px-4 py-3 whitespace-nowrap">128</td>
                              <td className="px-4 py-3 whitespace-nowrap">6.1</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">dashboard design</td>
                              <td className="px-4 py-3 whitespace-nowrap">95</td>
                              <td className="px-4 py-3 whitespace-nowrap">7.8</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>
              
              {/* Behavior Tab */}
              <TabsContent value="behavior">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Page Load Speed' : 'Paginalaadsnelheid'}</h3>
                    {isLoading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{isEnglish ? 'Mobile' : 'Mobiel'}</span>
                            <span className="text-sm font-medium">3.2s</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: '75%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{isEnglish ? 'Desktop' : 'Desktop'}</span>
                            <span className="text-sm font-medium">1.8s</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: '90%'}}></div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <h4 className="font-medium mb-2">{isEnglish ? 'Core Web Vitals' : 'Core Web Vitals'}</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-green-100 p-3 rounded-lg text-center">
                              <p className="text-xs text-neutral-600">LCP</p>
                              <p className="font-bold text-green-700">2.1s</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg text-center">
                              <p className="text-xs text-neutral-600">FID</p>
                              <p className="font-bold text-green-700">12ms</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg text-center">
                              <p className="text-xs text-neutral-600">CLS</p>
                              <p className="font-bold text-yellow-700">0.12</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'User Flow' : 'Gebruikersstroom'}</h3>
                    {isLoading ? (
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Starting Page' : 'Startpagina'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Next Page' : 'Volgende Pagina'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                {isEnglish ? 'Dropoff %' : 'Uitval %'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            <tr>
                              <td className="px-4 py-3">Home</td>
                              <td className="px-4 py-3">Services</td>
                              <td className="px-4 py-3">28%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Home</td>
                              <td className="px-4 py-3">Portfolio</td>
                              <td className="px-4 py-3">22%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Services</td>
                              <td className="px-4 py-3">Contact</td>
                              <td className="px-4 py-3">15%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Portfolio</td>
                              <td className="px-4 py-3">About</td>
                              <td className="px-4 py-3">18%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Contact</td>
                              <td className="px-4 py-3">(Exit)</td>
                              <td className="px-4 py-3">65%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </div>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Event Tracking' : 'Gebeurtenistracking'}</h3>
                  {isLoading ? (
                    <SkeletonTable />
                  ) : (
                    <div className="overflow-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Event' : 'Gebeurtenis'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Count' : 'Aantal'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Conversion %' : 'Conversie %'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          <tr>
                            <td className="px-4 py-3">Contact Form Submit</td>
                            <td className="px-4 py-3">154</td>
                            <td className="px-4 py-3">4.8%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Portfolio Item Click</td>
                            <td className="px-4 py-3">432</td>
                            <td className="px-4 py-3">13.3%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Service Detail View</td>
                            <td className="px-4 py-3">287</td>
                            <td className="px-4 py-3">8.9%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Chat Opened</td>
                            <td className="px-4 py-3">203</td>
                            <td className="px-4 py-3">6.3%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">Newsletter Signup</td>
                            <td className="px-4 py-3">98</td>
                            <td className="px-4 py-3">3.0%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              {/* SEO Tab */}
              <TabsContent value="seo">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatsCard 
                    title={isEnglish ? "Indexed Pages" : "Geïndexeerde Pagina's"}
                    value="24"
                    isLoading={isLoading}
                  />
                  <StatsCard 
                    title={isEnglish ? "Avg. Position" : "Gem. Positie"}
                    value="4.2"
                    change="+0.8"
                    isPositive={true}
                    isLoading={isLoading}
                  />
                  <StatsCard 
                    title={isEnglish ? "Impressions" : "Impressies"}
                    value="8,432"
                    change="+12.4%"
                    isPositive={true}
                    isLoading={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'SEO Issues' : 'SEO-problemen'}</h3>
                    {isLoading ? (
                      <SkeletonList />
                    ) : (
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-yellow-100 text-yellow-800 rounded-full">!</span>
                          <div>
                            <p className="font-medium">{isEnglish ? '3 pages missing meta descriptions' : '3 pagina\'s zonder metabeschrijvingen'}</p>
                            <p className="text-sm text-neutral-600">{isEnglish ? 'Meta descriptions help search engines understand your content' : 'Metabeschrijvingen helpen zoekmachines uw inhoud te begrijpen'}</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-red-100 text-red-800 rounded-full">!</span>
                          <div>
                            <p className="font-medium">{isEnglish ? '2 pages with slow load times' : '2 pagina\'s met trage laadtijden'}</p>
                            <p className="text-sm text-neutral-600">{isEnglish ? 'Page load speed is a ranking factor for search engines' : 'Paginalaadsnelheid is een rankingfactor voor zoekmachines'}</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-yellow-100 text-yellow-800 rounded-full">!</span>
                          <div>
                            <p className="font-medium">{isEnglish ? '4 images missing alt text' : '4 afbeeldingen zonder alt-tekst'}</p>
                            <p className="text-sm text-neutral-600">{isEnglish ? 'Alt text helps search engines understand images' : 'Alt-tekst helpt zoekmachines afbeeldingen te begrijpen'}</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-green-100 text-green-800 rounded-full">✓</span>
                          <div>
                            <p className="font-medium">{isEnglish ? 'Schema markup implemented correctly' : 'Schema-markup correct geïmplementeerd'}</p>
                            <p className="text-sm text-neutral-600">{isEnglish ? 'Structured data helps with rich snippets in search results' : 'Gestructureerde gegevens helpen bij rich snippets in zoekresultaten'}</p>
                          </div>
                        </li>
                      </ul>
                    )}
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Backlink Summary' : 'Backlinkoverzicht'}</h3>
                    {isLoading ? (
                      <SkeletonList />
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{isEnglish ? 'Total Backlinks' : 'Totaal Aantal Backlinks'}</span>
                            <span className="text-sm font-medium">187</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '65%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{isEnglish ? 'Referring Domains' : 'Verwijzende Domeinen'}</span>
                            <span className="text-sm font-medium">42</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '52%'}}></div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <h4 className="font-medium mb-3">{isEnglish ? 'Top Backlink Domains' : 'Belangrijkste Backlinkdomeinen'}</h4>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-sm">example-partner.com</span>
                              <span className="text-sm font-medium">28 links</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-sm">industry-blog.com</span>
                              <span className="text-sm font-medium">15 links</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-sm">design-showcase.net</span>
                              <span className="text-sm font-medium">12 links</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-sm">web-directory.org</span>
                              <span className="text-sm font-medium">8 links</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{isEnglish ? 'Keyword Rankings' : 'Zoekwoordenrangschikking'}</h3>
                  {isLoading ? (
                    <SkeletonTable />
                  ) : (
                    <div className="overflow-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Keyword' : 'Zoekwoord'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Position' : 'Positie'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Change' : 'Verandering'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              {isEnglish ? 'Monthly Searches' : 'Maandelijkse Zoekopdrachten'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          <tr>
                            <td className="px-4 py-3">web design agency</td>
                            <td className="px-4 py-3 font-medium">3</td>
                            <td className="px-4 py-3 text-green-600">+2</td>
                            <td className="px-4 py-3">5,400</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">professional website development</td>
                            <td className="px-4 py-3 font-medium">5</td>
                            <td className="px-4 py-3 text-green-600">+1</td>
                            <td className="px-4 py-3">2,900</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">custom web application</td>
                            <td className="px-4 py-3 font-medium">7</td>
                            <td className="px-4 py-3 text-green-600">+3</td>
                            <td className="px-4 py-3">1,800</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">business dashboard design</td>
                            <td className="px-4 py-3 font-medium">8</td>
                            <td className="px-4 py-3 text-red-600">-2</td>
                            <td className="px-4 py-3">1,200</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">ux/ui design agency</td>
                            <td className="px-4 py-3 font-medium">12</td>
                            <td className="px-4 py-3 text-gray-600">0</td>
                            <td className="px-4 py-3">3,200</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

// Helper Components
interface StatsCardProps {
  title?: string;
  value?: string;
  change?: string;
  isPositive?: boolean;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, change, isPositive, isLoading = false }: StatsCardProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-5 w-24 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-20" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      {change && (
        <p className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </p>
      )}
    </Card>
  );
};

const SkeletonTable = () => (
  <div className="space-y-4">
    <div className="flex space-x-4 mb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-28" />
    </div>
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

const SkeletonList = () => (
  <div className="space-y-4">
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  </div>
);

export default AnalyticsDashboard;