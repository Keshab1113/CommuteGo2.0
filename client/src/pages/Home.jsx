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
  Award
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
          analyticsAPI.getUserAnalytics(),
          analyticsAPI.getAgentInsights()
        ]);

      if (routesResponse.status === 'fulfilled') {
        setRecentRoutes(routesResponse.value.data);
      }
      
      if (analyticsResponse.status === 'fulfilled') {
        setUserAnalytics(analyticsResponse.value.data);
        
        if (analyticsResponse.value.data) {
          setStats({
            totalSaved: analyticsResponse.value.data.savings?.totalSaved || 0,
            totalTime: analyticsResponse.value.data.totalCommutes * 30,
            totalCarbon: analyticsResponse.value.data.totalCommutes * 2,
            totalCommutes: analyticsResponse.value.data.totalCommutes || 0,
          });
        }
      }
      
      if (insightsResponse.status === 'fulfilled') {
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
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            Welcome back, <span className="text-primary-600">{user?.name}!</span>
            {agentInsights && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                <Brain className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">
            Here's your AI-generated commute overview and insights
          </p>
        </div>
        <Link to="/plan">
          <Button className="gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
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

      {/* AI Insights Panel */}
      {agentInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold">AI Agent Insights</h3>
            <Badge variant="outline" className="ml-auto bg-white">
              Updated just now
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentInsights.recommendations?.slice(0, 4).map((rec, idx) => (
              <div key={idx} className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-1">
                  <Sparkles className="h-4 w-4" />
                  Recommendation {idx + 1}
                </div>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity with Agent Badges */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Recent Activity
                {recentRoutes.length > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
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
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary-50 rounded-lg group-hover:scale-110 transition-transform">
                        <MapPin className="text-primary-600 h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {route.source} → {route.destination}
                          {route.agent_processed && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                              <Brain className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(route.travel_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {formatCurrency(route.min_cost || 0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {route.options_count || 0} options
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-gray-400 h-12 w-12 mb-3" />
                <p className="text-gray-500 mb-4">No recent routes found</p>
                <Link to="/plan">
                  <Button>Plan Your First Commute</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity with Progress */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Weekly Activity
              {userAnalytics?.weeklyActivity?.length > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
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
                      <span className="text-gray-600">{day.count} trips</span>
                    </div>
                    <Progress 
                      value={(day.count / 10) * 100} 
                      className="h-2"
                    />
                  </motion.div>
                ))}

                {/* Achievement Badge */}
                {stats.totalCommutes > 50 && (
                  <div className="mt-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Achievement Unlocked!</p>
                        <p className="text-xs text-yellow-600">50+ commutes - Commute Master</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 h-12 w-12 mb-3" />
                <p className="text-gray-500">No activity data available</p>
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