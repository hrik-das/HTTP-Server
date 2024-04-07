const net = require("net");
const fs = require("fs");
const path = require("path");

console.log("Logs from your program will appear here!");

let directory = ".";
const directoryIndex = process.argv.indexOf("--directory");
if(directoryIndex !== -1){
    directory = process.argv[directoryIndex + 1];
} 

const handleConnection = (socket) => {
    socket.on("data", (data) => {
        const [request, host, agent] = data.toString().split("\r\n");
        const [method, path, version] = request.split(" ");

        switch (method) {
            case "GET": handleGetRequest(socket, path, agent);
                        break;
            case "POST": handlePostRequest(socket, path, data);
                         break;
            default: sendResponse(socket, "HTTP/1.1 405 Method Not Allowed\r\n\r\n");
                     socket.end();
                     break;
        }
    });
};

const handleGetRequest = (socket, path, agent) => {
    if (path === "/") {
        sendResponse(socket, "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 12\r\n\r\nHello, World!");
    } else if (path.startsWith("/echo/")) {
        const pathParameter = path.replace("/echo/", "");
        sendResponse(socket, `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${pathParameter.length}\r\n\r\n${pathParameter}`);
    } else if (path.toLowerCase().startsWith("/user-agent")) {
        const userAgent = agent.replace("User-Agent: ", "");
        sendResponse(socket, `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
    } else if (path.startsWith("/files/")) {
        const filePath = directory + "/" + path.slice(7);
        console.log(filePath);
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            sendResponse(socket, "HTTP/1.1 404 Not Found\r\n\r\n");
            socket.end();
            return;
        }
        const file = fs.readFileSync(filePath);
        sendResponse(socket, `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`);
    } else {
        sendResponse(socket, "HTTP/1.1 404 Not Found\r\n\r\n");
        socket.end();
    }
};

const handlePostRequest = (socket, path, requestData) => {
    if (path.startsWith("/files/") && path.length > 7) {
        const fileName = directory + "/" + path.substring(7);
        const req = requestData.toString().split("\r\n");
        const body = req[req.length - 1];
        fs.writeFileSync(fileName, body);
        sendResponse(socket, "HTTP/1.1 201 Created\r\n\r\n");
    } else {
        sendResponse(socket, "HTTP/1.1 404 Not Found\r\n\r\n");
        socket.end();
    }
};

const sendResponse = (socket, response) => {
    socket.write(response);
    console.log("Sent response:", response);
};

const server = net.createServer((socket) => {
    handleConnection(socket);
});

server.listen(4221, "localhost");

process.on("SIGINT", () => {
    console.log("Server shutting down...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});