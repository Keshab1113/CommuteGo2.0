// frontend/src/components/commute/RouteCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Car, 
  Bus, 
  Train, 
  TramFront , 
  Footprints, 
  GitBranch,
  Clock,
  DollarSign,
  Leaf,
  Award,
  ChevronRight
} from 'lucide-react';

const modeConfig = {
  cab: { icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  bus: { icon: Bus, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  train: { icon: Train, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  metro: { icon: TramFront , color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  walk: { icon: Footprints, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  mixed: { icon: GitBranch, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' }
};

const RouteCard = ({ option, onSelect, compact = false }) => {
  const config = modeConfig[option.mode] || modeConfig.mixed;
  const ModeIcon = config.icon;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCost = (cost) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cost);
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(option)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <ModeIcon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div>
                <h4 className="font-medium capitalize">
                  {option.mode === 'cab' ? 'Taxi/Cab' : 
                   option.mode === 'metro' ? 'Subway/Metro' : option.mode}
                </h4>
                <p className="text-sm text-gray-500">
                  {option.distanceKm?.toFixed(1) || '0.0'} km
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatCost(option.totalCost)}</div>
              <div className="text-sm text-gray-500">{formatTime(option.totalTime)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${config.borderColor} hover:shadow-lg transition-all`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${config.bgColor}`}>
              <ModeIcon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg capitalize">
                {option.mode === 'cab' ? 'Taxi/Cab' : 
                 option.mode === 'metro' ? 'Subway/Metro' : option.mode}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {option.distanceKm?.toFixed(1) || '0.0'} km • {option.steps?.length || 1} steps
              </p>
            </div>
          </div>
          
          <Button onClick={() => onSelect(option)} className="gap-2">
            Select Route
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Time */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg">
              <Clock className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Travel Time</p>
              <p className="font-semibold text-lg">{formatTime(option.totalTime)}</p>
              {option.rankFastest === 1 && (
                <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  Fastest
                </Badge>
              )}
            </div>
          </div>

          {/* Cost */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg">
              <DollarSign className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="font-semibold text-lg">{formatCost(option.totalCost)}</p>
              {option.rankCheapest === 1 && (
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                  <Award className="h-3 w-3 mr-1" />
                  Cheapest
                </Badge>
              )}
            </div>
          </div>

          {/* Carbon */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg">
              <Leaf className="text-gray-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Carbon Footprint</p>
              <p className="font-semibold text-lg">{option.carbonKg.toFixed(1)} kg CO₂</p>
              {option.rankEco === 1 && (
                <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Award className="h-3 w-3 mr-1" />
                  Greenest
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Steps */}
        {option.steps && option.steps.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Route Steps</h4>
            <div className="space-y-2">
              {option.steps.map((step, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium capitalize">{step.mode}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-gray-600">{step.from} to {step.to}</span>
                  </div>
                  <div className="text-gray-500">
                    {step.duration}m • {step.distance}km
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteCard;