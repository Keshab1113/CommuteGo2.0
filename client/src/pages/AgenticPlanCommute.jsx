// frontend/src/pages/AgenticPlanCommute.jsx
import React, { useState, useEffect } from 'react';
import { usePlanCommute, useRouteOptions } from '../hooks/useCommuteQueries';
import { useAlerts } from '../hooks/useAlertQueries';
import { useAnalytics } from '../hooks/useAnalyticsQueries';
import AgentRouteCard from '../components/commute/AgentRouteCard';
import AgentInsights from '../components/commute/AgentInsights';
import AgentLoading from '../components/ui/AgentLoading';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../hooks/use-toast';
import {
    MapPin,
    Calendar,
    Clock,
    Search,
    Loader2,
    Sparkles,
    Brain,
    TrendingUp,
    DollarSign,
    Leaf,
    AlertCircle
} from 'lucide-react';

const AgenticPlanCommute = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        travelDate: new Date().toISOString().split('T')[0],
        travelTime: '08:00',
        preferences: {
            modePreference: 'balanced',
            maxCost: 50,
            maxTime: 120,
            ecoOnly: false
        }
    });
    
    const [plannedRouteId, setPlannedRouteId] = useState(null);
    
    const planCommuteMutation = usePlanCommute();
    const { data: routeOptions, isLoading: optionsLoading } = useRouteOptions(plannedRouteId);
    const { data: alerts } = useAlerts({ enabled: !!plannedRouteId });
    const { data: agentInsights } = useAnalytics({ enabled: !!plannedRouteId });
    
    const handlePlanCommute = async (e) => {
        e.preventDefault();
        
        const travelDateTime = `${formData.travelDate}T${formData.travelTime}`;
        
        planCommuteMutation.mutate({
            ...formData,
            travelDate: travelDateTime
        }, {
            onSuccess: (response) => {
                setPlannedRouteId(response.data.route.id);
                toast({
                    title: "🤖 Agents at Work",
                    description: "Our AI agents are optimizing your route options",
                });
            }
        });
    };
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handlePreferenceChange = (key, value) => {
        setFormData({
            ...formData,
            preferences: {
                ...formData.preferences,
                [key]: value
            }
        });
    };
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Brain className="h-8 w-8 text-primary-600" />
                        Agentic Route Planning
                    </h1>
                    <p className="text-gray-600">
                        Let our AI agents find the optimal route based on time, cost, and sustainability
                    </p>
                </div>
                <Badge variant="outline" className="text-sm py-1 px-3 bg-primary-50">
                    <Sparkles className="h-4 w-4 mr-2 text-primary-600" />
                    AI-Powered
                </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handlePlanCommute} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Starting Point</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            name="source"
                                            placeholder="Enter address"
                                            className="pl-10"
                                            value={formData.source}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Destination</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            name="destination"
                                            placeholder="Enter address"
                                            className="pl-10"
                                            value={formData.destination}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="travelDate"
                                                type="date"
                                                className="pl-10"
                                                value={formData.travelDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="travelTime"
                                                type="time"
                                                className="pl-10"
                                                value={formData.travelTime}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <Brain className="h-4 w-4" />
                                        Agent Preferences
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm">Optimization Goal</Label>
                                            <Tabs 
                                                value={formData.preferences.modePreference} 
                                                onValueChange={(v) => handlePreferenceChange('modePreference', v)}
                                                className="mt-2"
                                            >
                                                <TabsList className="grid grid-cols-4">
                                                    <TabsTrigger value="balanced" className="text-xs">
                                                        Balanced
                                                    </TabsTrigger>
                                                    <TabsTrigger value="fastest" className="text-xs">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Fast
                                                    </TabsTrigger>
                                                    <TabsTrigger value="cheapest" className="text-xs">
                                                        <DollarSign className="h-3 w-3 mr-1" />
                                                        Cheap
                                                    </TabsTrigger>
                                                    <TabsTrigger value="greenest" className="text-xs">
                                                        <Leaf className="h-3 w-3 mr-1" />
                                                        Green
                                                    </TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>
                                        
                                        <div>
                                            <Label className="text-sm">Max Budget: ${formData.preferences.maxCost}</Label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.preferences.maxCost}
                                                onChange={(e) => handlePreferenceChange('maxCost', parseInt(e.target.value))}
                                                className="w-full mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    className="w-full gap-2"
                                    disabled={planCommuteMutation.isLoading}
                                >
                                    {planCommuteMutation.isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Agents Planning...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4" />
                                            Plan with AI Agents
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    
                    {alerts && alerts.length > 0 && (
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                    Agent Alerts
                                </h3>
                                <div className="space-y-2">
                                    {alerts.map(alert => (
                                        <Alert key={alert.id} variant={alert.severity === 'high' ? 'destructive' : 'default'}>
                                            <AlertDescription>{alert.message}</AlertDescription>
                                        </Alert>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                
                {/* Results */}
                <div className="lg:col-span-2">
                    {planCommuteMutation.isLoading && (
                        <Card>
                            <CardContent className="pt-6">
                                <AgentLoading 
                                    message="Our AI agents are working on your route..."
                                    steps={[
                                        "Planning Agent: Analyzing route possibilities",
                                        "Optimization Agent: Calculating optimal routes",
                                        "Analytics Agent: Adding insights",
                                        "Notification Agent: Checking for alerts"
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    )}
                    
                    {routeOptions && (
                        <div className="space-y-6">
                            {/* Agent Insights */}
                            {agentInsights && (
                                <AgentInsights insights={agentInsights} />
                            )}
                            
                            {/* Route Options */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {routeOptions.options.map((option, index) => (
                                            <AgentRouteCard 
                                                key={option.id || index}
                                                option={option}
                                                rank={index + 1}
                                                insights={agentInsights?.routeInsights?.[option.mode]}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    
                    {!planCommuteMutation.isLoading && !routeOptions && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-12">
                                    <Brain className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Ready to Plan?</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Enter your commute details and our AI agents will find the optimal route for you
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgenticPlanCommute;