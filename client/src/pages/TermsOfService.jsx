import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  User, 
  Globe, 
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Scale,
  Heart,
  Zap,
  CreditCard,
  Mail,
  Clock,
  RefreshCw,
  Ban,
  TrendingUp,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState('acceptance');
  const [email, setEmail] = useState('');

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: `By accessing and using CommuteGo ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using the Service, you shall be subject to any posted guidelines or rules applicable to such services.

• By creating an account, you confirm that you are at least 18 years old and have the legal capacity to enter into this agreement.

• If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these terms.

• Your continued use of the Service following any changes to these terms constitutes acceptance of those changes.`
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: Globe,
      content: `CommuteGo provides route planning, real-time commute tracking, and personalized travel recommendations. The Service includes:

• **Route Planning**: AI-powered route suggestions based on your preferences and real-time traffic data.

• **Real-Time Alerts**: Notifications about traffic, delays, and route changes that may affect your commute.

• **Analytics**: Insights into your commute patterns and suggestions for optimization.

• **Account Management**: Tools to manage your profile, preferences, and saved locations.

We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.`
    },
    {
      id: 'user-obligations',
      title: 'User Obligations',
      icon: User,
      content: `As a user of CommuteGo, you agree to:

• Provide accurate, current, and complete information during registration and when using the Service.

• Maintain the security and confidentiality of your account credentials.

• Not share your account with others or allow unauthorized access.

• Not use the Service for any unlawful purpose or in violation of these terms.

• Not attempt to gain unauthorized access to any part of the Service or its underlying systems.

• Not interfere with or disrupt the integrity or performance of the Service.

• Not collect or store personal data about other users without their consent.`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Shield,
      content: `The Service and all content, features, and functionality are owned by CommuteGo and are protected by copyright, trademark, and other intellectual property laws.

• **Our Content**: All materials on the Service, including logos, graphics, text, and software, are our property or licensed to us.

• **Your Content**: You retain ownership of any content you submit to the Service, but you grant us a license to use, modify, and display it.

• **Restrictions**: You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent.

• **Feedback**: Any suggestions, ideas, or feedback you provide about the Service becomes our property without compensation to you.`
    },
    {
      id: 'payment',
      title: 'Payment Terms',
      icon: CreditCard,
      content: `CommuteGo offers both free and premium subscription plans:

• **Free Tier**: Basic route planning and limited alerts. Some features may have usage restrictions.

• **Premium Plans**: Enhanced features including unlimited alerts, advanced analytics, and priority support.

• **Billing**: Premium subscriptions are billed monthly or annually in advance. Prices are displayed in your local currency.

• **Refunds**: You may cancel your subscription at any time. Refunds are processed according to our refund policy.

• **Price Changes**: We reserve the right to modify subscription prices with 30 days' notice before the next billing cycle.

• **Failed Payments**: If payment fails, we may suspend your premium features until payment is successfully processed.`
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer of Warranties',
      icon: AlertCircle,
      content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

• **Accuracy**: We do not guarantee that the Service will be accurate, reliable, or error-free.

• **Availability**: We do not guarantee that the Service will be available at all times or without interruption.

• **Fitness**: We do not warrant that the Service will meet your specific requirements or expectations.

• **Third-Party**: We are not responsible for the accuracy or reliability of any third-party services or content.

You use the Service at your own risk. Route suggestions and alerts are for informational purposes only and should not replace your own judgment and local knowledge.`
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      icon: Scale,
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMMUTEGO SHALL NOT BE LIABLE FOR:

• **Indirect Damages**: Any incidental, special, consequential, or punitive damages.

• **Lost Profits**: Loss of revenue, profits, data, or business opportunities.

• **Service Interruptions**: Damages arising from service interruptions, delays, or inaccuracies.

• **Third-Party Actions**: Actions or omissions of third parties.

• **User Conduct**: Damages arising from user content or conduct.

Our total liability shall not exceed the amount you paid for the premium subscription in the 12 months preceding the claim.

Some jurisdictions do not allow certain limitations, so the above may not apply to you.`
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: Ban,
      content: `Either party may terminate this agreement:

• **Your Termination**: You may cancel your account at any time through your account settings or by contacting support.

• **Our Termination**: We may suspend or terminate your account if you violate these terms or engage in conduct that harms us or other users.

• **Effect of Termination**: Upon termination, your right to use the Service ceases immediately. You may request deletion of your data.

• **Survival**: Provisions regarding intellectual property, disclaimer, limitation of liability, and dispute resolution shall survive termination.`
    },
    {
      id: 'disputes',
      title: 'Dispute Resolution',
      icon: MessageSquare,
      content: `Any disputes arising from these terms shall be resolved as follows:

• **Negotiation**: First, we encourage you to contact us directly to resolve any disputes informally.

• **Mediation**: If informal resolution fails, both parties agree to participate in mediation before a neutral third party.

• **Arbitration**: For disputes that cannot be resolved through mediation, binding arbitration may be used as an alternative to litigation.

• **Governing Law**: These terms are governed by the laws of the jurisdiction in which CommuteGo operates.

• **Class Action Waiver**: You agree to resolve disputes individually and not as part of a class action or representative proceeding.

Nothing in this section prevents either party from seeking injunctive relief in court for intellectual property violations.`
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: RefreshCw,
      content: `We may update these Terms of Service from time to time:

• **Notification**: We will notify you of material changes via email or through the Service before they take effect.

• **Acceptance**: Your continued use of the Service after changes become effective constitutes acceptance of the new terms.

• **Objection**: If you do not agree to the new terms, you may terminate your account within 30 days of the notice.

• **Previous Terms**: Previous versions of these terms remain in effect for the period you used the Service under those terms.

• **Effective Date**: The most recent effective date is displayed at the top of this page.

We encourage you to review these terms periodically to stay informed of any changes.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: `If you have any questions about these Terms of Service, please contact us:

• **Email**: legal@commutego.com

• **Mailing Address**: CommuteGo Legal Department, [Address]

• **Response Time**: We aim to respond to all inquiries within 5 business days.

For urgent legal matters, please indicate "URGENT" in the subject line.

We appreciate your feedback and are committed to resolving any concerns you may have about our terms or Service.`
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scale className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8">
              Please read these terms carefully before using CommuteGo. Your use of our Service constitutes agreement to these terms.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
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
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-blue-50'
                }`}
              >
                <section.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
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
                    ? 'ring-2 ring-blue-500 shadow-lg' 
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-600'
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
            <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                  <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    If you have any questions or concerns about our Terms of Service, please don't hesitate to reach out to our legal team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Legal Team
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-blue-700">
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

export default TermsOfService;