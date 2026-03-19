// frontend/src/pages/Landing.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  Brain,
  Target,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Bell,
  Leaf,
  DollarSign,
  MapPin,
  Star,
  BarChart3,
  Car,
  Bus,
  Train,
  Menu,
  X,
  Check,
  Award,
  ChevronRight,
} from "lucide-react";
import { FaWalking } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import ThemeChangeButton2 from "../components/ThemeChangeButton2";

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const increment = end / (duration / 16);
      let timer;

      const updateCount = () => {
        start += increment;
        if (start >= end) {
          setCount(end);
        } else {
          setCount(Math.floor(start));
          requestAnimationFrame(updateCount);
        }
      };

      timer = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Floating Element Component
const FloatingElement = ({ delay, duration = 6, className, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      delay,
      type: "spring",
      stiffness: 100,
    }}
    className={className}
  >
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// Scroll Reveal Wrapper
const ScrollReveal = ({ children, delay = 0, direction = "up", className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directions = {
    up: { opacity: 0, y: 60 },
    down: { opacity: 0, y: -60 },
    left: { opacity: 0, x: 60 },
    right: { opacity: 0, x: -60 },
    scale: { opacity: 0, scale: 0.8 },
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[direction]}
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : directions[direction]}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary-400/20 dark:bg-primary-500/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, -30, 30, -30],
            x: [null, 30, -30, 30],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Technology", href: "#technology" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden">
      {/* Theme Toggle Button */}
      <ThemeChangeButton2 />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <img src="/logo.png" alt="CommuteGo" className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                CommuteGo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-200">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg shadow-primary-500/25">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <ParticleBackground />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-full blur-3xl"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Transportation Icons */}
        <FloatingElement delay={0.3} className="absolute top-40 left-[10%] hidden lg:block">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <Car className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.5} duration={7} className="absolute top-60 right-[15%] hidden lg:block">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <Train className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.7} duration={8} className="absolute bottom-40 left-[20%] hidden lg:block">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <Bus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.9} duration={5} className="absolute bottom-60 right-[10%] hidden lg:block">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <FaWalking className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
          </div>
        </FloatingElement>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollReveal direction="scale" delay={0.2}>
              <Badge
                variant="outline"
                className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800 mb-8 px-6 py-3 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2 text-primary-500 animate-pulse" />
                AI-Powered Commute Optimization
              </Badge>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Smart Commute
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  Planning Made Simple
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Let our AI agents optimize your daily commute by comparing
                multiple transport modes, calculating costs, and tracking your
                environmental impact in real-time.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-10 py-7 text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-10 py-7 text-lg font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal direction="up" delay={0.6}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                {[
                  {
                    icon: Users,
                    value: "10K+",
                    label: "Active Users",
                    sublabel: "growing daily",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Target,
                    value: "98%",
                    label: "Accuracy Rate",
                    sublabel: "AI-powered",
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Clock,
                    value: "15K+",
                    label: "Hours Saved",
                    sublabel: "this month",
                    gradient: "from-green-500 to-emerald-500",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                    <div className="relative">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.gradient} p-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-full h-full text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        <AnimatedCounter value={stat.value.replace(/[^0-9]/g, '')} />
                        {stat.value.includes('+') && '+'}
                        {stat.value.includes('%') && '%'}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium">
                        {stat.label}
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                        {stat.sublabel}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Why Choose CommuteGo?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Powered by advanced AI agents that learn from your preferences and
                real-time data
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Planning",
                desc: "Multi-agent system optimizes your route in real-time using machine learning",
                gradient: "from-blue-500 to-cyan-500",
                features: ["Real-time analysis", "Smart predictions", "Adaptive learning"],
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                desc: "Instant alerts for traffic, weather, and delays with smart rerouting",
                gradient: "from-orange-500 to-red-500",
                features: ["Live traffic", "Weather alerts", "Delay notifications"],
              },
              {
                icon: Leaf,
                title: "Eco-Friendly",
                desc: "Reduce carbon footprint with green route options and track your impact",
                gradient: "from-green-500 to-emerald-500",
                features: ["Carbon tracking", "Green routes", "Sustainability goals"],
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is encrypted and never shared with third parties",
                gradient: "from-purple-500 to-pink-500",
                features: ["End-to-end encryption", "GDPR compliant", "Privacy first"],
              },
            ].map((feature, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group h-full"
                >
                  <Card className="h-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <feature.icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {feature.desc}
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                Process
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Four intelligent agents working together seamlessly for you
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Planning Agent",
                desc: "Analyzes routes and gathers real-time data from multiple sources",
                icon: Globe,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Optimization Agent",
                desc: "Calculates optimal routes based on time, cost, and sustainability",
                icon: Target,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Analytics Agent",
                desc: "Adds insights and predicts traffic patterns using ML",
                icon: TrendingUp,
                gradient: "from-green-500 to-emerald-500",
              },
              {
                step: "04",
                title: "Notification Agent",
                desc: "Sends alerts about delays and suggests alternatives instantly",
                icon: Bell,
                gradient: "from-orange-500 to-red-500",
              },
            ].map((agent, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                    <div className={`text-7xl font-bold bg-gradient-to-br ${agent.gradient} bg-clip-text text-transparent mb-4`}>
                      {agent.step}
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.gradient} p-3 mb-4`}>
                      <agent.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {agent.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {agent.desc}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <ChevronRight className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <Badge className="mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                  Smart Features
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Everything you need for a smarter commute
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      title: "Multi-Modal Routing",
                      desc: "Compare cab, bus, train, metro, and walking options instantly",
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: DollarSign,
                      title: "Cost Optimization",
                      desc: "Find the most economical route for your budget with real-time pricing",
                      gradient: "from-green-500 to-emerald-500",
                    },
                    {
                      icon: Clock,
                      title: "Time Efficiency",
                      desc: "Save up to 45 minutes daily with AI-optimized routes",
                      gradient: "from-orange-500 to-red-500",
                    },
                    {
                      icon: Leaf,
                      title: "Eco-Friendly Options",
                      desc: "Reduce your carbon footprint by up to 40% with green routes",
                      gradient: "from-teal-500 to-green-500",
                    },
                    {
                      icon: BarChart3,
                      title: "Detailed Analytics",
                      desc: "Track your commuting patterns, savings, and environmental impact",
                      gradient: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: Bell,
                      title: "Smart Alerts",
                      desc: "Get notified about delays and alternatives before you leave",
                      gradient: "from-yellow-500 to-orange-500",
                    },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer group"
                    >
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl blur-3xl opacity-20" />
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Live Route Analysis
                    </h3>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Live
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        mode: "Metro",
                        time: "25 min",
                        cost: "$2.50",
                        eco: "Low",
                        color: "blue",
                      },
                      {
                        mode: "Bus",
                        time: "35 min",
                        cost: "$1.80",
                        eco: "Medium",
                        color: "green",
                      },
                      {
                        mode: "Cab",
                        time: "20 min",
                        cost: "$12.00",
                        eco: "High",
                        color: "orange",
                      },
                      {
                        mode: "Walk",
                        time: "55 min",
                        cost: "$0.00",
                        eco: "None",
                        color: "purple",
                      },
                    ].map((route, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-${route.color}-100 dark:bg-${route.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className={`text-${route.color}-600 dark:text-${route.color}-400 font-bold text-lg`}>
                              {route.mode[0]}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {route.mode}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-gray-600 dark:text-gray-300">
                            {route.time}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white w-16">
                            {route.cost}
                          </span>
                          <Badge
                            className={`${
                              route.eco === "Low" 
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                                : route.eco === "Medium" 
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" 
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            } border-0`}
                          >
                            {route.eco}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        AI Recommended
                      </span>
                      <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Metro • 25 min • $2.50
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                Advanced Technology
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Powered by Intelligent Agents
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Our multi-agent AI system works around the clock to optimize your
                daily commute with unprecedented accuracy.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Planning Agent",
                desc: "Analyzes thousands of route combinations in milliseconds",
                icon: Globe,
                gradient: "from-blue-500 to-cyan-500",
                stats: ["10M+ routes/sec", "99.9% uptime"],
              },
              {
                title: "Optimization Agent",
                desc: "Balances time, cost, and environmental impact perfectly",
                icon: Target,
                gradient: "from-purple-500 to-pink-500",
                stats: ["3 objectives", "Pareto optimal"],
              },
              {
                title: "Analytics Agent",
                desc: "Predicts traffic patterns using historical data and ML",
                icon: TrendingUp,
                gradient: "from-green-500 to-emerald-500",
                stats: ["95% accuracy", "Real-time ML"],
              },
              {
                title: "Notification Agent",
                desc: "Real-time alerts keep you one step ahead of delays",
                icon: Bell,
                gradient: "from-orange-500 to-red-500",
                stats: ["< 100ms latency", "Push & SMS"],
              },
            ].map((agent, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.gradient} p-4 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <agent.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {agent.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {agent.desc}
                    </p>
                    <div className="space-y-2">
                      {agent.stats.map((stat, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <Award className="h-4 w-4 text-primary-500 mr-2" />
                          <span className="text-gray-500 dark:text-gray-400">{stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Loved by commuters
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Join thousands of happy users saving time and money daily
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Daily Commuter",
                content: "CommuteGo has transformed my daily commute. I save 45 minutes every day and $200 monthly! The AI recommendations are incredibly accurate.",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=1",
                savings: "45 min/day",
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content: "The AI recommendations are spot-on. It knows exactly when to leave to avoid traffic. I've never been late since using CommuteGo.",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=2",
                savings: "100% on time",
              },
              {
                name: "Emily Rodriguez",
                role: "Environmentalist",
                content: "Love how it helps me track my carbon footprint. I've reduced my emissions by 30% and discovered amazing eco-friendly routes.",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=3",
                savings: "30% less CO2",
              },
            ].map((testimonial, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-5 rounded-bl-full" />
                  <div className="relative">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full border-2 border-primary-500/30"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                        {testimonial.savings}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="scale">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 p-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 rounded-3xl p-12 md:p-16 text-center text-white">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1.2, 1, 1.2],
                      rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                  />
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                  >
                    <Sparkles className="h-10 w-10 text-white" />
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to optimize your commute?
                  </h2>
                  <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                    Join thousands of users saving time, money, and the environment
                    with AI-powered route planning. Start your free trial today.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="bg-white text-primary-900 hover:bg-primary-50 px-10 py-7 text-lg font-semibold rounded-xl shadow-lg shadow-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/demo">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-10 py-7 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                      >
                        Watch Demo
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-10 flex items-center justify-center gap-6 text-sm text-primary-200">
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> No credit card required
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Cancel anytime
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> 14-day free trial
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;