// Node.js example of verifying reCAPTCHA tokens using a service account
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const readline = require('readline');

// Replace these with your actual values
const PROJECT_ID = '{{_project_id_ }}';
const SITE_KEY = '{{_site_key_id_ }}';
const SERVICE_ACCOUNT_KEY_PATH = './service-account-key.json';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Verify a reCAPTCHA token using a service account for authentication
 * @param {string} token The reCAPTCHA token to verify
 * @returns {Promise<object>} The verification response
 */
async function verifyRecaptchaWithServiceAccount(token) {
  try {
    console.log(`Token length: ${token.length} characters`);
    console.log(`First 20 chars: ${token.substring(0, 20)}...`);
    
    // Create a Google Auth client with the service account credentials
    const auth = new GoogleAuth({
      keyFilename: SERVICE_ACCOUNT_KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Get an access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    console.log('Successfully obtained access token');

    // Create the assessment request
    const requestData = {
      event: {
        token: token,
        siteKey: SITE_KEY,
        // Adding expected action to see if it helps
        expectedAction: 'login'
      }
    };

    console.log('Sending request to reCAPTCHA API with data:', JSON.stringify(requestData, null, 2));

    // Verify the reCAPTCHA token
    const response = await axios({
      method: 'post',
      url: `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments`,
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      data: requestData
    });

    return response.data;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:');
    if (error.response) {
      // The request was made and the server responded with a non-2xx status code
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

/**
 * Example usage: Verify a token and check if it's valid
 */
async function testRecaptchaVerification() {
  rl.question('Paste the reCAPTCHA token from your test page: ', async (token) => {
    try {
      console.log('Verifying reCAPTCHA token...');
      const assessment = await verifyRecaptchaWithServiceAccount(token);
      
      console.log('\n--- Assessment Results ---');
      console.log(JSON.stringify(assessment, null, 2));
      
      // Check if the token is valid
      if (assessment.tokenProperties && assessment.tokenProperties.valid) {
        console.log('\n✅ Token is valid!');
        console.log(`Score: ${assessment.riskAnalysis.score}`);
        console.log(`Action: ${assessment.tokenProperties.action}`);
        console.log(`Hostname: ${assessment.tokenProperties.hostname}`);
        console.log(`Create Time: ${assessment.tokenProperties.createTime}`);
      } else {
        console.log('\n❌ Token is invalid!');
        if (assessment.tokenProperties) {
          console.log(`Invalid reason: ${assessment.tokenProperties.invalidReason}`);
          console.log('\nPossible reasons for this error:');
          console.log('1. The token has expired (tokens are typically valid for 2 minutes)');
          console.log('2. The site key is not properly configured for the domain');
          console.log('3. The reCAPTCHA Enterprise API may not be properly enabled');
          console.log('4. The service account may not have proper permissions');
        }
      }
    } catch (error) {
      console.error('Test failed:', error.message);
    } finally {
      rl.close();
    }
  });
}

// Run the test
testRecaptchaVerification();