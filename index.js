
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
const DELETE = "delete";
const USE = "use";

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

function startReadRequest() {

    let commandToLineRequest = Array()["request", "close", "change role"];

    console.log(); // вывести все команды
    rl.setPrompt('Your request> ');
    rl.prompt();
    rl.on('line', function (request) {
        if (request === "close") rl.close();
        if (request === "change roles") {
            if (haveRigthToChangeRole()) {
                actingWithRole();
            }
            else {
                console.log("Not enough rights");
            }
            return;
        }
    
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
                    console.log("u dont have enough rights");
                }
                break;
            }
            default:
                break;
        }
        rl.prompt();
    }).on('close', function () {
        console.log("CLOSE");
        process.exit(0);
    });
}
function haveRigthToChangeRole() {
    return true;
}

function actingWithRole() {
    rl.question('create/delete role? ', (data) => {
        data = data.toLowerCase();

        switch (data) {
            case CREATE: {
                createRole();
                break;
            }
            case DELETE: {
                deleteRole();
                break;
            }
            default:
                break;
        }
    });
}

function createRole() {
    console.log("Role created")
}

function deleteRole() {
    console.log("Role deleted")
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
}

app.route("/get/all").get((req, res) => {
    pool.getConnection((err, con) => {
      if (err) throw err;
      con.query(
        "SELECT * FROM 2BTeam.main",
         (error, result) => {
        if (error) throw error;
        let str = JSON.stringify(result);
        res.send(str);
      });
      con.release();
    });
  });

function userFilter(request) {
    if (request.toString().includes("secret_info") || request.toString().includes("*")) {
        return false;
    }
    else {
        return true;
    }
}

app.listen(8080, () => {
    console.log("server lisnet");
    //nodemon позвоялет изменять страницу без обновления
  });
