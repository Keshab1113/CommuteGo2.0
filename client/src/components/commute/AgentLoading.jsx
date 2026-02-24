// frontend/src/components/ui/AgentLoading.jsx
import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, Loader2 } from 'lucide-react';

const AgentLoading = ({ message = "AI agents are working...", steps = [] }) => {
    const [currentStep, setCurrentStep] = useState(0);
    
    useEffect(() => {
        if (steps.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 2000);
        
        return () => clearInterval(interval);
    }, [steps.length]);
    
    return (
        <div className="space-y-6 py-8">
            <div className="flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                        <Brain className="h-10 w-10 text-primary-600 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{message}</h3>
                <p className="text-sm text-gray-500 mb-6">
                    This may take a few moments
                </p>
            </div>
            
            {steps.length > 0 && (
                <div className="max-w-md mx-auto space-y-3">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                                index === currentStep 
                                    ? 'bg-primary-50 border border-primary-200' 
                                    : index < currentStep
                                        ? 'text-gray-500'
                                        : 'text-gray-300'
                            }`}
                        >
                            {index < currentStep ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : index === currentStep ? (
                                <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                            <span className={index === currentStep ? 'font-medium' : ''}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentLoading;