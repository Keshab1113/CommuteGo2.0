// frontend/src/components/commute/AgentRouteCard.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
    Car, Bus, Train, TramFront, Footprints, GitBranch,
    Clock, DollarSign, Leaf, Award, Sparkles, ChevronDown,
    TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';
import { useSaveHistory } from '../../hooks/useCommuteQueries';

const modeConfig = {
    cab: { icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-50', name: 'Taxi/Cab' },
    bus: { icon: Bus, color: 'text-green-600', bgColor: 'bg-green-50', name: 'Bus' },
    train: { icon: Train, color: 'text-purple-600', bgColor: 'bg-purple-50', name: 'Train' },
    metro: { icon: TramFront, color: 'text-pink-600', bgColor: 'bg-pink-50', name: 'Metro' },
    walk: { icon: Footprints, color: 'text-yellow-600', bgColor: 'bg-yellow-50', name: 'Walk' },
    mixed: { icon: GitBranch, color: 'text-indigo-600', bgColor: 'bg-indigo-50', name: 'Mixed' }
};

const AgentRouteCard = ({ option, rank, insights }) => {
    const [expanded, setExpanded] = useState(false);
    const saveHistoryMutation = useSaveHistory();
    
    const config = modeConfig[option.mode] || modeConfig.mixed;
    const ModeIcon = config.icon;
    
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    
    const getRankBadge = () => {
        if (rank === 1) {
            return (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Award className="h-3 w-3 mr-1" />
                    Top Pick
                </Badge>
            );
        }
        return (
            <Badge variant="outline">
                #{rank} Choice
            </Badge>
        );
    };
    
    const getAgentConfidenceColor = () => {
        if (option.agent_confidence >= 0.9) return 'text-green-600';
        if (option.agent_confidence >= 0.7) return 'text-yellow-600';
        return 'text-orange-600';
    };
    
    const handleSelect = () => {
        saveHistoryMutation.mutate({
            routeOptionId: option.id,
            travelledOn: new Date().toISOString()
        });
    };
    
    return (
        <Card className={`border-2 transition-all hover:shadow-lg ${
            rank === 1 ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200'
        }`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${config.bgColor}`}>
                            <ModeIcon className={`h-8 w-8 ${config.color}`} />
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold">{config.name}</h3>
                                {getRankBadge()}
                                {option.score > 0.8 && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Agent's Choice
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-6 mb-2">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{formatTime(option.totalTime)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{formatCurrency(option.totalCost)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Leaf className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{option.carbonKg.toFixed(1)} kg CO₂</span>
                                </div>
                            </div>
                            
                            {/* Agent Insights */}
                            {insights && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {insights.timeReliability}% reliable
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        <Brain className="h-3 w-3 mr-1" />
                                        Confidence: {option.agent_confidence || 0.85}
                                    </Badge>
                                </div>
                            )}
                            
                            {/* Agent Confidence Bar */}
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-500">Agent Confidence</span>
                                    <span className={getAgentConfidenceColor()}>
                                        {Math.round((option.agent_confidence || 0.85) * 100)}%
                                    </span>
                                </div>
                                <Progress 
                                    value={(option.agent_confidence || 0.85) * 100} 
                                    className="h-1.5"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <Button onClick={handleSelect} size="sm">
                        Select
                    </Button>
                </div>
                
                {/* Expandable Details */}
                {option.insights && option.insights.length > 0 && (
                    <div className="mt-4">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                        >
                            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                            {expanded ? 'Hide' : 'Show'} agent insights
                        </button>
                        
                        {expanded && (
                            <div className="mt-3 space-y-2">
                                {option.insights.map((insight, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                                        <span className="text-lg">{insight.icon || '💡'}</span>
                                        <div>
                                            <p className="text-sm font-medium">{insight.message}</p>
                                            {insight.detail && (
                                                <p className="text-xs text-gray-500">{insight.detail}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AgentRouteCard;