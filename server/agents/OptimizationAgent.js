// backend/src/agents/OptimizationAgent.js
class OptimizationAgent {
    async calculateOptions(planningResult, preferences) {
        const modes = planningResult.possibleModes;
        const options = [];
        
        for (const mode of modes) {
            const option = await this.generateOption(mode, planningResult, preferences);
            options.push(option);
        }
        
        // Apply multi-objective optimization
        const optimized = this.applyParetoOptimization(options);
        
        // Rank options
        return this.rankOptions(optimized, preferences);
    }

    async generateOption(mode, planningResult, preferences) {
        const baseTime = planningResult.estimatedBaseTime;
        
        // Apply mode-specific factors
        const timeFactor = this.getTimeFactor(mode);
        const costFactor = this.getCostFactor(mode);
        const ecoFactor = this.getEcoFactor(mode);
        
        const option = {
            mode,
            totalTime: Math.round(baseTime * timeFactor),
            totalCost: this.calculateCost(mode, planningResult.distance, baseTime),
            carbonKg: this.calculateCarbon(mode, planningResult.distance),
            distanceKm: planningResult.distance,
            steps: this.generateSteps(mode, planningResult),
            confidence: this.calculateConfidence(mode, planningResult)
        };
        
        // Apply user preferences
        if (preferences) {
            this.applyPreferences(option, preferences);
        }
        
        return option;
    }

    applyParetoOptimization(options) {
        // Pareto frontier optimization for multi-objective trade-offs
        const frontiers = [];
        
        for (let i = 0; i < options.length; i++) {
            let isDominated = false;
            
            for (let j = 0; j < options.length; j++) {
                if (i !== j) {
                    if (this.dominates(options[j], options[i])) {
                        isDominated = true;
                        break;
                    }
                }
            }
            
            if (!isDominated) {
                frontiers.push(options[i]);
            }
        }
        
        return frontiers;
    }

    dominates(optionA, optionB) {
        // Check if optionA dominates optionB in all objectives
        return (
            optionA.totalTime <= optionB.totalTime &&
            optionA.totalCost <= optionB.totalCost &&
            optionA.carbonKg <= optionB.carbonKg &&
            (
                optionA.totalTime < optionB.totalTime ||
                optionA.totalCost < optionB.totalCost ||
                optionA.carbonKg < optionB.carbonKg
            )
        );
    }

    rankOptions(options, preferences) {
        const weights = this.getPreferenceWeights(preferences);
        
        // Normalize values
        const maxTime = Math.max(...options.map(o => o.totalTime));
        const maxCost = Math.max(...options.map(o => o.totalCost));
        const maxCarbon = Math.max(...options.map(o => o.carbonKg));
        
        // Calculate weighted scores
        options.forEach(option => {
            const timeScore = 1 - (option.totalTime / maxTime);
            const costScore = 1 - (option.totalCost / maxCost);
            const carbonScore = 1 - (option.carbonKg / maxCarbon);
            
            option.score = (
                timeScore * weights.time +
                costScore * weights.cost +
                carbonScore * weights.carbon
            );
        });
        
        // Sort by score
        return options.sort((a, b) => b.score - a.score);
    }

    getPreferenceWeights(preferences) {
        const defaultWeights = { time: 0.33, cost: 0.33, carbon: 0.34 };
        
        if (!preferences || !preferences.modePreference) {
            return defaultWeights;
        }
        
        switch (preferences.modePreference) {
            case 'fastest':
                return { time: 0.7, cost: 0.15, carbon: 0.15 };
            case 'cheapest':
                return { time: 0.15, cost: 0.7, carbon: 0.15 };
            case 'greenest':
                return { time: 0.15, cost: 0.15, carbon: 0.7 };
            default:
                return defaultWeights;
        }
    }

    getTimeFactor(mode) {
        const factors = {
            walk: 3.0,
            bus: 1.2,
            train: 0.7,
            metro: 0.8,
            cab: 0.6,
            mixed: 0.9
        };
        return factors[mode] || 1.0;
    }

    calculateCost(mode, distance, time) {
        const rates = {
            walk: 0,
            bus: 2.5 + (distance * 0.1),
            train: 3.0 + (distance * 0.15),
            metro: 2.0 + (distance * 0.12),
            cab: 5.0 + (distance * 1.5) + (time * 0.2),
            mixed: 4.0 + (distance * 0.8)
        };
        return rates[mode] || 5.0;
    }

    calculateCarbon(mode, distance) {
        const emissionFactors = {
            walk: 0,
            bus: 0.089,
            train: 0.041,
            metro: 0.041,
            cab: 0.192,
            mixed: 0.1
        };
        return distance * (emissionFactors[mode] || 0.1);
    }

    calculateConfidence(mode, planningResult) {
        // Confidence based on data availability and historical accuracy
        return 0.85 + (Math.random() * 0.1); // Simplified
    }

    generateSteps(mode, planningResult) {
        // Generate step-by-step directions
        const steps = [];
        
        if (mode === 'mixed') {
            steps.push(
                { mode: 'walk', from: 'Start', to: 'Bus Stop', duration: 5 },
                { mode: 'bus', from: 'Bus Stop', to: 'Train Station', duration: 15 },
                { mode: 'train', from: 'Train Station', to: 'Destination', duration: 20 }
            );
        } else {
            steps.push({
                mode,
                from: 'Start',
                to: 'Destination',
                duration: planningResult.estimatedBaseTime
            });
        }
        
        return steps;
    }

    applyPreferences(option, preferences) {
        // Apply filters like avoidTolls, maxCost, maxTime
        // This is handled by the main agent logic
        return option;
    }
}