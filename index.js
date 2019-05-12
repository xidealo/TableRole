const http = require('http');
const pool = require("./config");
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//constants
const ADMIN = "admin";
const USER = "user";
const CREATE = "create";
const USE = "use";

rl.question('create/use role? ', (data) => {
    data = data.toLowerCase();

    switch (data) {
        case USE: {
            getRole();
            break;
        }
        case CREATE: {
            createRole();
            break;
        }
        default:
            break;
    }
});


function getRole() {
    // роли будут подгружаться из базы данных
    rl.question('What is your role admin/user ?', (data) => {
        //set role
        data = data.toLowerCase();
        switch (data) {
            case ADMIN: {
                console.log("Enter password");
                rl.question('Password: ', (password) => {
                    if (password == "123") {
                        credentials = data;
                        console.log("Authorized " + password.toString());
                        startReadRequest();
                    } else {
                        console.log("Password is wrong");
                        process.exit(0);
                    }
                });
                break;
            }
            case USER: {
                //можно загружать права, которыми он обладает
                console.log("Hi user! You have this rules: ...");
                credentials = data;
                startReadRequest();
                break;
            }
            default:
                break;
        }
    });

}

function createRole(){
    //реализация создания роли
}

function startReadRequest() {
    rl.setPrompt('Your request> ');
    rl.prompt();
    rl.on('line', function (request) {
        if (request === "close") rl.close();
        // пока програмно задаем права(фильтры), позже можно будет создавать роль
        // ее права будут заноситься в бд
        // в зависимости от того, за кого мы зашли, будем смотреть права
        switch (credentials) {
            case ADMIN: {
                createRequest(request);
                break;
            }
            case USER: {
                if (userFilter(request)) {
                    createRequest(request);
                }
                else {
                    console.log("u dont have enough rules")
                }
                break;
            }
            default:
                break;
        }
    }).on('close', function () {
        console.log("CLOSE");
        process.exit(0);
    });
}
//"SELECT * FROM 2BTeam.main"

function createRequest(request) {
    //making request
    pool.getConnection((err, con) => {
        if (err) throw err;
        con.query(
            request,
            (error, result) => {
                if (error) throw error;
                let str = JSON.stringify(result);
                console.log(str);
            });
        con.release();
    });
    rl.prompt();
}

function userFilter(request) {
    if (request.toString().includes("secret_info") || request.toString().includes("*")) {
        return false;
    }
    else {
        return true;
    }
}

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('My first server');
}).listen(8080);

