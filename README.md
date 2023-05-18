#### TULIPS

### Dependencies

dotenv ( accessing .env file variables )
express ( routing )
compression ( handles gzip/deflate compression for responses )
helmet ( set security headers )
cors ( Content Origin Security )
xss-shield ( request body sanitization middleware )
http ( server )
ejs ( page templates )
nodemailer ( sending emails )
socket.io ( user communication )
uuid
@google-cloud/translate

### DevDependencies

nodemon

## WEBSOCKETS

# socket.io (server-side)

npm i socket.io

# socket.io (cleint-side)

import io from 'socket.io-client';

# Heroku Deployment Steps

- have a github repository set up
- make sure code is added to repository
  $ git init
  $ git remote add origin git@github.com:Altycon/Tulips.git
  $ git add .
  $ git commit -m "first commit"
  $ git branch -M main
  $ git push -u origin main
  $ Enter passphrase for key ... (Make sure to set up an SSL key with git hub) <-- someday I'll make notes of how it was done...

- create a heroku account
- download heroku CLI
  $ curl https://cli-assets.heroku.com/install.sh | sh   <-- linux
- login into Heroku from comman line
  $ heroku login
- add heroku remote to github
  $ heroku git:remote -a app-name



# RESOURCES

- express
  - 1: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs

- mongoose 
schemas: https://github.com/Automattic/mongoose/blob/master/examples/schema/schema.js

- express-session https://www.npmjs.com/package/express-session
'sameSite' property: https://datatracker.ietf.org/doc/html/draft-west-cookie-incrementalism-01

- connect-mongo https://www.npmjs.com/package/connect-mongo

- socket.io
website: https://socket.io/

-websocket, signaling server, and webrtc
video: https://www.youtube.com/watch?v=FrsI6xnz1LY&list=PL34gl7XmgyxT4p6-nMgddxdl18S1Xpczr&index=21
code: https://github.com/engineering123semester/WebRTC_Chat_Room/blob/main/Scripts/chatapp.js

-WebRTC
video: https://www.youtube.com/watch?v=QsH8FL0952k&t=3467s
code: https://github.com/divanov11/PeerChat/blob/master/main.js
 
-Google Translate
video: https://www.youtube.com/watch?v=Sjl9ilOpHG8
code: https://github.com/RajKKapadia/Google_Translate_Youtube_Demo/blob/main/google_translate_demo.js

- html emoticon point codes
website: https://unicode.org/emoji/charts/full-emoji-list.html

- google translate languages
website: https://cloud.google.com/translate/docs/languages

...I am missing so many resources that I wish I would have recorded...
