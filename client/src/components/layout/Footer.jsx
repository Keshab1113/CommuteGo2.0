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
  Clock
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
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Roadmap', href: '#roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers', badge: 'Hiring' },
        { label: 'Press', href: '#press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API Reference', href: '#api' },
        { label: 'Community', href: '#community' },
        { label: 'Support', href: '#support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Security', href: '#security' },
        { label: 'Cookies', href: '#cookies' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@commutego.com', label: 'Email' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl blur opacity-30"
                />
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  CommuteGo
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Sparkles className="w-3 h-3" />
                  <span>AI-Powered Commute Optimization</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your daily commute with intelligent AI agents that optimize routes, 
              save money, and reduce your carbon footprint. Join thousands of smart commuters 
              making better choices every day.
            </p>

            {/* Social links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                );
              })}
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                Stay updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary-500"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white border-0"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-gray-500">
                Join 10,000+ subscribers. No spam, ever.
              </p>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-semibold mb-4 text-gray-300">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={linkIdx}
                    whileHover={{ x: 4 }}
                  >
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-primary-500/20 text-primary-400 text-[10px] rounded-full">
                          {link.badge}
                        </span>
                      )}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="py-8 border-y border-gray-800 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Active Users', value: '10,000+' },
              { icon: Zap, label: 'Routes Optimized', value: '250K+' },
              { icon: Leaf, label: 'CO₂ Saved', value: '125 tons' },
              { icon: Clock, label: 'Hours Saved', value: '50K+' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-primary-400" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>© 2024 CommuteGo.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by the CommuteGo team
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-xs text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-xs text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Shield className="w-3 h-3" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;