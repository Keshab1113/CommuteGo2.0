import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Download, 
  Mail, 
  Phone, 
  Globe,
  Calendar,
  TrendingUp,
  Users,
  Award,
  Newspaper,
  Play,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  ChevronRight,
  CheckCircle2,
  Image,
  FileText,
  Palette,
  Building2,
  Contact,
  MessageSquare,
  Send
} from 'lucide-react';

const brandAssets = [
  {
    id: 1,
    name: "Primary Logo",
    description: "Main logo for light backgrounds",
    format: "SVG, PNG",
    size: "Vector / 2000x500px",
    icon: "logo"
  },
  {
    id: 2,
    name: "Dark Logo",
    description: "Logo for dark backgrounds",
    format: "SVG, PNG",
    size: "Vector / 2000x500px",
    icon: "logo"
  },
  {
    id: 3,
    name: "Icon Logo",
    description: "Square icon for app icons and favicons",
    format: "SVG, PNG, ICO",
    size: "512x512px",
    icon: "icon"
  },
  {
    id: 4,
    name: "Wordmark",
    description: "Logo with text only",
    format: "SVG, PNG",
    size: "Vector / 3000x600px",
    icon: "text"
  },
];

const colorPalette = [
  { name: "Primary", hex: "#6366f1", usage: "Main brand color, buttons, links" },
  { name: "Primary Dark", hex: "#4f46e5", usage: "Hover states, emphasis" },
  { name: "Secondary", hex: "#10b981", usage: "Success states, accents" },
  { name: "Accent", hex: "#f59e0b", usage: "Highlights, notifications" },
  { name: "Background", hex: "#ffffff", usage: "Light mode background" },
  { name: "Background Dark", hex: "#0f172a", usage: "Dark mode background" },
  { name: "Text Primary", hex: "#1e293b", usage: "Main text" },
  { name: "Text Secondary", hex: "#64748b", usage: "Secondary text" },
];

const fonts = [
  { name: "Inter", usage: "Primary font for body text", weight: "400, 500, 600, 700" },
  { name: "Space Grotesk", usage: "Headlines and display text", weight: "500, 700" },
];

const pressReleases = [
  {
    id: 1,
    title: "CommuteGo 2.0 Launches with AI-Powered Route Optimization",
    date: "January 15, 2025",
    category: "Product",
    excerpt: "Revolutionary update brings intelligent routing and real-time traffic analysis to urban commuters."
  },
  {
    id: 2,
    title: "CommuteGo Raises $50M Series B to Expand AI Platform",
    date: "December 3, 2024",
    category: "Funding",
    excerpt: "Leading venture capital firms back CommuteGo's mission to transform urban mobility."
  },
  {
    id: 3,
    title: "CommuteGo Reaches 1 Million Active Users",
    date: "November 20, 2024",
    category: "Milestone",
    excerpt: "Major milestone reached as platform becomes go-to solution for daily commuters."
  },
  {
    id: 4,
    title: "CommuteGo Partners with Major Cities for Smart Transit Integration",
    date: "October 5, 2024",
    category: "Partnership",
    excerpt: "Strategic partnerships with 10 major cities to integrate public transit data."
  },
  {
    id: 5,
    title: "CommuteGo Introduces Carbon Footprint Tracking",
    date: "September 12, 2024",
    category: "Product",
    excerpt: "New feature helps users track and reduce their environmental impact."
  },
];

const stats = [
  { icon: Users, label: "Active Users", value: "1M+" },
  { icon: Globe, label: "Cities", value: "500+" },
  { icon: TrendingUp, label: "Routes Planned", value: "50M+" },
  { icon: Award, label: "App Rating", value: "4.8" },
];

const mediaContacts = [
  {
    name: "Sarah Johnson",
    title: "Head of Communications",
    email: "press@commutego.com",
    phone: "+1 (555) 123-4567",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    title: "PR Manager",
    email: "media@commutego.com",
    phone: "+1 (555) 987-6543",
    avatar: "MC"
  },
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, followers: "150K", url: "#" },
  { name: "LinkedIn", icon: Linkedin, followers: "75K", url: "#" },
  { name: "Instagram", icon: Instagram, followers: "200K", url: "#" },
  { name: "YouTube", icon: Youtube, followers: "50K", url: "#" },
  { name: "Facebook", icon: Facebook, followers: "100K", url: "#" },
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

export default function PressKit() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/50 text-primary">
              <Newspaper className="w-4 h-4 mr-2" />
              Press & Media
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              Press Kit
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Resources, brand assets, and information for media professionals
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download Brand Kit
              </Button>
              <Button size="lg" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Contact Press Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 dark:bg-muted/20">
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

      {/* Tabs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="brand" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-muted dark:bg-muted/50">
              <TabsTrigger value="brand">Brand Assets</TabsTrigger>
              <TabsTrigger value="colors">Colors & Fonts</TabsTrigger>
              <TabsTrigger value="releases">Press Releases</TabsTrigger>
              <TabsTrigger value="contact">Media Contact</TabsTrigger>
            </TabsList>

            {/* Brand Assets Tab */}
            <TabsContent value="brand">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Logo & Brand Assets</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Download official CommuteGo logos, icons, and brand materials
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {brandAssets.map((asset) => (
                    <Card key={asset.id} className="hover:shadow-lg transition-shadow dark:bg-card dark:border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-primary" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{asset.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {asset.format}
                          </span>
                          <span className="flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            {asset.size}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Card className="max-w-2xl mx-auto bg-muted/30 border-dashed dark:bg-muted/20 dark:border-border">
                    <CardContent className="p-8">
                      <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-bold text-lg mb-2">Need Custom Assets?</h3>
                      <p className="text-muted-foreground mb-4">
                        Contact our press team for custom logo variations, sizing, or format requirements.
                      </p>
                      <Button>
                        <Mail className="w-4 h-4 mr-2" />
                        Request Custom Assets
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Colors & Fonts Tab */}
            <TabsContent value="colors">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Colors & Typography</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Official color palette and font guidelines
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl font-bold mb-4">Color Palette</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {colorPalette.map((color, index) => (
                      <Card key={index} className="overflow-hidden dark:bg-card dark:border-border">
                        <div 
                          className="h-24" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <CardContent className="p-4">
                          <div className="font-bold mb-1">{color.name}</div>
                          <div className="text-sm font-mono text-muted-foreground mb-2">{color.hex}</div>
                          <div className="text-xs text-muted-foreground">{color.usage}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-8" />

                  <h3 className="text-xl font-bold mb-4">Typography</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {fonts.map((font, index) => (
                      <Card key={index} className="dark:bg-card dark:border-border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold mb-2" style={{ fontFamily: font.name }}>
                            {font.name}
                          </div>
                          <p className="text-muted-foreground mb-2">{font.usage}</p>
                          <div className="text-sm">
                            <span className="font-semibold">Weights: </span>
                            <span className="text-muted-foreground">{font.weight}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Press Releases Tab */}
            <TabsContent value="releases">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Press Releases</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Latest news and announcements from CommuteGo
                  </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                  {pressReleases.map((release) => (
                    <Card key={release.id} className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-card dark:border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{release.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {release.date}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{release.title}</h3>
                        <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                        <Button variant="outline" size="sm">
                          Read More
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Press Releases
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Media Contact Tab */}
            <TabsContent value="contact">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Media Contacts</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Get in touch with our press and communications team
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
                  {mediaContacts.map((contact, index) => (
                    <Card key={index} className="dark:bg-card dark:border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {contact.avatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{contact.name}</h3>
                            <p className="text-muted-foreground mb-3">{contact.title}</p>
                            <div className="space-y-2">
                              <a 
                                href={`mailto:${contact.email}`} 
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                              >
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </a>
                              <a 
                                href={`tel:${contact.phone}`}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                              >
                                <Phone className="w-4 h-4" />
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Social Media */}
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-bold mb-6 text-center">Follow Us</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {socialLinks.map((social, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-card dark:border-border">
                        <CardContent className="p-4 text-center">
                          <social.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <div className="font-bold text-sm">{social.name}</div>
                          <div className="text-xs text-muted-foreground">{social.followers}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Press Inquiry Form */}
      <section className="py-20 bg-muted/30 dark:bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="dark:bg-card dark:border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Press Inquiry</CardTitle>
                <CardDescription>
                  For interview requests, press passes, or media information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input placeholder="Your name" className="dark:bg-background dark:border-input" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Organization</label>
                      <Input placeholder="Media organization" className="dark:bg-background dark:border-input" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" className="dark:bg-background dark:border-input" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Inquiry Type</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background dark:bg-background dark:border-input dark:text-foreground">
                      <option>Interview Request</option>
                      <option>Press Pass</option>
                      <option>Product Review</option>
                      <option>Fact Check</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <textarea 
                      className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background dark:bg-background dark:border-input dark:text-foreground"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}