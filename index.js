const http = require('http');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var stdin = process.openStdin();

rl.question('Who are u? admin/user ', (data) => {
    // TODO: Log the answer in a database
    switch (data) {
        case "admin": {
            console.log("Enter password");
            credentials = data;
            rl.question('Password: ', (password) => {
                if (password == "123") {
                    console.log("Authorized " + password.toString());
                    rl.setPrompt('Your request> ');
                    rl.prompt();
                    rl.on('line', function (request) {
                        if (request === "close") rl.close();
                        createRequest(request);
                    }).on('close', function () {
                        console.log("CLOSE");
                        process.exit(0);
                    });

                } else {
                    console.log("NAH");
                    process.exit(0);
                }
            });
            break;
        }
        case "user": {
            console.log("Hi user!")
            credentials = data;
            break;
        }
        default:
            break;
    }
});

function createRequest() {
    console.log("Nice!");
    rl.prompt();
}


http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('My first server!');
}).listen(8080);



http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('My first server');
}).listen(8080);

var pool = require("./config");

rl.question("credentials: ", function(data) {
    //console.log("Thank you for your valuable feedback:", answer);
    //res = answer;
    //setRole(data);
    console.log(data);
    //rl.close();
});

function getData() {
    pool.getConnection((err, con) => {
        if (err) throw err;
    
        con.query(
            "SELECT * FROM 2BTeam.main",
            (error, result) => {
            if (error) throw error;
            let str = JSON.stringify(result);
            console.log(str);
        });
        con.release();
    });
}
