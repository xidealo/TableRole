var http = require('http');
var credentials = ""

console.log('Server started!');

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* function read(text) {
    var res = "-";
    rl.question(text, function(answer) {
        //console.log("Thank you for your valuable feedback:", answer);
        res = answer;
        rl.close();
    });

    return res;
}

var name = read("Имя: ");
console.log(name);
 */ 

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

/*function setRole(data) {
    switch(data) {
        default:
            setRole(data);
    }
}*/



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
