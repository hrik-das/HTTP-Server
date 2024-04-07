const http = require("http");
// Define the server hostname and port
const hostname = "localhost";
const port = 4221;
// Define the number of concurrent requests
const numRequests = 5;
// Function to send a single request
function sendRequest(){
    const options = {
        hostname: hostname,
        port: port,
        path: "/",
        method: "GET",
    };
    const req = http.request(options, (res) => {
        console.log(`Response status code: ${res.statusCode}`);
        res.on("data", (data) => {
            console.log(`Response body: ${data.toString()}`);
        });
    });
    req.on("error", (error) => {
        console.error(`Error making request: ${error.message}`);
    });
    req.end();
}
// Send multiple requests concurrently
for (let i=0; i<numRequests; i++){
    sendRequest();
}