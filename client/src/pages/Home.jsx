// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
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
  Users,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  ArrowRight,
  AlertCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../hooks/use-toast";
import { Globe3D } from "@/components/ui/3d-globe";

const sampleMarkers = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  },
];

const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
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
      const [routesResponse, historyResponse, analyticsResponse] =
        await Promise.all([
          commuteAPI.getRoutes(3),
          commuteAPI.getHistory(5),
          analyticsAPI.getUserAnalytics(),
        ]);

      setRecentRoutes(routesResponse.data);
      setUserAnalytics(analyticsResponse.data);

      // Calculate stats from analytics
      if (analyticsResponse.data) {
        setStats({
          totalSaved: analyticsResponse.data.savings?.totalSaved || 0,
          totalTime: analyticsResponse.data.totalCommutes * 30, // Estimate
          totalCarbon: analyticsResponse.data.totalCommutes * 2, // Estimate
          totalCommutes: analyticsResponse.data.totalCommutes || 0,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-[#ffffff] text-white">
          <div className="container mx-auto px-4 py-20 flex w-full gap-10">
            <div className="max-w-3xl">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#1d1d1d]">
                  Smart Commute Planning Made Simple
                </h1>
                <p className="text-xl text-[#1d1d1d] mb-8">
                  CommuteGo helps you optimize your daily commute by comparing
                  multiple transport modes, calculating costs, and tracking your
                  environmental impact.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-[#1d1d1d] text-[#fff] cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/plan">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#1d1d1d] border text-[#1d1d1d] hover:bg-white/10 cursor-pointer"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className=" rounded-lg p-8 flex items-center justify-center h-96 w-full">
              <Globe3D
                markers={sampleMarkers}
                config={{
                  atmosphereColor: "#4da6ff",
                  atmosphereIntensity: 20,
                  bumpScale: 5,
                  autoRotateSpeed: 0.3,
                }}
                onMarkerClick={(marker) => {
                  console.log("Clicked marker:", marker.label);
                }}
                onMarkerHover={(marker) => {
                  if (marker) {
                    console.log("Hovering:", marker.label);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CommuteGo?</h2>
            <p className="text-gray-600 text-lg">
              Intelligent routing that puts you in control of your commute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-blue-600 h-6 w-6" />
                </div>
                <CardTitle>Time Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find the fastest routes based on real-time traffic patterns
                  and historical data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="text-green-600 h-6 w-6" />
                </div>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compare costs across different transportation modes to save
                  money daily.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="text-emerald-600 h-6 w-6" />
                </div>
                <CardTitle>Eco-Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reduce your carbon footprint with sustainable route
                  recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-[#0A0A0A] text-[#FFFFFF] text-primary-foreground rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to optimize your commute?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Start planning smarter routes today and save time, money, and the
              environment.
            </p>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="primary"
                className="text-[#0A0A0A] bg-[#FFFFFF]"
              >
                Register Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-primary-600">{user.name}!</span>
          </h1>
          <p className="text-gray-600">
            Here's your commute overview and recent activity.
          </p>
        </div>
        <Link to="/plan">
          <Button className="gap-2">
            <MapPin className="h-4 w-4" />
            Plan New Commute
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
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
              className="border-l-4 border-l-green-500"
            />

            <StatsCard
              title="Time Optimized"
              value={formatTime(stats.totalTime)}
              icon={Clock}
              trend={{ direction: "up", value: "8%", label: "efficiency" }}
              className="border-l-4 border-l-blue-500"
            />

            <StatsCard
              title="Carbon Reduced"
              value={`${stats.totalCarbon.toFixed(1)} kg`}
              icon={Leaf}
              description="CO₂ emissions saved"
              className="border-l-4 border-l-emerald-500"
            />

            <StatsCard
              title="Total Commutes"
              value={stats.totalCommutes}
              icon={BarChart3}
              trend={{ direction: "up", value: "15%", label: "this month" }}
              className="border-l-4 border-l-purple-500"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
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
                {recentRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <MapPin className="text-primary-600 h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {route.source} → {route.destination}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(route.travel_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(route.min_cost || 0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {route.options_count || 0} options
                      </p>
                    </div>
                  </div>
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

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48" />
            ) : userAnalytics?.weeklyActivity?.length > 0 ? (
              <div className="space-y-3">
                {userAnalytics.weeklyActivity.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">
                      {day.day.slice(0, 3)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((day.count / 10) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-6 text-right">
                        {day.count}
                      </span>
                    </div>
                  </div>
                ))}
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
      {recentRoutes[0] && <RouteVisualization route={recentRoutes[0]} />}
    </div>
  );
};

export default Home;
