// frontend/src/pages/Landing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
  BarChart3
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute h-32 w-32 bg-primary-500 rounded-full blur-3xl opacity-20 top-20 left-10 animate-pulse" />
        <div className="absolute h-40 w-40 bg-secondary-500 rounded-full blur-3xl opacity-20 bottom-20 right-10 animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 mb-6 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Commute Optimization
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
              Smart Commute Planning Made Simple
            </h1>
            
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Let our AI agents optimize your daily commute by comparing multiple transport modes, 
              calculating costs, and tracking your environmental impact in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-900 hover:bg-primary-50 px-8 py-6 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                { icon: Users, value: "10K+", label: "Active Users" },
                { icon: Target, value: "98%", label: "Accuracy Rate" },
                { icon: Clock, value: "15K+", label: "Hours Saved" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary-200" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-primary-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
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
            <h2 className="text-4xl font-bold mb-4">Why Choose CommuteGo?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powered by advanced AI agents that learn from your preferences and real-time data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Planning",
                desc: "Multi-agent system optimizes your route in real-time",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                desc: "Instant alerts for traffic, weather, and delays",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Leaf,
                title: "Eco-Friendly",
                desc: "Reduce carbon footprint with green route options",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is encrypted and never shared",
                color: "from-purple-500 to-pink-500"
              }
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
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200">
                  <CardContent className="pt-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Four intelligent agents working together for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Planning Agent",
                desc: "Analyzes routes and gathers real-time data from multiple sources",
                icon: Globe
              },
              {
                step: "02",
                title: "Optimization Agent",
                desc: "Calculates optimal routes based on time, cost, and sustainability",
                icon: Target
              },
              {
                step: "03",
                title: "Analytics Agent",
                desc: "Adds insights and predicts traffic patterns",
                icon: TrendingUp
              },
              {
                step: "04",
                title: "Notification Agent",
                desc: "Sends alerts about delays and suggests alternatives",
                icon: Bell
              }
            ].map((agent, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-6xl font-bold text-primary-100 mb-4">{agent.step}</div>
                  <agent.icon className="h-8 w-8 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{agent.title}</h3>
                  <p className="text-gray-600">{agent.desc}</p>
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
              <Badge className="mb-4">Smart Features</Badge>
              <h2 className="text-3xl font-bold mb-6">Everything you need for a smarter commute</h2>
              
              <div className="space-y-4">
                {[
                  { icon: MapPin, title: "Multi-Modal Routing", desc: "Compare cab, bus, train, metro, and walking options" },
                  { icon: DollarSign, title: "Cost Optimization", desc: "Find the most economical route for your budget" },
                  { icon: Clock, title: "Time Efficiency", desc: "Save time with real-time traffic updates" },
                  { icon: Leaf, title: "Eco-Friendly Options", desc: "Reduce your carbon footprint with green routes" },
                  { icon: BarChart3, title: "Detailed Analytics", desc: "Track your commuting patterns and savings" },
                  { icon: Bell, title: "Smart Alerts", desc: "Get notified about delays and alternatives" }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <feature.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl p-8"
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-primary-600" />
                  <h3 className="font-semibold">AI Agent Dashboard</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Planning Agent</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Optimization Agent</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Analytics Agent</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Processing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Notification Agent</span>
                    <Badge className="bg-blue-100 text-blue-700">Monitoring</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Today's Predictions</span>
                    <span className="font-semibold">98% accurate</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600">• Best time to leave: 8:30 AM</p>
                    <p className="text-xs text-gray-600">• Expected traffic: Moderate</p>
                    <p className="text-xs text-gray-600">• Recommended mode: Train</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Loved by commuters</h2>
            <p className="text-gray-600 text-lg">Join thousands of happy users saving time and money</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Daily Commuter",
                content: "CommuteGo has transformed my daily commute. I save 45 minutes every day and $200 monthly!",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=1"
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content: "The AI recommendations are spot-on. It knows exactly when to leave to avoid traffic.",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=2"
              },
              {
                name: "Emily Rodriguez",
                role: "Environmentalist",
                content: "Love how it helps me track my carbon footprint. I've reduced my emissions by 30%!",
                rating: 5,
                image: "https://i.pravatar.cc/100?img=3"
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 text-lg">Start saving today with our free plan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for occasional commuters",
                features: [
                  "5 route plans per month",
                  "Basic route optimization",
                  "Email support",
                  "Carbon tracking"
                ]
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/month",
                description: "For daily commuters",
                features: [
                  "Unlimited route plans",
                  "AI-powered optimization",
                  "Real-time alerts",
                  "Advanced analytics",
                  "Priority support",
                  "Historical data export"
                ],
                popular: true
              },
              {
                name: "Business",
                price: "$29.99",
                period: "/month",
                description: "For teams and organizations",
                features: [
                  "Everything in Pro",
                  "Team management",
                  "API access",
                  "Custom integrations",
                  "Dedicated account manager",
                  "SLA guarantee"
                ]
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-primary-600 to-secondary-600 text-white shadow-xl scale-105' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary-600 border-0">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className={plan.popular ? 'text-white/80' : 'text-gray-500'}>{plan.period}</span>}
                </div>
                <p className={`mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-white text-primary-600 hover:bg-gray-100' 
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
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
            className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to optimize your commute?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users saving time, money, and the environment with AI-powered route planning.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-900 hover:bg-primary-50 px-8 py-6 text-lg">
                Start Your Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">CG</span>
                </div>
                <span className="text-xl font-bold">CommuteGo</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making daily commutes smarter, cheaper, and greener with AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 CommuteGo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;