import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Heart, 
  Star, 
  Zap,
  Award,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Slack,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  UserPlus,
  HandHeart,
  Lightbulb,
  Megaphone,
  BookOpen,
  Gamepad2,
  Coffee,
  PartyPopper,
  Sparkles,
  MessageSquare,
  Share2,
  Bookmark,
  ThumbsUp,
  Reply,
  MoreHorizontal
} from 'lucide-react';
import { FaDiscord } from "react-icons/fa";

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { icon: Users, label: 'Community Members', value: '50K+', color: 'text-blue-500' },
    { icon: MessageCircle, label: 'Discussions', value: '12K+', color: 'text-purple-500' },
    { icon: Calendar, label: 'Events Hosted', value: '200+', color: 'text-green-500' },
    { icon: Heart, label: 'Helpful Answers', value: '45K+', color: 'text-red-500' },
  ];

  const guidelines = [
    { icon: Heart, title: 'Be Respectful', description: 'Treat all members with kindness and respect. We welcome diverse perspectives.' },
    { icon: Lightbulb, title: 'Share Knowledge', description: 'Help others by sharing your commute tips, tricks, and experiences.' },
    { icon: HandHeart, title: 'Support Each Other', description: 'Offer assistance to newcomers and celebrate community successes.' },
    { icon: Megaphone, title: 'Stay On Topic', description: 'Keep discussions relevant to commuting, transportation, and CommuteGo.' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'CommuteGo Virtual Meetup',
      date: 'January 25, 2025',
      time: '3:00 PM EST',
      attendees: 245,
      type: 'Virtual',
      description: 'Join us for our monthly community meetup where we discuss new features and share tips.'
    },
    {
      id: 2,
      title: 'NYC Commuters Networking',
      date: 'February 1, 2025',
      time: '6:30 PM EST',
      attendees: 89,
      type: 'In-Person',
      location: 'Manhattan, NYC',
      description: 'Network with fellow NYC commuters and share your best commute routes.'
    },
    {
      id: 3,
      title: 'Commute Tips Workshop',
      date: 'February 8, 2025',
      time: '2:00 PM EST',
      attendees: 156,
      type: 'Virtual',
      description: 'Learn advanced commute optimization techniques from power users.'
    },
    {
      id: 4,
      title: 'Product Feedback Session',
      date: 'February 15, 2025',
      time: '4:00 PM EST',
      attendees: 78,
      type: 'Virtual',
      description: 'Directly influence the future of CommuteGo by sharing your feedback.'
    },
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best commute route from Brooklyn to Midtown?',
      author: 'Sarah M.',
      avatar: 'S',
      replies: 23,
      likes: 45,
      category: 'Routes',
      time: '2 hours ago',
      preview: 'Looking for suggestions on the fastest route during rush hour...'
    },
    {
      id: 2,
      title: 'How I saved 45 minutes daily using CommuteGo',
      author: 'Mike T.',
      avatar: 'M',
      replies: 67,
      likes: 234,
      category: 'Tips',
      time: '5 hours ago',
      preview: 'Here\'s my strategy for optimizing my daily commute...'
    },
    {
      id: 3,
      title: 'New feature request: Dark mode for maps',
      author: 'Emily R.',
      avatar: 'E',
      replies: 89,
      likes: 312,
      category: 'Features',
      time: '1 day ago',
      preview: 'Would love to see a dark mode option for the map view...'
    },
    {
      id: 4,
      title: 'CommuteGo vs competitors - honest comparison',
      author: 'David K.',
      avatar: 'D',
      replies: 45,
      likes: 178,
      category: 'Discussion',
      time: '2 days ago',
      preview: 'After trying all major commute apps, here\'s my take...'
    },
    {
      id: 5,
      title: 'Weekly commute challenge: No car for a month',
      author: 'Lisa P.',
      avatar: 'L',
      replies: 112,
      likes: 456,
      category: 'Challenge',
      time: '3 days ago',
      preview: 'Starting a new challenge - anyone want to join me?...'
    },
  ];

  const socialLinks = [
    { icon: Twitter, name: 'Twitter', followers: '25K', color: 'hover:text-blue-400' },
    { icon: Instagram, name: 'Instagram', followers: '40K', color: 'hover:text-pink-400' },
    { icon: Linkedin, name: 'LinkedIn', followers: '15K', color: 'hover:text-blue-600' },
    { icon: Youtube, name: 'YouTube', followers: '50K', color: 'hover:text-red-500' },
    { icon: Facebook, name: 'Facebook', followers: '30K', color: 'hover:text-blue-600' },
    { icon: FaDiscord, name: 'Discord', members: '15K', color: 'hover:text-indigo-400' },
  ];

  const communityLeaders = [
    { name: 'Alex Chen', role: 'Top Contributor', posts: 342, avatar: 'A', badge: 'gold' },
    { name: 'Maria Garcia', role: 'Helpful Member', posts: 256, avatar: 'M', badge: 'silver' },
    { name: 'James Wilson', role: 'Event Organizer', posts: 189, avatar: 'J', badge: 'bronze' },
    { name: 'Sophie Brown', role: 'Active Member', posts: 145, avatar: 'S', badge: 'bronze' },
  ];

  const renderDiscussions = () => (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <motion.div
          key={discussion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {discussion.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs dark:border-gray-600">{discussion.category}</Badge>
                    <span className="text-sm text-muted-foreground dark:text-gray-400">{discussion.time}</span>
                  </div>
                  <h3 className="font-semibold mb-1 dark:text-white">{discussion.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">{discussion.preview}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      {discussion.replies}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                      <ThumbsUp className="w-4 h-4" />
                      {discussion.likes}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                      <UserPlus className="w-4 h-4" />
                      {discussion.author}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={event.type === 'Virtual' ? 'bg-blue-500' : 'bg-green-500'}>
                      {event.type}
                    </Badge>
                    {event.location && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1 dark:text-white">{event.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees} attending
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700">
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderLeaders = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {communityLeaders.map((leader, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  leader.badge === 'gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  leader.badge === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  'bg-gradient-to-br from-amber-600 to-amber-800'
                }`}>
                  {leader.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold dark:text-white">{leader.name}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{leader.role}</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                    {leader.posts} posts contributed
                  </p>
                </div>
                <Award className={`w-6 h-6 ${
                  leader.badge === 'gold' ? 'text-yellow-500' :
                  leader.badge === 'silver' ? 'text-gray-400' :
                  'text-amber-600'
                }`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Our Community
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Connect with thousands of commuters, share tips, attend events, and help shape the future of CommuteGo
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <FaDiscord className="w-5 h-5 mr-2" />
                Join Discord
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Discussion
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="text-center p-4 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-0">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
                    <guideline.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 dark:text-white">{guideline.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{guideline.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <Separator className="my-12 dark:bg-gray-700" />

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold dark:text-white">Community Hub</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-gray-800 dark:border-gray-600"
                />
                <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="flex gap-2">
                {['discussions', 'events', 'leaders'].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'default' : 'outline'}
                    onClick={() => setActiveTab(tab)}
                    className="capitalize dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {activeTab === 'discussions' && renderDiscussions()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'leaders' && renderLeaders()}
        </motion.div>

        <Separator className="my-12 dark:bg-gray-700" />

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Follow Us</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <social.icon className={`w-5 h-5 ${social.color}`} />
                <span className="dark:text-white">{social.name}</span>
                <span className="text-muted-foreground dark:text-gray-400">
                  {social.followers || social.members}
                </span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Conversation?</h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-6">
                Become part of our growing community of commuters. Share your experiences, learn from others, and help make commuting better for everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent">
                  Browse Discussions
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;