# npm modules required 

npm i express dotenv mongoose jsonwebtokens bcryptjs bcrypt cookie-parser crypto nodemon nodemailer body-parser ejs <br/>

USAGES:  <br/>
express:framework for efficient routing  <br/>
nodemone:for live reload  <br/>
mongoose:database connection and data models  <br/>
jsonwebtokens:for generating Access Tokens  <br/>
cookie-parser:pasring of accesstoken sent as cookie  <br/>
body-parser:put the form data in req.body conviniently <br/>
bcrypt:hashing of passwords and otps before storing in database  <br/>
crypto:generation of otps(4-digits)  <br/>
nodemailer:sending emails for confirmation, otp and warnings  <br/>


# .env setup

PORT=any port free on your localhost  <br/>
DEV_STATE=put 'production' or 'deployement' based on scenario, 'production' sets the tokens to secure:true
DB=mongoose database url  <br/>
ACCESS_TOKEN_SECRET=secret key required for generation and breaking of access token  <br/>
ACCESS_TOKEN_EXPIRY=how long you want the user to stay logged in(i kept 7d)  <br/>
EMAIL=a valid working email for sending emails  <br/>
EMAIL_PASSWORD=password of the above email  <br/>
the .env file must be in the same directory as the server.js


# how to start?

after installing all the dependcies, open the directory in which there is the server.js file. Then do a npm start. This starts the server in the http://localhost:PORT or http://127.0.0.1:PORT, PORT being the value given in the .env file


# about the website

•User can create an account with a unique email and username. They receive a welcome email if their email is valid. <br/>
•Then Users can go and login.<br/>
•If a user forgets the password, they can make a forget password request. However this works only if the verified the registered email after first login<br/>
•Once successfully loggedin, user is rediected to the dashboard and receives a accesstoken cookie. The accessTOken is valid for process.env.ACCESS_TOKEN_EXPIRY time frame after which the user automatically logs out<br/>
•User can manually logOut as well from the navbar option. This clears the cookie <br/>
•In the dashboard, the user is shown the latest posted questions. User can view the questions by clicking on the question card<br/>
•The upvotes on the questions and the unique views on the question along with the date it was posted are also displaye <br/>
•Users can post questions by filling the form in the bottom of the dashboard <br/>
•Users can also post answers to a question in the question card <br/>
•User can delete their own questions and answers from the profile page<br/>


# api guide

api/user/signup -> POST : Providing a username, password , email is required <br/>
api/user/login -> POST : Providing a valid username and password is required <br/>
api/user/logout -> POST : a protected route so make sure there the accessToken cookie is present <br/>
api/user/dashboard -> GET  <br/>
api/user/forgot-password -> POST : provide a valid username is required, will not work if the account is not verified<br/>
api/user/forgot-password/otp-check -> POST : provide only the OTP, make sure to put username in a header <br/>
api/user/forgot-password/reset-password -> POST : provide a newPassword, keep the username header  <br/>

*All the below routes are protected so make sure the access token cookie is present* <br/>
api/profile -> GET <br/>
api/profile/email-verify -> GET <br/>
api/profile/email-verify -> POST : Provide a valid otp<br/>
api/profile/:qid/del-question -> DELETE <br/>
api/profile/:qid/:cid/del-answer -> DELETE <br/>

api/question/:qid -> GET <br/>
api/question/:qid/add-answer -> POST <br/>
api/question/:qid/upvote-question -> POST <br/>
api/question/:qid/upvote-answer/:cid -> POST <br/>
api/question/add-question -> POST <br/>



