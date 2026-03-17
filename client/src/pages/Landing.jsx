// frontend/src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
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
  CheckCircle,
  Star,
  BarChart3,
  Car,
  Bus,
  Train,
} from "lucide-react";
import { FaWalking } from "react-icons/fa";
import Footer from "../components/layout/Footer";

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

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
const ScrollReveal = ({ children, delay = 0, direction = "up" }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directions = {
    up: { opacity: 0, y: 40 },
    down: { opacity: 0, y: -40 },
    left: { opacity: 0, x: 40 },
    right: { opacity: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[direction]}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : directions[direction]}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-950 via-primary-900 to-secondary-950 text-white min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Transportation Icons */}
        <FloatingElement delay={0.3} className="absolute top-32 left-[10%] hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <Car className="w-8 h-8 text-primary-300" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.5} duration={7} className="absolute top-48 right-[15%] hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <Train className="w-8 h-8 text-secondary-300" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.7} duration={8} className="absolute bottom-32 left-[20%] hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <Bus className="w-8 h-8 text-primary-300" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.9} duration={5} className="absolute bottom-48 right-[10%] hidden md:block">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <FaWalking className="w-8 h-8 text-secondary-300" />
          </div>
        </FloatingElement>

        <div className="container mx-auto px-4 py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="bg-white/10 text-white border-white/20 mb-8 px-6 py-3 text-sm backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                AI-Powered Commute Optimization
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-linear-to-br from-white via-primary-100 to-white"
            >
              Smart Commute
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-primary-300 via-secondary-300 to-primary-300">
                Planning Made Simple
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Let our AI agents optimize your daily commute by comparing
              multiple transport modes, calculating costs, and tracking your
              environmental impact in real-time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-900 hover:bg-primary-50 px-10 py-7 text-lg font-semibold rounded-xl shadow-lg shadow-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-10 py-7 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Enhanced Stats with glow effects */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
            >
              {[
                {
                  icon: Users,
                  value: "10K+",
                  label: "Active Users",
                  sublabel: "growing daily",
                },
                {
                  icon: Target,
                  value: "98%",
                  label: "Accuracy Rate",
                  sublabel: "AI-powered",
                },
                {
                  icon: Clock,
                  value: "15K+",
                  label: "Hours Saved",
                  sublabel: "this month",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="relative">
                    <stat.icon className="h-10 w-10 mx-auto mb-4 text-primary-300 group-hover:text-primary-200 transition-colors" />
                    <div className="absolute inset-0 bg-primary-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-primary-100 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-primary-300/60 text-sm mt-1">
                    {stat.sublabel}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
       </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Why Choose Commute?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Powered by advanced AI agents that learn from your preferences and
              real-time data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Planning",
                desc: "Multi-agent system optimizes your route in real-time",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                desc: "Instant alerts for traffic, weather, and delays",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Leaf,
                title: "Eco-Friendly",
                desc: "Reduce carbon footprint with green route options",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is encrypted and never shared",
                color: "from-purple-500 to-pink-500",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200 dark:border-gray-700 dark:hover:border-primary-400">
                  <CardContent className="pt-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} p-4 mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Four intelligent agents working together for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Planning Agent",
                desc: "Analyzes routes and gathers real-time data from multiple sources",
                icon: Globe,
              },
              {
                step: "02",
                title: "Optimization Agent",
                desc: "Calculates optimal routes based on time, cost, and sustainability",
                icon: Target,
              },
              {
                step: "03",
                title: "Analytics Agent",
                desc: "Adds insights and predicts traffic patterns",
                icon: TrendingUp,
              },
              {
                step: "04",
                title: "Notification Agent",
                desc: "Sends alerts about delays and suggests alternatives",
                icon: Bell,
              },
            ].map((agent, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-6xl font-bold text-primary-100 mb-4">
                    {agent.step}
                  </div>
                  <agent.icon className="h-8 w-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    {agent.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {agent.desc}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 text-primary-300">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 dark:bg-gray-700 dark:text-gray-200">
                Smart Features
              </Badge>
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                Everything you need for a smarter commute
              </h2>

              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: "Multi-Modal Routing",
                    desc: "Compare cab, bus, train, metro, and walking options",
                  },
                  {
                    icon: DollarSign,
                    title: "Cost Optimization",
                    desc: "Find the most economical route for your budget",
                  },
                  {
                    icon: Clock,
                    title: "Time Efficiency",
                    desc: "Save time with real-time traffic updates",
                  },
                  {
                    icon: Leaf,
                    title: "Eco-Friendly Options",
                    desc: "Reduce your carbon footprint with green routes",
                  },
                  {
                    icon: BarChart3,
                    title: "Detailed Analytics",
                    desc: "Track your commuting patterns and savings",
                  },
                  {
                    icon: Bell,
                    title: "Smart Alerts",
                    desc: "Get notified about delays and alternatives",
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:text-white hover:dark:text-gray-800"
                  >
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <feature.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold ">
                        {feature.title}
                      </h3>
                      <p className="text-sm opacity-80">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-3xl p-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-primary-600" />
                  <h3 className="font-semibold dark:text-white">
                    AI Agent Dashboard
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm dark:text-white">
                      Planning Agent
                    </span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm dark:text-white">
                      Optimization Agent
                    </span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm dark:text-white">
                      Analytics Agent
                    </span>
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      Processing
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm dark:text-white">
                      Notification Agent
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Monitoring
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t dark:border-gray-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Today's Predictions
                    </span>
                    <span className="font-semibold dark:text-white">
                      98% accurate
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      • Best time to leave: 8:30 AM
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      • Expected traffic: Moderate
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      • Recommended mode: Train
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Loved by commuters
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Join thousands of happy users saving time and money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Daily Commuter",
                content:
                  "CommuteGo has transformed my daily commute. I save 45 minutes every day and $200 monthly!",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=1",
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content:
                  "The AI recommendations are spot-on. It knows exactly when to leave to avoid traffic.",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=2",
              },
              {
                name: "Emily Rodriguez",
                role: "Environmentalist",
                content:
                  "Love how it helps me track my carbon footprint. I've reduced my emissions by 30%!",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=3",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 dark:bg-gray-700 dark:text-gray-200">
              Advanced Technology
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
              Powered by Intelligent Agents
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Our multi-agent AI system works around the clock to optimize your
              daily commute with unprecedented accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Planning Agent",
                desc: "Analyzes thousands of route combinations in milliseconds",
                icon: Globe,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Optimization Agent",
                desc: "Balances time, cost, and environmental impact",
                icon: Target,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Analytics Agent",
                desc: "Predicts traffic patterns using historical data",
                icon: TrendingUp,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Notification Agent",
                desc: "Real-time alerts keep you one step ahead",
                icon: Bell,
                color: "from-orange-500 to-red-500",
              },
            ].map((agent, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${agent.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
                />
                <div
                  className={`w-14 h-14 rounded-xl bg-linear-to-br ${agent.color} p-3 mb-4`}
                >
                  <agent.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  {agent.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 dark:bg-gray-700 dark:text-gray-200">
                Why CommuteGo
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
                The smarter way to commute
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                We combine cutting-edge AI technology with comprehensive transit
                data to deliver the most accurate and efficient commute
                recommendations possible.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: "Save 30+ minutes daily",
                    desc: "AI-optimized routes that adapt to real-time conditions",
                  },
                  {
                    icon: DollarSign,
                    title: "Cut commute costs by 40%",
                    desc: "Find the most economical transportation options",
                  },
                  {
                    icon: Leaf,
                    title: "Reduce your carbon footprint",
                    desc: "Choose eco-friendly routes and track your impact",
                  },
                  {
                    icon: Shield,
                    title: "Enterprise-grade security",
                    desc: "Your data is encrypted and protected",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary-500 to-secondary-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold dark:text-white">
                    Live Route Analysis
                  </h3>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
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
                    },
                    {
                      mode: "Bus",
                      time: "35 min",
                      cost: "$1.80",
                      eco: "Medium",
                    },
                    {
                      mode: "Cab",
                      time: "20 min",
                      cost: "$12.00",
                      eco: "High",
                    },
                    {
                      mode: "Walk",
                      time: "55 min",
                      cost: "$0.00",
                      eco: "None",
                    },
                  ].map((route, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            {route.mode[0]}
                          </span>
                        </div>
                        <span className="font-medium dark:text-white">
                          {route.mode}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          {route.time}
                        </span>
                        <span className="font-semibold dark:text-white">
                          {route.cost}
                        </span>
                        <Badge
                          className={`text-xs ${route.eco === "Low" ? "bg-green-100 text-green-700" : route.eco === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                        >
                          {route.eco}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Recommended
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      Metro • 25 min • $2.50
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-primary-900 to-secondary-900 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to optimize your commute?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users saving time, money, and the environment
              with AI-powered route planning.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary-900 hover:bg-primary-50 px-8 py-6 text-lg"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;
