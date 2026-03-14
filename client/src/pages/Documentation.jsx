import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  Search, 
  Zap, 
  Shield, 
  MapPin, 
  Clock, 
  Brain,
  ArrowRight,
  CheckCircle,
  Star,
  MessageCircle,
  Mail,
  ExternalLink,
  Menu,
  X,
  FileText,
  Code,
  HelpCircle,
  Leaf,
  Sparkles,
  Users,
  BarChart3,
  Settings,
  Bell,
  Route
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      description: 'Learn how to set up and start using CommuteGo'
    },
    {
      id: 'features',
      title: 'Features',
      icon: Sparkles,
      description: 'Explore all the powerful features we offer'
    },
    {
      id: 'route-planning',
      title: 'Route Planning',
      icon: Route,
      description: 'Master the art of efficient commute planning'
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      icon: Brain,
      description: 'Understand your commute patterns with AI'
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      description: 'Integrate CommuteGo into your applications'
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      description: 'Frequently asked questions'
    },
    {
      id: 'support',
      title: 'Support',
      icon: MessageCircle,
      description: 'Get help when you need it'
    }
  ];

  const features = [
    {
      title: 'Smart Route Planning',
      description: 'Get AI-powered route suggestions that adapt to real-time traffic conditions',
      icon: MapPin,
      color: 'bg-blue-500'
    },
    {
      title: 'Time Optimization',
      description: 'Save up to 30% on your daily commute time with intelligent scheduling',
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Cost Savings',
      description: 'Compare costs across different transportation modes and save money',
      icon: Zap,
      color: 'bg-yellow-500'
    },
    {
      title: 'Environmental Impact',
      description: 'Track your carbon footprint and choose eco-friendly routes',
      icon: Leaf,
      color: 'bg-emerald-500'
    },
    {
      title: 'Real-time Alerts',
      description: 'Stay informed about traffic, weather, and route disruptions',
      icon: Bell,
      color: 'bg-red-500'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Visualize your commute patterns and get personalized insights',
      icon: BarChart3,
      color: 'bg-purple-500'
    }
  ];

  const faqs = [
    {
      question: 'How does CommuteGo calculate route times?',
      answer: 'CommuteGo uses advanced algorithms that consider real-time traffic data, historical patterns, weather conditions, and multiple transportation modes to provide accurate route times. Our AI continuously learns from user behavior to improve predictions.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption for all data transmission and storage. Your personal information and commute data are never shared with third parties without your explicit consent.'
    },
    {
      question: 'Can I use CommuteGo for business travel?',
      answer: 'Yes! CommuteGo offers business plans with team management, expense tracking, and administrative controls. Contact our sales team for custom enterprise solutions.'
    },
    {
      question: 'What transportation modes are supported?',
      answer: 'CommuteGo supports driving, public transit, walking, cycling, and combinations of these modes. We integrate with major transit providers to give you comprehensive route options.'
    },
    {
      question: 'How accurate are the AI predictions?',
      answer: 'Our AI model achieves 94% accuracy in predicting commute times. The system improves over time as it learns your specific patterns and preferences.'
    },
    {
      question: 'Can I export my commute data?',
      answer: 'Yes, you can export your commute history and analytics data in CSV or JSON format from the Settings page. This includes route details, time savings, and environmental impact metrics.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <BookOpen className="w-3 h-3 mr-1" />
              Documentation v2.0
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              CommuteGo
              <span className="block text-blue-200">Documentation</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Everything you need to know about using CommuteGo. From getting started to advanced features and API integration.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:ring-2 focus:ring-white/30"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-slate-50 dark:text-slate-900"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-72 flex-shrink-0"
          >
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span>Navigation</span>
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>

            <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block sticky top-8 space-y-2`}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{section.title}</div>
                    <div className={`text-xs truncate ${activeSection === section.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {section.description}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 min-w-0"
          >
            {/* Getting Started Section */}
            <motion.section id="getting-started" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/25">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
                  <p className="text-slate-600 dark:text-slate-400">Set up your account and start optimizing your commute</p>
                </div>
              </div>

              <Card className="overflow-hidden border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50">
                <CardHeader className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>Get up and running in 5 minutes</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-4">
                    {[
                      { step: 1, title: 'Create Your Account', desc: 'Sign up with your email or use Google/GitHub OAuth' },
                      { step: 2, title: 'Set Your Home & Work Locations', desc: 'Add your regular commute points for personalized routes' },
                      { step: 3, title: 'Choose Your Preferences', desc: 'Select preferred transport modes and optimization goals' },
                      { step: 4, title: 'Start Your First Route', desc: 'Get AI-powered route suggestions tailored to your needs' }
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Start Free Trial
                    </Button>
                    <Button variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Tutorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Features Section */}
            <motion.section id="features" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Features</h2>
                  <p className="text-slate-600 dark:text-slate-400">Powerful tools to optimize your daily commute</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Route Planning Section */}
            <motion.section id="route-planning" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/25">
                  <Route className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Route Planning</h2>
                  <p className="text-slate-600 dark:text-slate-400">Master efficient commute planning</p>
                </div>
              </div>

              <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50">
                <CardContent className="p-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="basic">Basic Planning</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                      <TabsTrigger value="multi">Multi-modal</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-400">
                          Planning your route is simple. Enter your origin and destination, and CommuteGo will automatically 
                          calculate the best routes based on your preferences. You can save frequently used routes for quick access.
                        </p>
                        <ul className="space-y-2 mt-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Enter starting point and destination</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Select preferred transport modes</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Choose optimization priority (time, cost, or eco)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>View and compare route options</span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-400">
                          Advanced options allow you to set specific constraints like departure time, avoid toll roads, 
                          prefer highways, or set maximum walking distance for transit connections.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="multi" className="space-y-4">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-400">
                          Multi-modal planning combines different transportation modes into a single journey. 
                          For example, drive to a transit station, take the train, then bike to your destination.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.section>

            {/* AI Insights Section */}
            <motion.section id="ai-insights" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/25">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Insights</h2>
                  <p className="text-slate-600 dark:text-slate-400">Understand your commute patterns with AI</p>
                </div>
              </div>

              <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">How AI Insights Work</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Our AI analyzes your commute history, traffic patterns, and personal preferences to provide 
                        personalized insights and recommendations.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-slate-600 dark:text-slate-400">Predictive ETA based on historical data</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-slate-600 dark:text-slate-400">Personalized route recommendations</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-slate-600 dark:text-slate-400">Cost and time savings analysis</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl p-6">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Sample Insight</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Average Time Saved</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">+23 min/week</span>
                        </div>
                        <Progress value={78} className="h-2" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          By taking the 7:30 AM route instead of 8:00 AM, you save an average of 23 minutes daily.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* API Section */}
            <motion.section id="api" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/25">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">API Reference</h2>
                  <p className="text-slate-600 dark:text-slate-400">Integrate CommuteGo into your applications</p>
                </div>
              </div>

              <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50">
                <CardHeader className="bg-slate-900 text-white">
                  <CardTitle className="font-mono text-sm">GET /api/v1/routes</CardTitle>
                  <CardDescription className="text-slate-300">Calculate routes between two points</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Request Parameters</h4>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre className="text-slate-700 dark:text-slate-300">{`{
  "origin": "40.7128,-74.0060",
  "destination": "40.7580,-73.9855",
  "mode": "driving|transit|walking|bicycling",
  "optimize": "time|cost|eco"
}`}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Response</h4>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre className="text-slate-700 dark:text-slate-300">{`{
  "routes": [
    {
      "id": "route_123",
      "distance": "5.2 miles",
      "duration": "18 mins",
      "mode": "driving",
      "cost": 2.50,
      "carbon": "2.1 kg"
    }
  ]
}`}</pre>
                      </div>
                    </div>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full API Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* FAQ Section */}
            <motion.section id="faq" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/25">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                  <p className="text-slate-600 dark:text-slate-400">Common questions and answers</p>
                </div>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Support Section */}
            <motion.section id="support" variants={itemVariants} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pink-500 rounded-xl shadow-lg shadow-pink-500/25">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Support</h2>
                  <p className="text-slate-600 dark:text-slate-400">Get help when you need it</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Live Chat</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      Get instant help from our support team
                    </p>
                    <Button variant="outline" className="w-full">Start Chat</Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      Send us a detailed message
                    </p>
                    <Button variant="outline" className="w-full">Send Email</Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Community</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      Connect with other users
                    </p>
                    <Button variant="outline" className="w-full">Join Community</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          </motion.main>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you get the most out of CommuteGo. 
            Reach out anytime and we'll get back to you within 24 hours.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Star className="w-4 h-4 mr-2" />
              Rate This Doc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Play icon component
const Play = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default Documentation;