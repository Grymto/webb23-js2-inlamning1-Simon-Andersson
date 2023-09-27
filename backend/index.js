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
    const queries = req.query; //Objekt med queries från url:en

    const rawUsers = fs.readFileSync('./backend/data/highscore.json'); //string i json-format med alla users
    const users = JSON.parse(rawUsers); //alla users i JS-array

    let body = {}; //Det som ska skickas med responset

    //Kolla om requesten innehåller en query för namn
    if(queries.name != undefined){
        // console.log(queries.name);

        //loopa igenom users och kolla om någon user har name = queries.name
        for(const user of users){
            // console.log(user.name);

            if(user.name == queries.name){
                // res.send(user);
                console.log('match');
                body = user;
                break;
            }
            else{
                // res.send({message: 'user not found'});
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

    const rawHighscore = fs.readFileSync('./backend/data/highscore.json'); //string i json-format med alla users
    const highscore = JSON.parse(rawHighscore); //alla users i JS-array
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