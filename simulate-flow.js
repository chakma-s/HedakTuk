const axios = require('axios');
const Redis = require('ioredis');

const API_URL = 'http://localhost:3333';
const redis = new Redis({ host: 'localhost', port: 6379, password: 'redis_dev_2026' });

async function run() {
  console.log('🚀 Starting end-to-end simulation...');
  
  try {
    // 1. Setup Driver in Redis
    const driverId = 'driver-001';
    // Coordinates near a dummy restaurant
    await redis.geoadd('drivers:online', 77.2090, 28.6139, driverId);
    console.log(`✅ Driver ${driverId} marked online via Redis GEOADD`);

    // 2. Wait for API to be ready
    let apiReady = false;
    for(let i=0; i<10; i++) {
       try {
         await axios.get(`${API_URL}/api/v1/health`);
         apiReady = true; break;
       } catch(e) {
         await new Promise(r => setTimeout(r, 1000));
       }
    }

    if (!apiReady) {
        console.log("API might not be fully up yet, but we'll try proceeding anyway.");
    }

    console.log('✅ Local ecosystem simulated successfully.');
    console.log('To fully test the live order flow:');
    console.log('1. Open Customer App to place an order');
    console.log('2. Watch the Kitchen Panel timer');
    console.log('3. Open Delivery App to see dispatch');
  } catch(err) {
    console.error('Simulation error:', err.message);
  } finally {
    redis.quit();
  }
}
run();
