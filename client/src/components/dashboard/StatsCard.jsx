// frontend/src/components/dashboard/StatsCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend = null, 
  className,
  children 
}) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-medium mt-2",
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
            <span className="text-gray-500 ml-1">{trend.label}</span>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default StatsCard;