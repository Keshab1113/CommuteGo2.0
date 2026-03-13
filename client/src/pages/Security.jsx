import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  User, 
  Key,
  FileText,
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
  Bell,
  Smartphone,
  Wifi,
  CreditCard,
  Fingerprint,
  Activity,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Security = () => {
  const [expandedSection, setExpandedSection] = useState('data-protection');
  const [email, setEmail] = useState('');

  const sections = [
    {
      id: 'data-protection',
      title: 'Data Protection',
      icon: Shield,
      content: `We take the protection of your personal data seriously and implement comprehensive measures to safeguard your information:

• **Data Minimization**: We collect only the data necessary for providing our services and improve your experience.

• **Purpose Limitation**: Your data is used only for the purposes for which it was collected, as outlined in our Privacy Policy.

• **Accuracy**: We maintain procedures to keep your personal data accurate and up-to-date.

• **Storage Limitation**: We retain your data only for as long as necessary to fulfill the purposes for which we collected it.

• **Integrity and Confidentiality**: We implement appropriate technical and organizational measures to ensure data security.

• **Accountability**: We maintain records of our data processing activities and are accountable for compliance with these principles.

Your trust is important to us, and we are committed to protecting your personal data at all times.`
    },
    {
      id: 'encryption',
      title: 'Encryption',
      icon: Lock,
      content: `We use industry-standard encryption to protect your data during transmission and storage:

• **TLS/SSL Encryption**: All data transmitted between your device and our servers is encrypted using TLS 1.3 protocol.

• **Data at Rest**: Sensitive data stored in our databases is encrypted using AES-256 encryption.

• **Password Hashing**: User passwords are hashed using bcrypt with appropriate salt rounds.

• **API Security**: All API communications require HTTPS and use JWT tokens for authentication.

• **End-to-End Encryption**: Sensitive commute data is encrypted end-to-end where applicable.

• **Key Management**: Encryption keys are managed using secure key management systems with regular rotation.

• **Certificate Management**: SSL certificates are regularly updated and monitored for validity.

We continuously monitor and update our encryption practices to maintain the highest security standards.`
    },
    {
      id: 'access-controls',
      title: 'Access Controls',
      icon: Key,
      content: `We implement strict access controls to ensure only authorized personnel can access your data:

• **Role-Based Access**: Access to data is granted based on job responsibilities and the principle of least privilege.

• **Multi-Factor Authentication**: All employee accounts require MFA for access to internal systems.

• **Audit Logging**: All access to sensitive systems is logged and monitored for suspicious activity.

• **Session Management**: User sessions are managed with secure tokens and automatic timeout after inactivity.

• **IP Restrictions**: Access to administrative systems is restricted to approved IP addresses.

• **Privileged Access**: Elevated access requires additional approval and is time-limited.

• **Access Reviews**: Regular access reviews are conducted to ensure appropriate access levels.

These controls help prevent unauthorized access and ensure your data remains protected.`
    },
    {
      id: 'security-measures',
      title: 'Security Measures',
      icon: Server,
      content: `We employ multiple layers of security to protect our infrastructure and your data:

• **Network Security**: Firewalls, intrusion detection systems, and DDoS protection are in place.

• **Web Application Firewall**: Protection against common web attacks including SQL injection and XSS.

• **Malware Protection**: Regular scanning and monitoring for malware on all systems.

• **Patch Management**: Systems are regularly updated with the latest security patches.

• **Backup and Recovery**: Regular backups with tested recovery procedures ensure data availability.

• **Physical Security**: Data centers have 24/7 security, biometric access, and environmental controls.

• **Redundancy**: Critical systems have redundant backups to ensure high availability.

• **Incident Response**: Documented procedures for responding to security incidents.

Our security team continuously monitors for threats and implements improvements as needed.`
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Database,
      content: `We retain your data only for as long as necessary for the purposes outlined in this policy:

• **Account Data**: Retained while your account is active and for 30 days after account deletion.

• **Commute History**: Retained for 2 years from the date of each commute, unless you request deletion.

• **Analytics Data**: Aggregated and anonymized data may be retained indefinitely for improvement purposes.

• **Logs**: System logs are retained for 90 days for security and debugging purposes.

• **Marketing Data**: Retained until you withdraw consent or request deletion.

• **Legal Requirements**: Some data may be retained longer if required by law or for legal proceedings.

• **Deletion Procedures**: When data is deleted, we use secure methods to ensure it cannot be recovered.

• **Data Portability**: You can request a copy of your data at any time before deletion.

You can request deletion of your data at any time through your account settings or by contacting us.`
    },
    {
      id: 'incident-response',
      title: 'Incident Response',
      icon: AlertTriangle,
      content: `We have comprehensive procedures in place to handle security incidents:

• **Detection**: Automated systems monitor for suspicious activity and potential breaches.

• **Reporting**: Security incidents are reported to our security team immediately upon detection.

• **Containment**: Immediate steps are taken to contain any breach and prevent further damage.

• **Investigation**: Thorough investigations are conducted to determine the cause and scope of incidents.

• **Notification**: Affected users are notified within 72 hours as required by GDPR and other regulations.

• **Remediation**: Steps are taken to fix vulnerabilities and prevent future incidents.

• **Documentation**: All incidents are documented with lessons learned and improvements implemented.

• **Regulatory Cooperation**: We work with relevant authorities and comply with legal requirements.

We take security incidents seriously and are committed to transparent communication with our users.`
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: User,
      content: `While we implement strong security measures, you also play a crucial role in protecting your account:

• **Strong Passwords**: Use a strong, unique password for your CommuteGo account.

• **MFA**: Enable two-factor authentication for an extra layer of security.

• **Phishing Awareness**: Be cautious of emails asking for your credentials or personal information.

• **Device Security**: Keep your devices secure with up-to-date software and antivirus protection.

• **Public WiFi**: Avoid accessing your account on public WiFi networks when possible.

• **Suspicious Activity**: Report any suspicious activity or unauthorized access immediately.

• **Account Sharing**: Do not share your account credentials with others.

• **Logout**: Always log out when using shared devices.

By following these best practices, you help keep your account and data secure.`
    },
    {
      id: 'compliance',
      title: 'Compliance & Certifications',
      icon: FileText,
      content: `We maintain compliance with various security standards and regulations:

• **GDPR**: Compliant with the General Data Protection Regulation for EU users.

• **CCPA**: Compliant with the California Consumer Privacy Act.

• **SOC 2 Type II**: Our infrastructure maintains SOC 2 Type II certification.

• **ISO 27001**: Information security management system certified to ISO 27001 standard.

• **PCI DSS**: Payment processing is compliant with PCI DSS requirements.

• **HIPAA**: Appropriate safeguards in place for any health-related data.

• **Privacy Shield**: Compliant with the EU-US Privacy Shield framework.

• **Regular Audits**: Our security practices are regularly audited by third-party security firms.

We continuously review and update our compliance to ensure we meet or exceed industry standards.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: `If you have any questions about our Security practices, please contact us:

• **Email**: security@commutego.com

• **Mailing Address**: CommuteGo Security Team, [Address]

• **Response Time**: We aim to respond to security inquiries within 24 hours.

• **For Security Issues**: For urgent security concerns, please include "URGENT" in the subject line.

• **Bug Bounty**: We appreciate responsible disclosure of security vulnerabilities.

• **Data Requests**: For data access or deletion requests, please contact privacy@commutego.com.

We value your security and are committed to maintaining the highest standards of data protection.`
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
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Security</h1>
            </div>
            <p className="text-xl text-slate-200 mb-8">
              Learn how CommuteGo protects your data and maintains the highest security standards.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last Updated: March 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Security Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <Lock className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <span className="text-sm font-medium text-slate-600">TLS 1.3</span>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <Fingerprint className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">MFA Enabled</span>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">24/7 Monitoring</span>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <Shield className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <span className="text-sm font-medium text-slate-600">GDPR Compliant</span>
            </div>
          </motion.div>

          {/* Security Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-slate-100 to-blue-100 border-slate-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-slate-600" />
                    <div>
                      <h3 className="font-semibold text-slate-800">Your Security is Our Priority</h3>
                      <p className="text-sm text-slate-600">We use industry-leading security measures to protect your data</p>
                    </div>
                  </div>
                  <Button className="bg-slate-700 hover:bg-slate-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report Security Issue
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
                    ? 'ring-2 ring-slate-500 shadow-lg' 
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
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-100 text-slate-600'
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
            <Card className="mt-12 bg-gradient-to-r from-slate-700 to-slate-900 text-white border-0">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <h2 className="text-2xl font-bold mb-4">Questions About Security?</h2>
                  <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                    If you have any questions or concerns about our security practices, please reach out to our security team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-white text-slate-700 hover:bg-slate-100">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Security Team
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-slate-700">
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

export default Security;