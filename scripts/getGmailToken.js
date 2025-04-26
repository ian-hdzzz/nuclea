const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:4002/auth/google/callback'
);

// Generate the url that will be used for authorization
const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send']
});

console.log('Authorize this app by visiting this url:', authorizeUrl);

// After you get the code from the URL, run this script again with the code as an argument
if (process.argv[2]) {
    oauth2Client.getToken(process.argv[2]).then(({ tokens }) => {
        console.log('Refresh token:', tokens.refresh_token);
        console.log('Add this refresh token to your .env file as GMAIL_REFRESH_TOKEN');
    }).catch(console.error);
}