import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone,
  BookOpen,
  Video,
  FileText,
  Zap,
  Clock,
  Shield,
  MapPin,
  Bell,
  Users,
  ArrowRight,
  ExternalLink,
  Twitter,
  MessageSquare,
  Github
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      title: 'Getting Started',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      faqs: [
        {
          question: 'How do I create my first commute route?',
          answer: 'Creating your first route is easy! Simply enter your starting point and destination in the search bar on the home page. You can add multiple stops, choose your preferred transport modes, and save the route for future use. Our AI will also suggest optimal routes based on your preferences and real-time traffic data.'
        },
        {
          question: 'What transport modes are supported?',
          answer: 'CommuteGo supports multiple transport modes including driving, public transit (bus, train, subway), walking, cycling, and ride-sharing. You can also enable multi-modal routes that combine different transport modes for the most efficient journey.'
        },
        {
          question: 'Is CommuteGo available in my city?',
          answer: 'CommuteGo is available in major cities worldwide. We continuously expand our coverage to include more locations. You can check if your city is supported by entering a route in the app. If it\'s not available yet, you can join our waitlist to be notified when we launch in your area.'
        },
        {
          question: 'How accurate is the traffic data?',
          answer: 'We use real-time traffic data from multiple sources including GPS data from millions of users, traffic cameras, and government transportation APIs. Our predictions are updated every few minutes to ensure accuracy. Historical data also helps us predict traffic patterns for scheduled trips.'
        }
      ]
    },
    {
      title: 'Account & Billing',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'To reset your password, click "Forgot Password" on the login page and enter your email address. You\'ll receive a link to create a new password. The link expires after 24 hours for security. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          question: 'Can I change my subscription plan?',
          answer: 'Yes! You can upgrade or downgrade your plan at any time from the Settings page. Upgrades take effect immediately, while downgrades apply at the end of your current billing cycle. Your data is preserved regardless of plan changes.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription anytime from Account Settings > Subscription > Cancel Plan. Your access continues until the end of your billing period. We\'d love to know why you\'re leaving - your feedback helps us improve!'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. Enterprise customers can also pay via bank transfer or invoice. All payments are processed securely through Stripe.'
        }
      ]
    },
    {
      title: 'Features & Usage',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      faqs: [
        {
          question: 'How does AI route optimization work?',
          answer: 'Our AI analyzes thousands of factors including real-time traffic, historical patterns, weather conditions, your preferences, and even local events to suggest the optimal route. The more you use CommuteGo, the better it learns your preferences and habits.'
        },
        {
          question: 'Can I share my route with others?',
          answer: 'Absolutely! You can share any route via a unique link, QR code, or directly to messaging apps. Recipients can view the route without needing a CommuteGo account. You can also collaborate on routes with family or colleagues.'
        },
        {
          question: 'Does CommuteGo work offline?',
          answer: 'Yes! Saved routes are available offline. You can download maps for offline use in the app settings. Note that real-time traffic updates require an internet connection, but turn-by-turn directions will still work offline using cached data.'
        },
        {
          question: 'How do notifications work?',
          answer: 'You can set up notifications for various events: departure reminders, traffic delays, route changes, price drops on gas, and more. Customize your notification preferences in Settings > Notifications. Push notifications require the app to be installed.'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      color: 'from-violet-500 to-purple-500',
      faqs: [
        {
          question: 'How is my data protected?',
          answer: 'We use bank-level encryption (AES-256) for all data storage and TLS 1.3 for data in transit. Your location data is anonymized and aggregated for analytics. We never sell your personal data to third parties. You can request a complete data export or deletion at any time.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can delete your account and all associated data from Settings > Privacy > Delete Account. This action is irreversible - all your routes, history, and preferences will be permanently removed within 30 days. You can cancel this deletion within that period.'
        },
        {
          question: 'Who can see my location?',
          answer: 'Your real-time location is only shared with people you explicitly choose to share with. By default, your location is private. You can enable location sharing for specific contacts or share your ETA during an active trip. All location sharing is opt-in.'
        },
        {
          question: 'Is my commute data anonymous?',
          answer: 'Yes! We aggregate and anonymize all commute data used for improvements and analytics. Individual trip data is never shared. You can opt out of contributing anonymized data in your privacy settings.'
        }
      ]
    },
    {
      title: 'Troubleshooting',
      icon: Zap,
      color: 'from-red-500 to-rose-500',
      faqs: [
        {
          question: 'Why is my location not accurate?',
          answer: 'Location accuracy depends on your device\'s GPS and network. Ensure location services are enabled for CommuteGo in your device settings. For better accuracy, enable high-accuracy mode in your phone\'s location settings. Indoor locations may have reduced accuracy.'
        },
        {
          question: 'The app is running slowly. What should I do?',
          answer: 'Try these steps: 1) Close and reopen the app, 2) Check your internet connection, 3) Clear the app cache in settings, 4) Ensure you have the latest version, 5) Restart your device. If issues persist, contact support with details about your device and OS version.'
        },
        {
          question: 'I\'m not receiving notifications. How do I fix this?',
          answer: 'Check the following: 1) Notifications are enabled in app settings, 2) Your device\'s notification settings allow CommuteGo, 3) You\'re signed in to your account, 4) Do Not Disturb isn\'t active. On iOS, also check notification grouping settings.'
        },
        {
          question: 'My route isn\'t showing the expected results',
          answer: 'This could be due to: 1) Invalid addresses (try adding more details), 2) No transit options available for that route, 3) Temporary service disruptions. Try adjusting your transport mode preferences or contact support if the issue persists.'
        }
      ]
    }
  ];

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? -1 : index);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-br from-slate-900 via-blue-700 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              How Can We Help?
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Find answers to common questions about CommuteGo. Can't find what you're looking for? Contact our support team.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'Documentation', color: 'from-green-500 to-emerald-500' },
              { icon: Video, label: 'Video Tutorials', color: 'from-red-500 to-rose-500' },
              { icon: MessageSquare, label: 'Community Forum', color: 'from-blue-500 to-cyan-500' },
              { icon: Mail, label: 'Email Support', color: 'from-purple-500 to-violet-500' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => toggleCategory(catIndex)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{category.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{category.faqs.length} questions</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openCategory === catIndex ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {openCategory === catIndex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Separator />
                      <div className="p-6 pt-0 space-y-4">
                        {category.faqs.map((faq, faqIndex) => (
                          <div key={faqIndex} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleFaq(catIndex + '-' + faqIndex)}
                              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                              <span className="font-medium text-slate-900 dark:text-white pr-4">{faq.question}</span>
                              {openFaq === catIndex + '-' + faqIndex ? (
                                <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                              )}
                            </button>
                            <AnimatePresence>
                              {openFaq === catIndex + '-' + faqIndex && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-4 pb-4">
                                    <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-linear-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;