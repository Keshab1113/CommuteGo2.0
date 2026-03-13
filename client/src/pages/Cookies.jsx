import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  Eye, 
  Settings, 
  Globe,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail,
  Clock,
  RefreshCw,
  Database,
  Target,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Cookies = () => {
  const [expandedSection, setExpandedSection] = useState('what-are');
  const [email, setEmail] = useState('');

  const sections = [
    {
      id: 'what-are',
      title: 'What Are Cookies',
      icon: Cookie,
      content: `Cookies are small text files that are stored on your device when you visit a website. They help the website recognize your device and remember information about your visit, such as your preferred language and other settings.

• **Text Files**: Cookies are plain text files containing small amounts of data.

• **Storage**: They are stored in your browser's file directory or program data subfolder.

• **Purpose**: Cookies help make websites work more efficiently and provide information to website owners.

• **Duration**: Some cookies are deleted when you close your browser (session cookies), while others persist (persistent cookies).

Cookies cannot execute code, deliver viruses, or access your device's other files. They are passive and cannot actively harm your device.`
    },
    {
      id: 'types',
      title: 'Types of Cookies We Use',
      icon: Database,
      content: `We use several types of cookies to enhance your experience on CommuteGo:

• **Essential Cookies**: Required for the Service to function. They enable basic features like page navigation, secure areas access, and remembering your preferences. Disabling these may affect functionality.

• **Performance/Analytics Cookies**: Help us understand how visitors interact with our Service by collecting anonymous information about pages visited, time spent, and error messages encountered.

• **Functional Cookies**: Allow the Service to remember choices you make (like language, region, or login credentials) and provide enhanced, personalized features.

• **Targeting/Advertising Cookies**: Used to deliver relevant advertisements and track campaign performance. These may be set by our advertising partners.

• **Session Cookies**: Temporary cookies that exist only during your visit and are deleted when you close your browser.

• **Persistent Cookies**: Remain on your device for a set period or until you manually delete them.`
    },
    {
      id: 'how-we-use',
      title: 'How We Use Cookies',
      icon: Target,
      content: `We use cookies for various purposes to improve your experience:

• **Authentication**: To keep you logged in and remember your preferences across sessions.

• **Security**: To detect and prevent fraudulent activity and ensure secure access.

• **Performance**: To analyze how our Service performs and identify areas for improvement.

• **Personalization**: To remember your settings and customize content based on your preferences.

• **Analytics**: To understand user behavior and improve our features and functionality.

• **Advertising**: To deliver relevant ads and measure the effectiveness of our marketing campaigns.

• **Communication**: To distinguish between humans and bots, and to protect against spam.

The specific cookies used may vary based on your device and settings. We update our cookie practices periodically to improve our Service.`
    },
    {
      id: 'managing',
      title: 'Managing Cookies',
      icon: Settings,
      content: `You have the right to decide whether to accept or reject cookies:

• **Browser Settings**: Most web browsers allow you to control cookies through their settings. You can set your browser to notify you when cookies are being placed, or you can reject cookies entirely.

• **Opt-Out Links**: For specific third-party cookies, you can use industry opt-out platforms like the Digital Advertising Alliance or Network Advertising Initiative.

• **Essential Cookies**: These cannot be disabled as they are necessary for the Service to function.

• **Impact of Disabling**: If you disable cookies, some features of our Service may not function properly, and your user experience may be affected.

• **Updating Preferences**: You can change your cookie preferences at any time by clearing your browser cookies and adjusting your settings.

For detailed instructions on managing cookies in your specific browser, please refer to your browser's help documentation.`
    },
    {
      id: 'third-party',
      title: 'Third-Party Cookies',
      icon: Globe,
      content: `Some cookies are placed by third-party services that appear on our pages:

• **Analytics Providers**: We use tools like Google Analytics to understand how visitors use our Service. These providers may set cookies on your device.

• **Advertising Partners**: Our advertising partners may use cookies to deliver relevant ads and track ad performance.

• **Social Media**: Social media features may set cookies to track your activity and provide personalized content.

• **Embedded Content**: Content from third-party sites (like videos or maps) may set their own cookies.

• **Third-Party Services**: We use various third-party services for functionality like payment processing, which may set cookies.

We do not control these third-party cookies. The information collected by third-party cookies is subject to their own privacy policies.

We recommend reviewing the privacy policies of these third parties to understand how they use cookies.`
    },
    {
      id: 'specific-cookies',
      title: 'Specific Cookies We Use',
      icon: Eye,
      content: `Here are the specific cookies we use on CommuteGo:

• **Session Cookies**:
  - session_id: Maintains your login session (Duration: Session)
  - csrf_token: Protects against cross-site request forgery (Duration: Session)

• **Persistent Cookies**:
  - preferences: Stores your language and display preferences (Duration: 1 year)
  - analytics_consent: Records your cookie consent choice (Duration: 1 year)

• **Analytics Cookies**:
  - _ga: Google Analytics user identifier (Duration: 2 years)
  - _gid: Google Analytics session identifier (Duration: 24 hours)

• **Functional Cookies**:
  - saved_routes: Remembers your saved commute routes (Duration: 30 days)
  - recent_searches: Stores recent location searches (Duration: 90 days)

• **Advertising Cookies**:
  - ad_id: Tracks ad campaign performance (Duration: 90 days)
  - remarketing: Enables remarketing campaigns (Duration: 30 days)

This list may change as we update our Service. We recommend checking this page periodically for the most current information.`
    },
    {
      id: 'updates',
      title: 'Cookie Updates',
      icon: RefreshCw,
      content: `We may update this Cookie Policy periodically:

• **Notification**: We will notify you of material changes through the Service or via email.

• **Review**: We recommend reviewing this policy regularly to stay informed about our cookie practices.

• **Consent**: Continued use of the Service after changes constitutes your consent to the updated practices.

• **Withdrawal**: You can withdraw consent at any time by adjusting your browser settings or contacting us.

• **Previous Versions**: Previous versions of this policy remain in effect for the period they were active.

• **Effective Date**: The most recent effective date is displayed at the top of this page.

• **Questions**: If you have questions about our cookie practices, please contact us using the information below.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: `If you have any questions about our Cookie Policy, please contact us:

• **Email**: privacy@commutego.com

• **Mailing Address**: CommuteGo Privacy Team, [Address]

• **Response Time**: We aim to respond to all inquiries within 5 business days.

• **For Cookie Concerns**: For specific concerns about cookies or consent, please include "Cookie Inquiry" in the subject line.

• **Data Requests**: For data access or deletion requests related to cookies, please contact us at data@commutego.com.

We value your privacy and are committed to transparent cookie practices.`
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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cookie className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-xl text-amber-100 mb-8">
              Learn how CommuteGo uses cookies to enhance your experience and manage your privacy preferences.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last Updated: March 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Version 2.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {sections.slice(0, 4).map((section) => (
              <button
                key={section.id}
                onClick={() => setExpandedSection(section.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  expandedSection === section.id
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-amber-50'
                }`}
              >
                <section.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </motion.div>

          {/* Cookie Preferences Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Settings className="w-8 h-8 text-amber-600" />
                    <div>
                      <h3 className="font-semibold text-slate-800">Cookie Preferences</h3>
                      <p className="text-sm text-slate-600">Manage your cookie settings</p>
                    </div>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {sections.map((section) => (
              <motion.div key={section.id} variants={itemVariants}>
                <Card className={`overflow-hidden transition-all ${
                  expandedSection === section.id 
                    ? 'ring-2 ring-amber-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}>
                  <button
                    onClick={() => setExpandedSection(
                      expandedSection === section.id ? '' : section.id
                    )}
                    className="w-full"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 py-4 cursor-pointer">
                      <div className={`p-2 rounded-lg ${
                        expandedSection === section.id
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                      {expandedSection === section.id ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </CardHeader>
                  </button>
                  
                  <AnimatePresence>
                    {expandedSection === section.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <div className="pl-14">
                          <div className="prose prose-slate max-w-none">
                            {section.content.split('\n').map((line, i) => {
                              if (line.trim() === '') return null;
                              if (line.startsWith('•')) {
                                const bulletContent = line.replace('• ', '');
                                if (bulletContent.includes('**')) {
                                  const parts = bulletContent.split(/\*\*(.*?)\*\*/g);
                                  return (
                                    <div key={i} className="flex items-start gap-2 mb-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                      <span className="text-slate-600 text-sm">
                                        {parts.map((part, idx) => 
                                          idx % 2 === 1 ? <strong key={idx} className="text-slate-800">{part}</strong> : part
                                        )}
                                      </span>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={i} className="flex items-start gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-slate-600 text-sm">{bulletContent}</span>
                                  </div>
                                );
                              }
                              if (line.includes('**')) {
                                const parts = line.split(/\*\*(.*?)\*\*/g);
                                return (
                                  <p key={i} className="text-slate-600 text-sm mb-2">
                                    {parts.map((part, idx) => 
                                      idx % 2 === 1 ? <strong key={idx} className="text-slate-800">{part}</strong> : part
                                    )}
                                  </p>
                                );
                              }
                              return (
                                <p key={i} className="text-slate-600 text-sm mb-2">
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mt-12 bg-gradient-to-r from-amber-600 to-orange-700 text-white border-0">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <Info className="w-12 h-12 mx-auto mb-4 text-amber-200" />
                  <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
                  <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                    If you have any questions or concerns about our Cookie Policy, please reach out to our privacy team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-white text-amber-600 hover:bg-amber-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Privacy Team
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-amber-700">
                      View Privacy Policy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';

export default Cookies;