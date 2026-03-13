import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Zap, 
  Award, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight,
  Lightbulb,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Shield,
  BarChart3,
  Calendar,
  ArrowRight
} from 'lucide-react';

const roadmapData = [
  {
    phase: "Phase 1: Foundation",
    status: "completed",
    description: "Core platform launch and basic features",
    items: [
      { feature: "User authentication & profiles", completed: true },
      { feature: "Route planning with multiple transport modes", completed: true },
      { feature: "Real-time traffic integration", completed: true },
      { feature: "Basic commute history tracking", completed: true },
      { feature: "Mobile-responsive design", completed: true },
      { feature: "Email notifications", completed: true },
    ]
  },
  {
    phase: "Phase 2: Enhancement",
    status: "in-progress",
    description: "Advanced features and AI integration",
    items: [
      { feature: "AI-powered route optimization", completed: true },
      { feature: "Agentic commute planning", completed: true },
      { feature: "Real-time alerts system", completed: true },
      { feature: "Cost comparison tools", completed: true },
      { feature: "Carbon footprint tracking", completed: true },
      { feature: "Multi-stop route planning", completed: false },
    ]
  },
  {
    phase: "Phase 3: Expansion",
    status: "planned",
    description: "Community features and integrations",
    items: [
      { feature: "Social commute sharing", completed: false },
      { feature: "Carpool matching system", completed: false },
      { feature: "Third-party API integrations", completed: false },
      { feature: "Business dashboard", completed: false },
      { feature: "Custom route preferences", completed: false },
      { feature: "Achievement system", completed: false },
    ]
  },
  {
    phase: "Phase 4: Innovation",
    status: "planned",
    description: "Future technologies and global expansion",
    items: [
      { feature: "AI voice assistant", completed: false },
      { feature: "AR navigation preview", completed: false },
      { feature: "Predictive commute analysis", completed: false },
      { feature: "International city support", completed: false },
      { feature: "Smart home integration", completed: false },
      { feature: "Wearable device support", completed: false },
    ]
  }
];

const stats = [
  { icon: Rocket, label: "Features Launched", value: "24+" },
  { icon: Users, label: "Active Users", value: "10K+" },
  { icon: Globe, label: "Cities Covered", value: "50+" },
  { icon: TrendingUp, label: "User Growth", value: "150%" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [email, setEmail] = useState('');

  const togglePhase = (index) => {
    setExpandedPhase(expandedPhase === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/50 text-primary">
              <MapPin className="w-4 h-4 mr-2" />
              Product Roadmap
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Journey Ahead
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover what's coming next. We're constantly evolving to make your commute smarter, faster, and more enjoyable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                View Current Features
              </Button>
              <Button size="lg" variant="outline">
                <Lightbulb className="w-4 h-4 mr-2" />
                Suggest a Feature
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="text-center p-4">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Timeline</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow our progress as we build the future of commute planning
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {roadmapData.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden transition-all duration-300 ${
                  phase.status === 'completed' ? 'border-l-4 border-l-green-500' :
                  phase.status === 'in-progress' ? 'border-l-4 border-l-primary' :
                  'border-l-4 border-l-muted'
                }`}>
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => togglePhase(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {phase.status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : phase.status === 'in-progress' ? (
                          <Circle className="w-6 h-6 text-primary animate-pulse" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-xl">{phase.phase}</CardTitle>
                          <CardDescription>{phase.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          phase.status === 'completed' ? 'default' :
                          phase.status === 'in-progress' ? 'secondary' :
                          'outline'
                        } className={
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'in-progress' ? 'bg-primary' :
                          ''
                        }>
                          {phase.status === 'in-progress' ? 'In Progress' : 
                           phase.status === 'completed' ? 'Completed' : 'Planned'}
                        </Badge>
                        {expandedPhase === index ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {expandedPhase === index && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      <div className="space-y-3">
                        {phase.items.map((feature, fIndex) => (
                          <div 
                            key={fIndex} 
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              feature.completed ? 'bg-green-500/10' : 'bg-muted/30'
                            }`}
                          >
                            {feature.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={feature.completed ? '' : 'text-muted-foreground'}>
                              {feature.feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Requests */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  <Lightbulb className="w-6 h-6 inline-block mr-2 text-primary" />
                  Have a Feature Idea?
                </CardTitle>
                <CardDescription>
                  We love hearing from our users. Share your ideas to help us improve CommuteGo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input 
                    placeholder="Enter your email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button>
                    Submit Idea
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Join our community of 10,000+ users shaping the future of commute planning
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-12">
                <Award className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Experience the Future?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Start using our AI-powered commute planning today and see the difference
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}