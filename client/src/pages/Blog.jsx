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
  MessageCircle,
  Share2,
  Bookmark,
  ChevronRight
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'product', label: 'Product' },
  { id: 'technology', label: 'Technology' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'company', label: 'Company' },
];

const featuredPost = {
  id: 1,
  title: "The Future of Urban Commuting: How AI is Revolutionizing Daily Travel",
  excerpt: "Discover how artificial intelligence is transforming the way we navigate cities, making commutes faster, cheaper, and more sustainable than ever before.",
  category: "Technology",
  author: "Sarah Chen",
  date: "January 15, 2025",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
  featured: true
};

const blogPosts = [
  {
    id: 2,
    title: "10 Tips for Reducing Your Daily Commute Time",
    excerpt: "Practical strategies to optimize your route and save precious minutes every day.",
    category: "Lifestyle",
    author: "Michael Torres",
    date: "January 12, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
    likes: 234,
    comments: 45
  },
  {
    id: 3,
    title: "Introducing Agentic Planning: Your AI Commute Assistant",
    excerpt: "Meet your new personal commute planner powered by advanced AI agents.",
    category: "Product",
    author: "Alex Rivera",
    date: "January 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
    likes: 189,
    comments: 32
  },
  {
    id: 4,
    title: "How We Calculate Your Carbon Footprint",
    excerpt: "Understanding the environmental impact of your commute choices.",
    category: "Technology",
    author: "Emma Watson",
    date: "January 8, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&h=250&fit=crop",
    likes: 156,
    comments: 28
  },
  {
    id: 5,
    title: "CommuteGo 2024: A Year in Review",
    excerpt: "Looking back at our achievements and what’s coming next.",
    category: "Company",
    author: "David Kim",
    date: "January 5, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    likes: 312,
    comments: 67
  },
  {
    id: 6,
    title: "Public Transit vs. Driving: The Ultimate Comparison",
    excerpt: "An in-depth analysis of time, cost, and environmental impact.",
    category: "Lifestyle",
    author: "Lisa Park",
    date: "January 3, 2025",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
    likes: 278,
    comments: 54
  },
  {
    id: 7,
    title: "Behind the Scenes: Building Our Route Optimization Engine",
    excerpt: "How our algorithms find the fastest path through city traffic.",
    category: "Technology",
    author: "James Liu",
    date: "December 28, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
    likes: 198,
    comments: 41
  },
];

const stats = [
  { icon: TrendingUp, label: "Monthly Readers", value: "50K+" },
  { icon: User, label: "Articles Published", value: "120+" },
  { icon: Heart, label: "Total Likes", value: "25K+" },
  { icon: MessageCircle, label: "Community Comments", value: "5K+" },
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

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
              <MapPin className="w-4 h-4 mr-2" />
              Our Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              Insights & Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay updated with the latest news, tips, and insights about commute optimization and urban mobility
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Subscribe to Newsletter
              </Button>
              <Button size="lg" variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Browse Archives
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

      {/* Search and Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-primary" />
              Featured Article
            </h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <MapPin className="w-24 h-24 text-primary/30" />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                  <h3 className="text-2xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Button className="w-fit">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group h-full">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                    <MapPin className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="w-fit mb-3 text-xs">{post.category}</Badge>
                    <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">
                  <Lightbulb className="w-6 h-6 inline-block mr-2 text-primary" />
                  Never Miss a Post
                </CardTitle>
                <CardDescription>
                  Subscribe to our newsletter and get the latest articles delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input 
                    placeholder="Enter your email" 
                    type="email"
                    className="flex-1"
                  />
                  <Button>
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Join 10,000+ subscribers. Unsubscribe anytime.
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
                  Start Your Smarter Commute Today
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of users who have transformed their daily travel experience
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Read More Articles
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