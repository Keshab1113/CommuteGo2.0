// frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Users,
  Sparkles,
  Heart,
  ArrowUpRight,
  Shield,
  Zap,
  Leaf,
  Clock,
  MapPin,
  Phone,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "✨ Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail('');
  };

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Roadmap', href: '/roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers', badge: 'Hiring' },
        { label: 'Press Kit', href: '/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'API Reference', href: '#api' },
        { label: 'Community', href: '/community' },
        { label: 'Support Center', href: '/support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Security', href: '/security' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-white' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: Mail, href: 'mailto:hello@commutego.com', label: 'Email', color: 'hover:text-red-400' },
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

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 bg-gray-50 text-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-br from-transparent via-cyan-500/50 to-transparent" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main footer content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16 bg-gray-50 dark:bg-transparent rounded-2xl p-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand column */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center  transition-all duration-300">
                  <img src="/logo.png" alt="" />
                </div>
              <div>
                <span className="text-2xl font-bold bg-linear-to-br from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CommuteGo
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI-Powered Commuting</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              Transform your daily commute with intelligent AI agents that optimize routes, 
              save money, and reduce your carbon footprint. Join thousands of smart commuters 
              making better choices every day.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400" />
                <a href="mailto:hello@commutego.com" className="hover:text-cyan-400 transition-colors">
                  hello@commutego.com
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 bg-gray-200/60 dark:bg-slate-800/60 hover:bg-gray-300/80 dark:hover:bg-slate-700/80 border border-gray-300 dark:border-slate-700/50 hover:border-cyan-500/30 rounded-xl flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <Icon className={`w-5 h-5 text-slate-400 ${social.color} transition-colors`} />
                  </motion.a>
                );
              })}
            </div>

            {/* Newsletter */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                Stay updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-linear-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-slate-500">
                Join 10,000+ subscribers. No spam, ever.
              </p>
            </div>
          </motion.div>

          {/* Link columns */}
          {footerSections.map((section, idx) => (
            <motion.div variants={itemVariants} key={idx} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={linkIdx}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-slate-400 hover:text-cyan-400 transition-all duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 bg-slate-600 group-hover:bg-cyan-500 rounded-full transition-colors" />
                      {link.label}
                      {link.badge && (
                        <span className="ml-2 px-2 py-0.5 bg-cyan-500/15 text-cyan-400 text-[10px] font-medium rounded-full">
                          {link.badge}
                        </span>
                      )}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-400" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8 border-y border-gray-200 dark:border-slate-800/60 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Active Users', value: '10,000+', color: 'text-cyan-400' },
              { icon: Zap, label: 'Routes Optimized', value: '250K+', color: 'text-yellow-400' },
              { icon: Leaf, label: 'CO₂ Saved', value: '125 tons', color: 'text-green-400' },
              { icon: Clock, label: 'Hours Saved', value: '50K+', color: 'text-purple-400' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-slate-800/50 rounded-xl mb-3 group-hover:bg-gray-200 dark:group-hover:bg-slate-700/50 transition-colors">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2"
        >
          <div className="text-sm text-gray-500 dark:text-slate-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} CommuteGo. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> 
              <span className="text-slate-400">by the CommuteGo team</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a href="/privacy" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
              Cookie Policy
            </a>
            <a href="/security" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
              Security
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-800/30 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span>Enterprise-grade security</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;