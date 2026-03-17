import React from 'react';
import {
  Card,
  CardContent,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Plane,
  Clock,
  MapPin,
  Leaf,
  Star,
  Heart,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

const FlightCard = ({ flight, onSelect, isSelected, minimal = false }) => {
  if (!flight) return null;

  const duration = flight.duration || 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationStr = `${hours}h ${minutes}m`;

  if (minimal) {
    // Minimal version for lists
    return (
      <div
        onClick={onSelect}
        className={`p-3 border rounded-lg cursor-pointer transition ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold dark:text-gray-100 truncate">
                {flight.airline || flight.provider}
              </p>
              {flight.rating && (
                <div className="flex items-center gap-0.5 text-xs text-yellow-600">
                  <Star className="w-3 h-3 fill-yellow-600" />
                  {flight.rating.toFixed(1)}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {flight.departureTime} - {flight.arrivalTime}
            </p>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">
                ${flight.price?.toFixed(0) || '0'}
              </p>
              <p className="text-xs text-gray-500">{durationStr}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  // Full card version
  return (
    <Card
      className={`cursor-pointer transition hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      onClick={onSelect}
    >
      <CardContent className="pt-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-lg dark:text-gray-100">
                {flight.airline || flight.provider}
              </h3>
              {isSelected && (
                <div className="ml-auto flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Selected
                </div>
              )}
            </div>
            {flight.flightNumber && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Flight {flight.flightNumber}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ${flight.price?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Departure</p>
            <p className="font-semibold dark:text-gray-100">{flight.departureTime}</p>
            {flight.departureLocation && (
              <p className="text-xs text-gray-500 mt-1">{flight.departureLocation}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs font-semibold dark:text-gray-100">{durationStr}</p>
              {flight.stops !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </p>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Arrival</p>
            <p className="font-semibold dark:text-gray-100">{flight.arrivalTime}</p>
            {flight.arrivalLocation && (
              <p className="text-xs text-gray-500 mt-1">{flight.arrivalLocation}</p>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {flight.stops === 0 ? (
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200">
              Nonstop
            </Badge>
          ) : flight.stops ? (
            <Badge variant="outline">
              {flight.stops} Stop{flight.stops > 1 ? 's' : ''}
            </Badge>
          ) : null}

          {flight.cabinClass && (
            <Badge variant="outline" className="capitalize">
              {flight.cabinClass}
            </Badge>
          )}

          {flight.rating && flight.rating >= 4.5 && (
            <Badge className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Highly Rated
            </Badge>
          )}
        </div>

        {/* Amenities */}
        {flight.amenities && flight.amenities.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-750 rounded p-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Amenities Included
            </p>
            <div className="flex flex-wrap gap-2">
              {flight.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
              {flight.amenities.length > 3 && (
                <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1">
                  +{flight.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Carbon & Rating */}
        <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm">
            {flight.carbon_kg && (
              <div className="flex items-center gap-1 text-green-600">
                <Leaf className="w-4 h-4" />
                {flight.carbon_kg.toFixed(1)} kg CO₂
              </div>
            )}
            {flight.rating && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-600" />
                {flight.rating.toFixed(1)}/5
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
