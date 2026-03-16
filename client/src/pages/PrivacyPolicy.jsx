import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  User, 
  Mail, 
  Database, 
  Cookie, 
  Globe, 
  ChevronDown,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Bell,
  Smartphone,
  CreditCard,
  Share2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState('information-collect');
  const [email, setEmail] = useState('');

  const sections = [
    {
      id: 'information-collect',
      title: 'Information We Collect',
      icon: Database,
      content: `We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:

• **Account Information**: When you register, we collect your name, email address, phone number, and password.

• **Profile Data**: Your commute preferences, saved locations, and travel history help us personalize your experience.

• **Location Data**: We collect location data to provide accurate route planning and real-time commute updates.

• **Device Information**: We collect device type, operating system, browser type, and unique device identifiers.

• **Usage Data**: Information about how you interact with our services, including features used and time spent.`
    },
    {
      id: 'how-use',
      title: 'How We Use Your Information',
      icon: User,
      content: `We use the information we collect to:

• **Provide Services**: Deliver route planning, real-time alerts, and personalized commute recommendations.

• **Improve Services**: Analyze usage patterns to enhance our algorithms and user experience.

• **Communicate**: Send you important updates, notifications, and respond to your inquiries.

• **Security**: Detect, prevent, and address fraud, unauthorized access, and other prohibited activities.

• **Legal Compliance**: Comply with applicable laws, regulations, and legal processes.`,
    },
    {
      id: 'information-share',
      title: 'Information Sharing',
      icon: Share2,
      content: `We may share your information with:

• **Service Providers**: Third-party vendors who help us operate, analyze, and improve our services.

• **Business Transfers**: In connection with mergers, acquisitions, or sale of assets, your information may be transferred.

• **Legal Requirements**: When required by law, court order, or governmental regulation.

• **Protection of Rights**: To enforce our terms, protect our users, or investigate potential violations.

We never sell your personal information to third parties for marketing purposes.`
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      icon: Cookie,
      content: `We use cookies and similar tracking technologies to:

• **Essential Cookies**: Required for basic site functionality and security.

• **Analytics Cookies**: Help us understand how visitors use our website.

• **Preference Cookies**: Remember your settings and preferences.

• **Marketing Cookies**: Used to deliver relevant advertisements (with your consent).

You can control cookies through your browser settings. Note that disabling essential cookies may affect functionality.`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: `We implement appropriate security measures to protect your information:

• **Encryption**: Data is encrypted in transit using TLS/SSL protocols.

• **Access Controls**: Strict access controls limit employee access to personal data.

• **Regular Audits**: We conduct security assessments and vulnerability scans.

• **Incident Response**: We have procedures to address potential data breaches.

While we strive to protect your data, no method of transmission over the Internet is 100% secure.`
    },
    {
      id: 'user-rights',
      title: 'Your Rights',
      icon: Shield,
      content: `You have the following rights regarding your personal data:

• **Access**: Request a copy of the personal data we hold about you.

• **Correction**: Request correction of inaccurate personal data.

• **Deletion**: Request deletion of your personal data ("right to be forgotten").

• **Data Portability**: Request your data in a structured, machine-readable format.

• **Opt-Out**: Unsubscribe from marketing communications at any time.

To exercise these rights, contact us at privacy@commutego.com`
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Database,
      content: `We retain your personal data only as long as necessary:

• **Account Data**: Retained while your account is active and for 30 days after deletion.

• **Location Data**: Retained for up to 12 months for service improvement.

• **Log Data**: Automatically deleted after 90 days.

• **Legal Holds**: Data may be retained longer when required by law.`
    },
    {
      id: 'third-party',
      title: 'Third-Party Services',
      icon: Globe,
      content: `Our services may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to review the privacy policies of those third parties.

Third-party service providers we use include:
• Cloud hosting and infrastructure providers
• Analytics and measurement services
• Payment processors (for premium features)
• Map and navigation service providers`
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      icon: User,
      content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

If you believe we have collected information from a child under 13, please contact us immediately at privacy@commutego.com. We will take steps to delete such information.`
    },
    {
      id: 'changes-policy',
      title: 'Changes to This Policy',
      icon: RefreshCw,
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:

• Posting the new policy on this page
• Sending an email notification
• Displaying a prominent notice in our app

The "Last Updated" date at the top of this policy indicates when changes were made. Your continued use of our services after changes constitutes acceptance of the updated policy.`
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      icon: Mail,
      content: `If you have any questions about this Privacy Policy, please contact us:

• **Email**: privacy@commutego.com
• **Address**: 123 Commute Street, Tech City, TC 12345
• **Phone**: +1 (555) 123-4567
• **Response Time**: We aim to respond within 48 hours

For urgent matters, please include "URGENT" in your email subject line.`
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your interest! We'll contact you at ${email} if we have any questions about your privacy concerns.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white/90 text-sm font-medium">Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Privacy Matters
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              We are committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white text-sm font-medium">Data Encryption</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white text-sm font-medium">No Data Selling</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white text-sm font-medium">GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      {/* Last Updated Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">March 13, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Version</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">2.0.0</p>
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Transparency</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  We clearly explain what data we collect and how we use it. No hidden clauses or surprise data sharing.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Security First</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Your data is protected with industry-standard encryption and security measures.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Your Control</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  You have full control over your data. Access, modify, or delete your information anytime.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Privacy Sections */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                    expandedSection === section.id ? 'bg-slate-50 dark:bg-slate-700/50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        expandedSection === section.id 
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <span className={`font-semibold ${
                        expandedSection === section.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-white'
                      }`}>
                        {section.title}
                      </span>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                  
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
                                    <span className="text-slate-600 dark:text-slate-300 text-sm">
                                      {parts.map((part, idx) => 
                                        idx % 2 === 1 ? <strong key={idx} className="text-slate-800 dark:text-white">{part}</strong> : part
                                      )}
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div key={i} className="flex items-start gap-2 mb-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                  <span className="text-slate-600 dark:text-slate-300 text-sm">{bulletContent}</span>
                                </div>
                              );
                            }
                            if (line.includes('**')) {
                              const parts = line.split(/\*\*(.*?)\*\*/g);
                              return (
                                <p key={i} className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                  {parts.map((part, idx) => 
                                    idx % 2 === 1 ? <strong key={idx} className="text-slate-800 dark:text-white">{part}</strong> : part
                                  )}
                                </p>
                              );
                            }
                            return (
                              <p key={i} className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 to-purple-600 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Have Questions About Privacy?
                  </h2>
                  <p className="text-white/80 mb-6">
                    We're here to help. Reach out to our privacy team for any concerns or questions about how we handle your data.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/90">
                      <Mail className="w-5 h-5" />
                      <span>privacy@commutego.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Phone className="w-5 h-5" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <MapPin className="w-5 h-5" />
                      <span>123 Commute Street, Tech City</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Send us a message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-indigo-600 hover:bg-white/90 font-semibold"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            By using CommuteGo, you agree to our Privacy Policy. If you do not agree, please do not use our services.
          </p>
        </div>
      </div>
    </div>
  );
};

import { Download } from 'lucide-react';

export default PrivacyPolicy;