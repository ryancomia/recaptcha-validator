# reCAPTCHA Validator

## Installation

Install the required dependencies using npm:

```bash
npm install axios google-auth-library
```

## Preparation

### Prerequisites
1. Create a `service-account-key.json` file with your service account credentials.

### Configuration
- In `recaptcha-test.html`:
  - Replace `{{_site_key_id_}}` with your reCAPTCHA site key

- In `recaptcha-test.js`:
  - Replace `{{_site_key_id_}}` with your reCAPTCHA site key
  - Replace `{{_project_id_}}` with your Google Cloud Platform project ID

## Usage

### Setup Web Server
1. Copy `recaptcha-test.html` to a running Nginx server

### Generate Key
1. generate token from the web-page

### Run Application
Execute the JavaScript application:

```bash
node recaptcha-test.js

paste the generated key from web-page
```

## Dependencies
- [axios](https://github.com/axios/axios): Promise-based HTTP client
- [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs): Google authentication library

## Notes
- Ensure you have Node.js installed
- Have a valid Google Cloud Platform account
- Properly configure reCAPTCHA settings in Google Cloud Console