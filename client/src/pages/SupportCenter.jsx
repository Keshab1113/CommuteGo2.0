import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  CreditCard,
  User,
  MapPin,
  Bell,
  Settings,
  ArrowRight,
  Send,
  Headphones,
  MessageSquare,
  Video,
  FileQuestion,
  Wrench,
  Lightbulb
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';

const SupportCenter = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "🔍 Search Initiated",
        description: `Searching for: "${searchQuery}"`,
      });
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    toast({
      title: "🎫 Ticket Submitted",
      description: "Our support team will get back to you within 24 hours.",
    });
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
  };

  const helpCategories = [
    {
      icon: MapPin,
      title: 'Getting Started',
      description: 'Learn the basics of CommuteGo',
      articles: 12,
      color: 'from-cyan-500 to-blue-500',
      links: [
        { title: 'How to create your first commute plan', href: '#' },
        { title: 'Understanding route options', href: '#' },
        { title: 'Setting up your preferences', href: '#' },
        { title: 'Connecting your accounts', href: '#' },
      ]
    },
    {
      icon: Zap,
      title: 'Account & Billing',
      description: 'Manage your account and payments',
      articles: 8,
      color: 'from-purple-500 to-pink-500',
      links: [
        { title: 'Updating your profile', href: '#' },
        { title: 'Changing your subscription', href: '#' },
        { title: 'Payment methods', href: '#' },
        { title: 'Invoice history', href: '#' },
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure alerts and updates',
      articles: 6,
      color: 'from-orange-500 to-red-500',
      links: [
        { title: 'Setting up commute alerts', href: '#' },
        { title: 'Email notification preferences', href: '#' },
        { title: 'Push notifications', href: '#' },
        { title: 'Alert frequency settings', href: '#' },
      ]
    },
    {
      icon: Settings,
      title: 'Technical Support',
      description: 'Troubleshoot issues',
      articles: 15,
      color: 'from-green-500 to-teal-500',
      links: [
        { title: 'App not loading', href: '#' },
        { title: 'GPS location issues', href: '#' },
        { title: 'Sync problems', href: '#' },
        { title: 'Browser compatibility', href: '#' },
      ]
    },
  ];

  const popularArticles = [
    { title: 'How to optimize your commute for cost', views: 12500, category: 'Getting Started' },
    { title: 'Understanding the AI route suggestions', views: 10200, category: 'Getting Started' },
    { title: 'Setting up multi-modal routes', views: 8900, category: 'Features' },
    { title: 'How to use the mobile app offline', views: 7600, category: 'Mobile' },
    { title: 'Integrating with calendar apps', views: 6400, category: 'Integrations' },
  ];

  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a reset link. The link expires in 24 hours for security purposes.',
    },
    {
      question: 'Can I use CommuteGo for free?',
      answer: 'Yes! CommuteGo offers a free tier with basic features. You can plan up to 5 commutes per month, save 2 favorite routes, and receive basic alerts. Upgrade to Pro for unlimited access.',
    },
    {
      question: 'How accurate are the arrival time predictions?',
      answer: 'Our AI predictions have a 94% accuracy rate for arrival times. We factor in real-time traffic data, historical patterns, and current conditions to provide the most accurate estimates possible.',
    },
    {
      question: 'What transportation modes are supported?',
      answer: 'CommuteGo supports driving, walking, cycling, public transit (bus, train, subway), ride-sharing, and combinations of these modes. We also support electric vehicles and bikes.',
    },
    {
      question: 'How do I report a bug or issue?',
      answer: 'You can report bugs through our support ticket system, by emailing support@commutego.com, or through the in-app feedback feature. We typically respond within 24 hours.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption for all data, never sell your personal information, and are SOC 2 Type II certified. Your commute data is stored securely and you can delete it at any time.',
    },
  ];

  const troubleshootingGuides = [
    {
      icon: AlertCircle,
      title: 'App Not Loading',
      steps: ['Clear browser cache', 'Check internet connection', 'Disable extensions', 'Try incognito mode'],
      severity: 'high'
    },
    {
      icon: MapPin,
      title: 'Location Not Accurate',
      steps: ['Enable location services', 'Check GPS settings', 'Update the app', 'Re-calibrate location'],
      severity: 'medium'
    },
    {
      icon: Bell,
      title: 'Not Receiving Alerts',
      steps: ['Check notification settings', 'Verify email', 'Add to safe senders', 'Check spam folder'],
      severity: 'medium'
    },
    {
      icon: CreditCard,
      title: 'Payment Issues',
      steps: ['Verify card details', 'Check bank restrictions', 'Try alternative payment', 'Contact support'],
      severity: 'high'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4">
                <Headphones className="w-4 h-4" />
                <span>24/7 Support Available</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              How can we{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                help you?
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto"
            >
              Search our knowledge base, browse help articles, or submit a support ticket. 
              We're here to help you get the most out of CommuteGo.
            </motion.p>

            <motion.form 
              variants={itemVariants}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search for help articles, guides, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-6 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                >
                  Search
                </Button>
              </div>
            </motion.form>

            {/* Quick stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto"
            >
              {[
                { value: '50K+', label: 'Help Articles' },
                { value: '< 1hr', label: 'Avg Response' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="container mx-auto px-4 py-16 -mt-8 relative z-20">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.links.slice(0, 3).map((link, linkIndex) => (
                        <a 
                          key={linkIndex}
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          {link.title}
                        </a>
                      ))}
                      <a href="#" className="flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-400 font-medium">
                        View all {category.articles} articles
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Popular Articles & Troubleshooting */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Articles */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-500" />
                  Popular Articles
                </CardTitle>
                <CardDescription>Most viewed help articles this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularArticles.map((article, index) => (
                  <a 
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{article.category}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                      <Search className="w-3 h-3" />
                      {article.views.toLocaleString()}
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Troubleshooting Guides */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  Quick Troubleshooting
                </CardTitle>
                <CardDescription>Common issues and quick fixes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {troubleshootingGuides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          guide.severity === 'high' 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{guide.title}</h4>
                            <Badge variant={guide.severity === 'high' ? 'destructive' : 'secondary'}>
                              {guide.severity}
                            </Badge>
                          </div>
                          <ol className="space-y-1">
                            {guide.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs">
                                  {stepIndex + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find answers to common questions about CommuteGo
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((faq, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-gray-600 dark:text-slate-400">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Contact Options */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Still Need Help?
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Can't find what you're looking for? Reach out to our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-cyan-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                  Chat with our support team in real-time
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                  Get a response within 24 hours
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                  Available Mon-Fri, 9am-6pm PST
                </p>
                <Button variant="outline" className="w-full">
                  Call Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Submit Ticket Form */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-cyan-500" />
                Submit a Support Ticket
              </CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Subject
                    </label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="account">Account & Billing</option>
                      <option value="technical">Technical Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Priority
                  </label>
                  <div className="flex gap-4">
                    {['low', 'medium', 'high'].map((priority) => (
                      <label key={priority} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={ticketForm.priority === priority}
                          onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                          className="w-4 h-4 text-cyan-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-slate-300 capitalize">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Please describe your issue in detail..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Our support team is here to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-white text-cyan-600 hover:bg-gray-100"
              >
                <Link to="/contact">
                  Contact Support
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/community">
                  Join Community
                  <MessageSquare className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportCenter;