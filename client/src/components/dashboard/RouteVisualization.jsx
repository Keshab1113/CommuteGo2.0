// frontend/src/components/dashboard/RouteVisualization.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Car, 
  Bus, 
  Train, 
  TramFront , 
  Footprints, 
  GitBranch,
  ArrowRight
} from 'lucide-react';
import { Progress } from '../ui/progress';

const modeConfig = {
  cab: { icon: Car, color: 'bg-blue-500', name: 'Cab/Taxi' },
  bus: { icon: Bus, color: 'bg-green-500', name: 'Bus' },
  train: { icon: Train, color: 'bg-purple-500', name: 'Train' },
  metro: { icon: TramFront , color: 'bg-pink-500', name: 'Metro' },
  walk: { icon: Footprints, color: 'bg-yellow-500', name: 'Walk' },
  mixed: { icon: GitBranch, color: 'bg-indigo-500', name: 'Mixed' }
};

const RouteVisualization = ({ route }) => {
  if (!route) return null;

  const totalTime = route.options?.reduce((sum, opt) => sum + opt.totalTime, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {route.options?.map((option) => {
            const ModeIcon = modeConfig[option.mode]?.icon;
            const percentage = (option.totalTime / totalTime) * 100;
            
            return (
              <div key={option.mode} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${modeConfig[option.mode]?.color} bg-opacity-10`}>
                      {ModeIcon && <ModeIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{modeConfig[option.mode]?.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>${option.totalCost.toFixed(2)}</span>
                        <span>{option.totalTime} min</span>
                        <span>{option.carbonKg.toFixed(1)} kg CO₂</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {option.rankCheapest === 1 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Cheapest
                      </span>
                    )}
                    {option.rankFastest === 1 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Fastest
                      </span>
                    )}
                    {option.rankEco === 1 && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        Greenest
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteVisualization;