# Testing Commands for HTTP Server

## Stage - 1: 
To Start the Server
./your_server.sh
# OR
npm start

## Stage - 2:
curl -v -X GET http://localhost:4221/

## Stage - 3:
curl -v -X GET http://localhost:4221/scooby/yikes-dumpty

## Stage - 4:
curl -v -X GET http://localhost:4221/echo/yikes/dumpty

## Stage - 5:
curl -A "User-Agent: dumpty/scooby" http://localhost:4221/user-agent

## Stage - 6:
node request.js

## Stage - 7:
curl -v -X GET http://localhost:4221/files/codecrafters.yml -> Should Return the Content of this File
curl -v -X GET http://localhost:4221/files/errorFile.txt -> Not Exists, Should Return an Error

## Stage - 8:
curl -v -X POST http://localhost:4221/files/dumpty_monkey_Monkey_donkey -d 'yikes Horsey 237 scooby donkey 237 237 dumpty'