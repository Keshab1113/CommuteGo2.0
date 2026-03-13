// Test script for Orchestrator.js geocodeAddress fix
// This tests the city coordinates database

// Mock the database
const db = {
  execute: async () => [] // Return empty to force fallback to cityCoords
};

// Mock db module
require.cache[require.resolve('./config/database')] = {
  exports: { default: db, testConnection: async () => {} }
};

// Now require the Orchestrator (it's exported directly, not as named export)
const AgentOrchestrator = require('./agents/Orchestrator');

async function testGeocode() {
  // The geocodeAddress method is in PlanningAgent
  const orchestrator = new AgentOrchestrator();
  const planner = orchestrator.agents.planner;
  
  console.log('Testing geocodeAddress fix...\n');
  
  // Test cases
  const testCases = [
    { address: 'India', expected: 'Delhi (28.6139, 77.2090)' },
    { address: 'London', expected: 'London (51.5074, -0.1278)' },
    { address: 'india', expected: 'Delhi (28.6139, 77.2090)' },
    { address: 'london', expected: 'London (51.5074, -0.1278)' },
    { address: 'New Delhi', expected: 'Delhi (28.6139, 77.2090)' },
    { address: 'Mumbai', expected: 'Mumbai (19.0760, 72.8777)' },
    { address: 'Tokyo', expected: 'Tokyo (35.6762, 139.6503)' },
  ];
  
  for (const test of testCases) {
    const coords = await orchestrator.geocodeAddress(test.address);
    console.log(`Address: "${test.address}"`);
    console.log(`  Result: { lat: ${coords.lat}, lng: ${coords.lng} }`);
    console.log(`  Expected: ${test.expected}`);
    console.log('');
  }
  
  // Test distance calculation
  console.log('Testing haversineDistance (India to London):');
  const indiaCoords = await orchestrator.geocodeAddress('India');
  const londonCoords = await orchestrator.geocodeAddress('London');
  const distance = orchestrator.haversineDistance(
    indiaCoords.lat, indiaCoords.lng,
    londonCoords.lat, londonCoords.lng
  );
  console.log(`  Distance: ${distance.toFixed(2)} km`);
  console.log(`  Expected: ~6700 km (India to London)`);
  
  // Test calculateFallback
  console.log('\nTesting calculateFallback:');
  const fallback = await orchestrator.calculateFallback('India', 'London');
  console.log(`  Fallback distance: ${fallback} km`);
  console.log(`  Expected: ~6700 km (real distance, not 10km!)`);
  
  if (fallback > 100) {
    console.log('\n✅ SUCCESS: Fix is working! Real distance calculated.');
  } else {
    console.log('\n❌ FAILURE: Still returning fallback 10km');
  }
}

testGeocode().catch(console.error);