import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  Zap, 
  Award, 
  Search,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Shield,
  Globe,
  Smartphone,
  BarChart3,
  Heart,
  Briefcase,
  Users,
  DollarSign,
  Coffee,
  Monitor,
  Code,
  Palette,
  Megaphone,
  Headphones,
  Mail,
  Phone,
  CheckCircle2,
  ChevronRight,
  Building2,
  GraduationCap,
  Laptop,
  Plane,
  Utensils,
  Gamepad2,
  BookOpen
} from 'lucide-react';

const openPositions = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    experience: "5+ years",
    salary: "$150,000 - $200,000",
    tags: ["React", "TypeScript", "Tailwind"],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    salary: "$130,000 - $180,000",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    posted: "3 days ago"
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    experience: "4+ years",
    salary: "$120,000 - $160,000",
    tags: ["Figma", "UI/UX", "Design Systems"],
    posted: "5 days ago"
  },
  {
    id: 4,
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "3+ years",
    salary: "$160,000 - $220,000",
    tags: ["Python", "TensorFlow", "LLMs"],
    posted: "1 week ago"
  },
  {
    id: 5,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    experience: "5+ years",
    salary: "$100,000 - $140,000",
    tags: ["Growth", "SEO", "Content"],
    posted: "1 week ago"
  },
  {
    id: 6,
    title: "Customer Success Manager",
    department: "Operations",
    location: "Austin, TX (Hybrid)",
    type: "Full-time",
    experience: "2+ years",
    salary: "$70,000 - $95,000",
    tags: ["SaaS", "B2B", "Support"],
    posted: "2 weeks ago"
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Industry-leading compensation with equity options"
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive medical, dental, and vision coverage"
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Work when you're most productive"
  },
  {
    icon: Plane,
    title: "Unlimited PTO",
    description: "Take time off when you need it"
  },
  {
    icon: Laptop,
    title: "Remote First",
    description: "Work from anywhere in the world"
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "$2,000 annually for courses and conferences"
  },
  {
    icon: Utensils,
    title: "Free Meals",
    description: "Daily lunch and snacks in office"
  },
  {
    icon: Gamepad2,
    title: "Team Events",
    description: "Regular offsites and team building activities"
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We push boundaries and challenge the status quo",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Users,
    title: "User Obsessed",
    description: "Every decision starts with our users' needs",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Integrity Always",
    description: "We do the right thing, even when it's hard",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "Growth Mindset",
    description: "We learn from failures and celebrate progress",
    color: "from-purple-400 to-pink-500"
  },
];

const stats = [
  { icon: Users, label: "Team Members", value: "150+" },
  { icon: Globe, label: "Countries", value: "25+" },
  { icon: Briefcase, label: "Open Positions", value: "12" },
  { icon: Award, label: "Fortune 500", value: "3" },
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

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', 'Engineering', 'Design', 'Marketing', 'Operations'];

  const filteredPositions = openPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || position.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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
              <Briefcase className="w-4 h-4 mr-2" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Build the Future of Commuting
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join a team of passionate innovators working to transform how people move through cities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                View Open Positions
              </Button>
              <Button size="lg" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Meet the Team
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

      {/* Culture & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Culture & Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building more than a product — we're creating a movement
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-4`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We take care of our team so they can focus on what matters
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <benefit.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your next role and help us revolutionize urban mobility
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto mb-8">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search positions..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                  className="capitalize"
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </Button>
              ))}
            </div>
          </div>

          {/* Positions List */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            {filteredPositions.map((position) => (
              <motion.div key={position.id} variants={item}>
                <Card className="hover:shadow-lg transition-all hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{position.title}</h3>
                          <Badge variant="secondary">{position.department}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {position.experience}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {position.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary mb-1">{position.salary}</div>
                        <div className="text-xs text-muted-foreground mb-3">{position.posted}</div>
                        <Button>
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold mb-2">No positions found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We keep it simple and transparent
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Apply", description: "Submit your application and resume" },
              { step: 2, title: "Screening", description: "Quick call with our recruiting team" },
              { step: 3, title: "Interview", description: "Technical and cultural interviews" },
              { step: 4, title: "Offer", description: "Welcome to the team! 🎉" }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {process.step}
                </div>
                <h3 className="font-bold mb-2">{process.title}</h3>
                <p className="text-sm text-muted-foreground">{process.description}</p>
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
            className="text-center"
          >
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-12">
                <Briefcase className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Don't See the Right Role?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  We're always looking for talented people. Send us your resume and we'll reach out when something matching comes up.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Submit Your Resume
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Learn About Our Culture
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