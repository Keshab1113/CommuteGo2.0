import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Zap, 
  Shield, 
  Bell, 
  Route, 
  Car, 
  Bus, 
  Bike, 
  Footprints,
  Smartphone,
  Globe,
  BarChart3,
  Users,
  Star,
  Check,
  ChevronRight,
  Layers,
  Target,
  TrendingUp,
  Calendar,
  Clock3,
  Navigation,
  TrafficCone,
  Cloud,
  Wifi,
  Battery,
  HeadphonesIcon,
  MessageSquare,
  Mail,
  ArrowRight,
  Sparkles,
  Brain,
  Gauge,
  Timer,
  MapPinned,
  BusFront,
  Train,
  Ship,
  Plane,
  CircleParking,
  Fuel,
  Wallet,
  CreditCard,
  Gift,
  Crown,
  Rocket,
  Diamond,
  Heart,
  ThumbsUp,
  Award,
  Zap as Lightning
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';

const Features = () => {
  const [activeTab, setActiveTab] = useState('core');

  const coreFeatures = [
    {
      icon: Route,
      title: 'Smart Route Planning',
      description: 'AI-powered route optimization that learns your preferences and finds the fastest paths.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Live traffic data and transit information to keep you informed about delays and changes.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Customizable alerts for departures, delays, and route changes before they affect you.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: MapPin,
      title: 'Location Tracking',
      description: 'Precise GPS tracking with offline maps for areas with poor connectivity.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bus,
      title: 'Multi-Modal Transport',
      description: 'Seamlessly switch between driving, transit, cycling, and walking in one trip.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with end-to-end encryption for your data.',
      color: 'from-slate-500 to-zinc-500'
    }
  ];

  const advancedFeatures = [
    {
      icon: Brain,
      title: 'AI Route Optimization',
      description: 'Machine learning algorithms analyze millions of data points to predict the fastest routes.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Calendar,
      title: 'Schedule Planning',
      description: 'Plan your week ahead with smart suggestions based on your calendar and typical patterns.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Commute Analytics',
      description: 'Detailed insights into your travel patterns, time spent, and potential savings.',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: Users,
      title: 'Carpool Matching',
      description: 'Find and connect with commuters heading the same way to share rides and costs.',
      color: 'from-green-500 to-lime-500'
    },
    {
      icon: TrafficCone,
      title: 'Traffic Prediction',
      description: 'Predictive traffic analysis helps you avoid congestion before it happens.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Cloud,
      title: 'Weather Integration',
      description: 'Weather-aware routing suggests the best times and routes based on conditions.',
      color: 'from-sky-500 to-blue-500'
    }
  ];

  const upcomingFeatures = [
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Natural language assistant to help plan trips, answer questions, and provide recommendations.',
      color: 'from-pink-500 to-rose-500',
      badge: 'Coming Soon'
    },
    {
      icon: Car,
      title: 'Autonomous Vehicle Support',
      description: 'Integration with autonomous vehicles for hands-free commuting in the future.',
      color: 'from-violet-500 to-indigo-500',
      badge: 'Coming Soon'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Premium Support',
      description: 'Round-the-clock customer support for urgent commute assistance.',
      color: 'from-amber-500 to-yellow-500',
      badge: 'Coming Soon'
    },
    {
      icon: Globe,
      title: 'Global Coverage Expansion',
      description: 'Expanding to 100+ new cities worldwide with localized transit data.',
      color: 'from-cyan-500 to-blue-500',
      badge: 'Coming Soon'
    },
    {
      icon: Wallet,
      title: 'In-App Payments',
      description: 'Pay for transit, CircleParking, and tolls directly through the app.',
      color: 'from-green-500 to-emerald-500',
      badge: 'Coming Soon'
    },
    {
      icon: Heart,
      title: 'Health Integration',
      description: 'Track health metrics like steps, calories, and environmental impact from your commutes.',
      color: 'from-red-500 to-pink-500',
      badge: 'Coming Soon'
    }
  ];

  const FeatureCard = ({ feature, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group hover:-translate-y-1">
        <CardContent className="p-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{feature.description}</p>
          {feature.badge && (
            <Badge className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
              {feature.badge}
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const features = activeTab === 'core' ? coreFeatures : activeTab === 'advanced' ? advancedFeatures : upcomingFeatures;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              <Zap className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
              Powerful Features for Better Commutes
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Everything you need to navigate your city efficiently, save time, and reduce commute stress.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {[
              { value: '50+', label: 'Transport Types', icon: Layers },
              { value: '99.9%', label: 'Uptime', icon: Zap },
              { value: '10M+', label: 'Routes Daily', icon: Route },
              { value: '4.8★', label: 'User Rating', icon: Star }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-100 dark:border-slate-700">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="core" className="w-full" onValueChange={setActiveTab}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center mb-12"
            >
              <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                <TabsTrigger 
                  value="core" 
                  className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Core Features
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger 
                  value="upcoming" 
                  className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Coming Soon
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="core" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreFeatures.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedFeatures.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingFeatures.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Transport Modes */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">All Transport Modes</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Whether you drive, take transit, bike, or walk — we've got you covered
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Car, label: 'Driving', color: 'bg-blue-500' },
              { icon: Bus, label: 'Bus', color: 'bg-green-500' },
              { icon: Train, label: 'Train', color: 'bg-purple-500' },
              { icon: Bike, label: 'Cycling', color: 'bg-orange-500' },
              { icon: Footprints, label: 'Walking', color: 'bg-pink-500' }
            ].map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <mode.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{mode.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why CommuteGo?</h2>
            <p className="text-slate-600 dark:text-slate-300">
              See how we compare to other commute apps
            </p>
          </motion.div>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 font-semibold text-slate-900 dark:text-white">Feature</div>
                <div className="p-4 font-semibold text-center text-slate-900 dark:text-white">CommuteGo</div>
                <div className="p-4 font-semibold text-center text-slate-500">App A</div>
                <div className="p-4 font-semibold text-center text-slate-500">App B</div>
              </div>
              {[
                { feature: 'Real-time Traffic', commutego: true, appA: true, appB: false },
                { feature: 'Multi-modal Routes', commutego: true, appA: false, appB: true },
                { feature: 'AI Optimization', commutego: true, appA: false, appB: false },
                { feature: 'Offline Maps', commutego: true, appA: true, appB: false },
                { feature: 'Carpool Matching', commutego: true, appA: false, appB: false },
                { feature: 'Commute Analytics', commutego: true, appA: false, appB: true },
                { feature: 'Weather Integration', commutego: true, appA: true, appB: false }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-700/50">
                  <div className="p-4 text-slate-600 dark:text-slate-300">{row.feature}</div>
                  <div className="p-4 text-center">
                    {row.commutego && <Check className="w-5 h-5 mx-auto text-green-500" />}
                  </div>
                  <div className="p-4 text-center">
                    {row.appA && <Check className="w-5 h-5 mx-auto text-green-500" />}
                  </div>
                  <div className="p-4 text-center">
                    {row.appB && <Check className="w-5 h-5 mx-auto text-green-500" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Commute?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of users who have already discovered a better way to commute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Download App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;