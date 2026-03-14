import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Eye, 
  MapPin, 
  Clock, 
  Zap,
  Award,
  Heart,
  Star,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Calendar,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';

const AboutUs = () => {
  const [expandedSection, setExpandedSection] = useState('mission');
  const [email, setEmail] = useState('');

  const sections = [
    {
      id: 'mission',
      title: 'Our Mission',
      icon: Target,
      content: `At CommuteGo, we're revolutionizing how people navigate their daily commutes. Our mission is simple: to make every journey smarter, faster, and more enjoyable.

We believe that time spent commuting shouldn't be wasted. By leveraging cutting-edge AI and real-time data, we empower millions of users to optimize their travel routes, save time, and reduce stress.

Our platform integrates multiple transportation modes, provides real-time alerts, and offers personalized recommendations tailored to each user's unique needs. Whether you're driving, taking public transit, or cycling, CommuteGo is your intelligent companion for every trip.`
    },
    {
      id: 'vision',
      title: 'Our Vision',
      icon: Eye,
      content: `We envision a world where commute anxiety is a thing of the past. A future where everyone can seamlessly navigate their cities, arriving at their destinations on time and stress-free.

Our vision extends beyond just route planning. We're building an ecosystem that connects cities, transportation providers, and commuters into a unified network. By fostering sustainable transportation choices and reducing congestion, we're contributing to greener, more livable cities.

We're committed to continuous innovation, ensuring that our technology stays ahead of the curve and delivers ever-improving experiences to our users worldwide.`
    },
    {
      id: 'values',
      title: 'Our Values',
      icon: Heart,
      content: `Our core values guide everything we do:

• **Innovation**: We constantly push boundaries, embracing new technologies and ideas to improve our platform.

• **User-Centricity**: Every decision we make starts with our users. Their needs and experiences drive our development.

• **Transparency**: We believe in open communication, honest practices, and building trust through actions.

• **Sustainability**: We're dedicated to promoting eco-friendly transportation options and reducing carbon footprints.

• **Inclusivity**: Our services are designed to be accessible to everyone, regardless of ability or location.

• **Excellence**: We strive for excellence in everything we do, from code quality to customer support.`
    },
    {
      id: 'story',
      title: 'Our Story',
      icon: Calendar,
      content: `CommuteGo began in 2023 with a simple observation: commuting was unnecessarily stressful for millions of people. Our founders, frustrated with existing solutions, set out to create something better.

What started as a small team working in a garage has grown into a global platform serving millions of users across multiple countries. We've processed millions of commutes, saved countless hours, and helped reduce environmental impact through optimized routing.

Along the way, we've formed partnerships with major cities, transportation authorities, and technology companies. We've also raised funding from leading investors who share our vision for the future of urban mobility.

Today, CommuteGo continues to grow, innovate, and serve our community. We're just getting started.`
    },
    {
      id: 'team',
      title: 'Our Team',
      icon: Users,
      content: `Our team is our greatest asset. We bring together talented individuals from diverse backgrounds, united by a shared passion for solving complex problems.

• **Leadership**: Experienced executives from tech giants and startups, with deep expertise in AI, transportation, and consumer products.

• **Engineering**: World-class developers, data scientists, and ML engineers building the infrastructure that powers CommuteGo.

• **Design**: Creative designers and UX researchers crafting intuitive, beautiful experiences for our users.

• **Operations**: Dedicated professionals ensuring smooth operations, customer support, and partnership management.

• **Advisory**: Industry experts and thought leaders providing guidance and strategic direction.

We believe in hiring the best, empowering them to do their best work, and fostering a culture of collaboration and innovation.`
    },
    {
      id: 'achievements',
      title: 'Achievements',
      icon: Award,
      content: `We're proud of what we've accomplished:

• **10M+ Downloads**: Trusted by millions of commuters worldwide

• **4.8★ App Rating**: Consistently rated as a top commute app

• **50+ Cities**: Active in major cities across the globe

• **99.9% Uptime**: Reliable service you can count on

• **AI Innovation Award**: Recognized for our AI-powered routing

• **Best UX Design**: Award-winning user interface

• **Green Tech Pioneer**: Celebrated for sustainable transportation solutions

• **ISO 27001 Certified**: Highest standards of data security

These achievements motivate us to keep pushing forward and delivering excellence.`
    },
    {
      id: 'impact',
      title: 'Our Impact',
      icon: TrendingUp,
      content: `We're making a real difference in communities worldwide:

• **Time Saved**: Over 10 million hours saved through optimized routes annually

• **Carbon Reduced**: Thousands of tons of CO2 emissions prevented through efficient routing

• **Traffic Alleviated**: Contributing to reduced congestion in major cities

• **Accessibility**: Making transportation information accessible to underserved communities

• **Economic Benefit**: Saving users millions in fuel and transportation costs

• **Job Creation**: Creating opportunities in tech and customer support

We're committed to measuring and expanding our positive impact on society and the environment.`
    },
    {
      id: 'future',
      title: 'Looking Forward',
      icon: Lightbulb,
      content: `The future of CommuteGo is bright and full of possibilities:

• **AI Evolution**: Advanced machine learning for even smarter route predictions

• **Autonomous Integration**: Preparing for the rise of self-driving vehicles

• **Global Expansion**: Bringing our services to more cities worldwide

• **Multi-Modal Transport**: Seamless integration of emerging transport options

• **Smart Cities**: Partnering with urban planners for connected city infrastructure

• **Personalized Experience**: AI that truly understands individual commute patterns

We're excited to continue our journey and shape the future of urban mobility together with our users.`
    }
  ];

  const stats = [
    { value: '10M+', label: 'Active Users', icon: Users },
    { value: '50+', label: 'Cities Worldwide', icon: MapPin },
    { value: '99.9%', label: 'Uptime', icon: Zap },
    { value: '4.8★', label: 'App Rating', icon: Star },
  ];

  const teamMembers = [
    { name: 'Sarah Chen', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    { name: 'Michael Rodriguez', role: 'CTO & Co-Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
    { name: 'Emily Watson', role: 'VP of Product', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    { name: 'David Kim', role: 'VP of Engineering', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800">
              <Users className="w-4 h-4 mr-2" />
              About CommuteGo
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-br from-slate-900 via-cyan-700 to-blue-600 dark:from-white dark:via-cyan-200 dark:to-blue-200 bg-clip-text text-transparent">
              Transforming Urban Mobility
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              We're on a mission to make commuting stress-free, efficient, and enjoyable for millions of people worldwide.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-cyan-100 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-cyan-600 dark:text-cyan-400" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Meet Our Leadership</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The passionate team behind CommuteGo
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-lg transition-all">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expandable Sections */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Story & Values</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Learn more about what drives us
            </p>
          </motion.div>

          <div className="space-y-3">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                        <section.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{section.title}</span>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Separator />
                      <CardContent className="p-6">
                        <div className="prose dark:prose-invert max-w-none">
                          {section.content.split('\n').map((line, i) => {
                            if (line.trim() === '') return <br key={i} />;
                            if (line.startsWith('•')) {
                              const boldMatch = line.match(/^• \*\*(.*?)\*\*:?\s*(.*)$/);
                              if (boldMatch) {
                                return (
                                  <div key={i} className="flex items-start gap-2 mb-2">
                                    <span className="text-cyan-500 mt-1">•</span>
                                    <span>
                                      <strong className="text-slate-900 dark:text-white">{boldMatch[1]}</strong>
                                      <span className="text-slate-600 dark:text-slate-300">{boldMatch[2]}</span>
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div key={i} className="flex items-start gap-2 mb-2">
                                  <span className="text-cyan-500 mt-1">•</span>
                                  <span className="text-slate-600 dark:text-slate-300">{line.slice(2)}</span>
                                </div>
                              );
                            }
                            return (
                              <p key={i} className="text-slate-600 dark:text-slate-300 mb-2">
                                {line.split('**').map((part, idx) => 
                                  idx % 2 === 1 ? <strong key={idx} className="text-slate-900 dark:text-white">{part}</strong> : part
                                )}
                              </p>
                            );
                          })}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-linear-to-br from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-cyan-100 mb-8 max-w-2xl mx-auto">
              Have questions about CommuteGo? We'd love to hear from you. Our team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-5 h-5" />
                <span>hello@commutego.com</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5" />
                <span>www.commutego.com</span>
              </div>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white"
                required
              />
              <Button type="submit" variant="secondary" className="bg-white text-cyan-600 hover:bg-cyan-50">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;