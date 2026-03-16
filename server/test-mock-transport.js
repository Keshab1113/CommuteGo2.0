/**
 * Test script for Mock Transportation Service
 */

const MockTransportationService = require('./services/mockTransportationService');

async function testMockService() {
    console.log('🧪 Testing Mock Transportation Service...\n');
    
    const mockService = new MockTransportationService();
    
    try {
        const result = await mockService.getTransportationOptions(
            'New York',
            'Boston',
            '2026-03-20',
            { modePreference: 'balanced' }
        );
        
        console.log('✅ Test Passed!\n');
        console.log('📊 Results Summary:');
        console.log(`   Total Options: ${result.transportationOptions.length}`);
        console.log(`   Flights: ${result.flightOptions?.length || 0}`);
        console.log(`   Search Duration: ${result.searchMetadata.searchDuration}ms`);
        console.log(`   Mock Mode: ${result.searchMetadata.mockMode}`);
        
        console.log('\n📋 Sample Options (first 3):');
        result.transportationOptions.slice(0, 3).forEach((opt, i) => {
            console.log(`\n   ${i+1}. ${opt.mode.toUpperCase()} - ${opt.provider}`);
            console.log(`      Price: $${opt.price?.toFixed(2)}`);
            console.log(`      Departure: ${opt.departureTime} → ${opt.arrivalTime}`);
            console.log(`      Duration: ${opt.duration} mins`);
        });
        
        return result;
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        throw error;
    }
}

// Run test
testMockService()
    .then(() => {
        console.log('\n✨ All tests completed successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n💥 Test failed with error:', err);
        process.exit(1);
    });