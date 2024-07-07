# npm modules required 

npm i express dotenv mongoose jsonwebtokens bcrypt cookie-parser crypto nodemon nodemailer body-parser ejs <br/>

USAGES:  <br/>
express:framework for efficient routing  <br/>
nodemone:for live reload  <br/>
mongoose:database connection and data models  <br/>
jsonwebtokens:for generating Access Tokens  <br/>
cookie-parser:pasring of accesstoken sent as cookie  <br/>
bcrypt:hashing of passwords and otps before storing in database  <br/>
crypto:generation of otps(4-digits)  <br/>
nodemailer:sending emails for confirmation, otp and warnings  <br/>


# .env setup

PORT=any port free on your localhost  <br/>
DB=mongoose database url  <br/>
ACCESS_TOKEN_SECRET=secret key required for generation and breaking of access token  <br/>
ACCESS_TOKEN_EXPIRY=how long you want the user to stay logged in(i wanted 7d)  <br/>
EMAIL=a valid working email for sending emails  <br/>
EMAIL_PASSWORD=password of the above email  <br/>
the .env file must be in the same directory as the server.js


# how to start?

after installing all the dependcies, open the directory in which there is the server.js file. Then do a npm start. This starts the server in the http://localhost:PORT or http://127.0.0.1:PORT, PORT being the value given in the .env file


# API Guide

api/user/signup -> POST  <br/>
api/user/login -> POST  <br/>
api/user/logout -> POST  <br/>
api/user/dashboard -> GET  <br/>
api/user/forgot-password -> POST  <br/>
api/user/forgot-password/otp-check -> POST  <br/>
api/user/forgot-password/reset-password -> POST  <br/>

api/profile -> GET <br/>
api/profile/email-verify -> GET <br/>
api/profile/email-verify -> POST <br/>
api/profile/:qid/del-question -> DELETE <br/>
api/profile/:qid/:cid/del-answer -> DELETE <br/>

api/question/:qid -> GET <br/>
api/question/:qid/add-answer -> POST <br/>
api/question/:qid/upvote-question -> POST <br/>
api/question/add-question -> POST <br/>



