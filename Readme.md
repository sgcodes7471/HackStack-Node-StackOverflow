# npm modules required 

npm i express dotenv mongoose jsonwebtokens bcrypt cookie-parser crypto nodemon

USAGES:
express:framework for efficient routing
mongoose:database connection and data models
jsonwebtokens:for generating Access Tokens
cookie-parser:pasring of accesstoken sent as cookie
bcrypt:hashing of passwords and otps before storing in database
crypto:generation of otps(4-digits)


# .env setup

PORT=any port free on your localhost
DB=mongoose database url
ACCESS_TOKEN_SECRET=secret key required for generation and breaking of access token
ACCESS_TOKEN_EXPIRY=how long you want the user to stay logged in(i wanted 7d)
EMAIL=a valid working email for sending emails
EMAIL_PASSWORD=password of the above email


