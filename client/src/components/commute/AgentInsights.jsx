// frontend/src/components/commute/AgentInsights.jsx
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Brain, TrendingUp, Users, Calendar, Clock, AlertCircle } from 'lucide-react';

const AgentInsights = ({ insights }) => {
    if (!insights) return null;
    
    return (
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold">AI Agent Insights</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <TrendingUp className="h-4 w-4" />
                            Best Time to Travel
                        </div>
                        <p className="font-medium">
                            {insights.bestTime || '8:30 AM - 9:30 AM'}
                        </p>
                        <p className="text-xs text-gray-500">
                            Based on historical patterns
                        </p>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Users className="h-4 w-4" />
                            Crowd Prediction
                        </div>
                        <p className="font-medium">
                            {insights.crowdLevel || 'Moderate'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {insights.crowdDetail || 'Expected 65% capacity'}
                        </p>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Calendar className="h-4 w-4" />
                            Day Comparison
                        </div>
                        <p className="font-medium">
                            {insights.dayComparison || '20% faster than Tuesday'}
                        </p>
                        <p className="text-xs text-gray-500">
                            Based on your history
                        </p>
                    </div>
                    
                    <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <AlertCircle className="h-4 w-4" />
                            Agent Confidence
                        </div>
                        <p className="font-medium">
                            {insights.confidence || 'High (92%)'}
                        </p>
                        <p className="text-xs text-gray-500">
                            Based on data quality
                        </p>
                    </div>
                </div>
                
                {insights.recommendations && insights.recommendations.length > 0 && (
                    <div className="mt-4 p-3 bg-primary-100/50 rounded-lg">
                        <p className="text-sm font-medium mb-2">Agent Recommendations:</p>
                        <ul className="space-y-1">
                            {insights.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-primary-600">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AgentInsights;