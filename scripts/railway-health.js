#!/usr/bin/env node

/**
 * Custom health check script for Railway
 * 
 * This script can be used as a custom health check command in Railway
 * It makes a simple HTTP request to the /api/health endpoint and returns
 * a zero exit code if successful, non-zero otherwise.
 */

const http = require('http');

// Use environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Create a simple HTTP request to check if the API is responding
const req = http.request({
  host: 'localhost',
  port: PORT,
  path: '/api/health',
  method: 'GET',
  timeout: 5000 // 5 second timeout
}, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Health check passed');
      process.exit(0); // Success
    } else {
      console.error(`Health check failed with status ${res.statusCode}: ${data}`);
      process.exit(1); // Failure
    }
  });
});

req.on('error', (err) => {
  console.error('Health check failed:', err.message);
  process.exit(1); // Failure
});

req.on('timeout', () => {
  console.error('Health check timed out');
  req.destroy();
  process.exit(1); // Failure
});

req.end();