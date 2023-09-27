const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/highscore', (req, res)=>{
    const queries = req.query; 

    const rawUsers = fs.readFileSync('./backend/data/highscore.json'); //string i json-format med alla users
    const users = JSON.parse(rawUsers); 

    let body = {}; 

    if(queries.name != undefined){
         for(const user of users){
             if(user.name == queries.name){
                console.log('match');
                body = user;
                break;
            }
            else{
                console.log('no match')
            }
        }
    }
    else{
        console.log('name did not exist')
        body = users;
    }
    res.send(body);
})

app.post('/highscore', (req, res)=>{
    const newResult = req.body;

    console.log(newResult);

    const rawHighscore = fs.readFileSync('./backend/data/highscore.json');
    const highscore = JSON.parse(rawHighscore); 
    let gotHighscore = false;
    for (let i = 0; i < 5; i++){
        if (highscore[i].score < newResult.score) {
            highscore.splice(i, 0, newResult);
            highscore.pop();
            gotHighscore = true;
            break;
        }
    }
    fs.writeFileSync('./backend/data/highscore.json', JSON.stringify(highscore));

    if (gotHighscore) {
        res.send({message: newResult.name + ' added to highscore', status: gotHighscore});
    } else {
        res.send({message: newResult.name + ' is a looser', status: gotHighscore});
    }
    
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000...');
})