// frontend/src/pages/Home.jsx - Dashboard for authenticated users only
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { commuteAPI, analyticsAPI } from "../services/api";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import StatsCard from "../components/dashboard/StatsCard";
import RouteVisualization from "../components/dashboard/RouteVisualization";
import {
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  ArrowRight,
  AlertCircle,
  Calendar,
  BarChart3,
  Sparkles,
  Brain,
  Zap,
  Award,
  Car,
  Bus,
  Train,
  TramFront,
  Footprints,
  GitBranch,
  ArrowLeftRight,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [agentInsights, setAgentInsights] = useState(null);
  const [stats, setStats] = useState({
    totalSaved: 0,
    totalTime: 0,
    totalCarbon: 0,
    totalCommutes: 0,
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [routesResponse, analyticsResponse, insightsResponse] =
        await Promise.allSettled([
          commuteAPI.getRoutes(3),
          analyticsAPI.getUserAnalytics(), // This gets /analytics/user - has savings, totalCommutes
          analyticsAPI.getAgentInsights()  // This gets /analytics/agent/insights - has recommendations
        ]);

      if (routesResponse.status === 'fulfilled') {
        setRecentRoutes(routesResponse.value.data);
      }
      
      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.data) {
        const data = analyticsResponse.value.data;
        setUserAnalytics(data);
        
        // Extract savings from the correct structure
        const totalSaved = data.savings?.totalSaved || data.savings?.total_saved || 0;
        const totalCommutes = data.totalCommutes || data.total_commutes || 0;
        
        setStats({
          totalSaved: totalSaved,
          totalTime: totalCommutes * 30,
          totalCarbon: totalCommutes * 2,
          totalCommutes: totalCommutes,
        });
      }
      
      if (insightsResponse.status === 'fulfilled' && insightsResponse.value.data) {
        setAgentInsights(insightsResponse.value.data);
      }
      
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Header with Agent Status */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 dark:text-white">
            Welcome back, <span className="text-primary-600 dark:text-primary-400">{user?.name}!</span>
            {agentInsights && (
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 ml-2">
                <Brain className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your AI-generated commute overview and insights
          </p>
        </div>
        <Link to="/plan">
          <Button className="gap-2 text-white bg-linear-to-br from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
            <Sparkles className="h-4 w-4" />
            Plan with AI
          </Button>
        </Link>
      </div>

      {/* Stats Grid with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatsCard
              title="Total Savings"
              value={formatCurrency(stats.totalSaved)}
              icon={DollarSign}
              trend={{
                direction: "up",
                value: "12%",
                label: "from last month",
              }}
              className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow"
            />

            <StatsCard
              title="Time Optimized"
              value={formatTime(stats.totalTime)}
              icon={Clock}
              trend={{ direction: "up", value: "8%", label: "efficiency" }}
              className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
            />

            <StatsCard
              title="Carbon Reduced"
              value={`${stats.totalCarbon.toFixed(1)} kg`}
              icon={Leaf}
              description="CO₂ emissions saved"
              className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow"
            />

            <StatsCard
              title="Total Commutes"
              value={stats.totalCommutes}
              icon={BarChart3}
              trend={{ direction: "up", value: "15%", label: "this month" }}
              className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow"
            />
          </>
        )}
      </div>

      {/* AI Insights Panel - Enhanced */}
      {agentInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">AI Agent Insights</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Personalized recommendations for your commute</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Analysis
            </Badge>
          </div>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {agentInsights.totalRoutes || agentInsights.recommendations?.length || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Routes Analyzed</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {agentInsights.savingsPercent || Math.round(stats.totalSaved / (stats.totalSaved + 100) * 100) || 0}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Savings Rate</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {agentInsights.efficiencyScore || Math.round((stats.totalTime / (stats.totalCommutes * 45)) * 100) || 0}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Efficiency Score</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {agentInsights.carbonSaved || stats.totalCarbon.toFixed(0) || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">kg CO₂ Saved</div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentInsights.recommendations?.slice(0, 4).map((rec, idx) => {
              const icons = [TrendingUp, Clock, DollarSign, Leaf];
              const colors = [
                "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
                "text-purple-600 dark:bg-purple-900/30 bg-purple-100",
                "text-green-600 bg-green-100 dark:bg-green-900/30",
                "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
              ];
              const Icon = icons[idx % icons.length];
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 hover:shadow-md transition-shadow border border-indigo-100 dark:border-indigo-800"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colors[idx % colors.length]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
                          {idx === 0 ? '💰 Savings Tip' : idx === 1 ? '⏱️ Time Saver' : idx === 2 ? '💵 Cost Cut' : '🌱 Eco Boost'}
                        </span>
                        <Badge variant="secondary" className="text-xs">Insight {idx + 1}</Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{rec}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={85 - idx * 15} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-400">{85 - idx * 15}% impact</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="gap-2 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
              <Sparkles className="h-4 w-4" />
              Get More Insights
            </Button>
          </div>
        </motion.div>
      )}

      {/* Route Comparison Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 py-0">
          {/* Gradient Header */}
          <div className="bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <GitBranch className="h-6 w-6" />
                  Route Comparison
                </h2>
                <p className="text-emerald-100 mt-1">Compare different transport modes for your commute</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowLeftRight className="h-3 w-3 mr-1" />
                  Compare Modes
                </Badge>
                <Badge className="bg-white text-emerald-700 border-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Smart Selection
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Route Mode Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { mode: 'Car', icon: Car, color: 'bg-blue-500', time: '25 min', cost: '$8.50', carbon: '4.2 kg', best: false },
                { mode: 'Bus', icon: Bus, color: 'bg-orange-500', time: '45 min', cost: '$2.00', carbon: '1.8 kg', best: false },
                { mode: 'Train', icon: Train, color: 'bg-purple-500', time: '30 min', cost: '$3.50', carbon: '1.2 kg', best: false },
                { mode: 'Metro', icon: TramFront, color: 'bg-red-500', time: '28 min', cost: '$2.50', carbon: '1.0 kg', best: true },
                { mode: 'Walk', icon: Footprints, color: 'bg-green-500', time: '60 min', cost: '$0.00', carbon: '0 kg', best: false },
                { mode: 'Mixed', icon: GitBranch, color: 'bg-indigo-500', time: '35 min', cost: '$4.00', carbon: '1.5 kg', best: false },
              ].map((route, idx) => (
                <motion.div
                  key={route.mode}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                    route.best 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
                >
                  {route.best && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-emerald-500 text-white border-0 text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Best
                      </Badge>
                    </div>
                  )}
                  <div className={`p-2 rounded-lg ${route.color} w-fit mb-3`}>
                    <route.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{route.mode}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{route.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{route.cost}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{route.carbon}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Comparison Summary */}
            <div className="mt-6 p-4 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cheapest</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Walk - $0.00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fastest</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Car - 25 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Eco-Friendly</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Walk - 0 kg</p>
                    </div>
                  </div>
                </div>
                <Link to="/plan">
                  <Button className="gap-2 bg-linear-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                    <MapPin className="h-4 w-4" />
                    Plan Your Route
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity with Agent Badges */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Recent Activity
                {recentRoutes.length > 0 && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </CardTitle>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : recentRoutes.length > 0 ? (
              <div className="space-y-4">
                {recentRoutes.map((route, idx) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg group-hover:scale-110 transition-transform">
                        <MapPin className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {route.source} → {route.destination}
                          {route.agent_processed && (
                            <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                              <Brain className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(route.travel_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(route.min_cost || 0)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {route.options_count || 0} options
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-gray-400 dark:text-gray-500 h-12 w-12 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No recent routes found</p>
                <Link to="/plan">
                  <Button>Plan Your First Commute</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity with Progress */}
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Weekly Activity
              {userAnalytics?.weeklyActivity?.length > 0 && (
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round(userAnalytics.weeklyActivity.reduce((sum, day) => sum + day.count, 0) / 7)} avg
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48" />
            ) : userAnalytics?.weeklyActivity?.length > 0 ? (
              <div className="space-y-4">
                {userAnalytics.weeklyActivity.map((day, idx) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day.slice(0, 3)}</span>
                      <span className="text-gray-600 dark:text-gray-400">{day.count} trips</span>
                    </div>
                    <Progress 
                      value={(day.count / 10) * 100} 
                      className="h-2"
                    />
                  </motion.div>
                ))}

                {/* Achievement Badge */}
                {stats.totalCommutes > 50 && (
                  <div className="mt-6 p-3 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Achievement Unlocked!</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">50+ commutes - Commute Master</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 dark:text-gray-500 h-12 w-12 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No activity data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route Visualization */}
      {recentRoutes[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RouteVisualization route={recentRoutes[0]} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;