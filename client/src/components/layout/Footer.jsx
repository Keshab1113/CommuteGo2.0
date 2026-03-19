// frontend/src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Sparkles,
  Heart,
  ExternalLink,
  MapPin,
  Shield,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "✨ Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers", badge: "Hiring" },
        { label: "Press Kit", href: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "API Reference", href: "#api" },
        { label: "Community", href: "/community" },
        { label: "Support Center", href: "/support" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Security", href: "/security" },
        { label: "Cookies", href: "/cookies" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:hello@commutego.com",
      label: "Email",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative bg-white dark:bg-slate-900 text-gray-900 dark:text-white overflow-hidden border-t border-gray-200 dark:border-slate-800">
      {/* Background decoration - light mode adjusted */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-transparent dark:from-slate-800/20 dark:via-transparent dark:to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent dark:via-cyan-500/50" />

      {/* Animated gradient orbs - light mode adjusted */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main footer content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16 rounded-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand column */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center transition-all duration-300">
                <img src="/logo.png" alt="CommuteGo" className="w-8 h-8" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  CommuteGo
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 mt-1">
                  <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>AI-Powered Commuting</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              Transform your daily commute with intelligent AI agents that
              optimize routes, save money, and reduce your carbon footprint.
              Join thousands of smart commuters making better choices every day.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <a
                  href="mailto:hello@commutego.com"
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
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
                    className="w-11 h-11 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500 rounded-xl flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Link columns */}
          {footerSections.map((section, idx) => (
            <motion.div variants={itemVariants} key={idx} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />
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
                      className="text-sm text-gray-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-slate-600 group-hover:bg-cyan-600 dark:group-hover:bg-cyan-400 rounded-full transition-colors" />
                      {link.label}
                      {link.badge && (
                        <span className="ml-2 px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-medium rounded-full">
                          {link.badge}
                        </span>
                      )}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-600 dark:text-cyan-400" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-slate-800"
        >
          <div className="text-sm text-gray-500 dark:text-slate-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()} CommuteGo. All rights reserved.
            </span>
            <span className="hidden md:inline text-gray-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span className="text-gray-500 dark:text-slate-500">by the CommuteGo team</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="/privacy"
              className="text-xs text-gray-500 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-xs text-gray-500 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="text-xs text-gray-500 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Cookie Policy
            </a>
            <a
              href="/security"
              className="text-xs text-gray-500 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Security
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs bg-gray-100 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Enterprise-grade security</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;