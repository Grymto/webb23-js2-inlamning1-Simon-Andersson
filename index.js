const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/products', (req, res)=>{
    const queries = req.query; 

    const rawProducts = fs.readFileSync('./data/products.json'); //string i json-format med alla products
    const products = JSON.parse(rawProducts); 

    let body = []; 

    if(queries.name != undefined){
         for(const product of products){
             if(product.name.toLowerCase().includes(queries.name.toLowerCase())){
                console.log(product.name + ': match');
                body.push(product);
            }
            else{
                console.log('no match');
            }
        }
    }
    else{
        console.log('name did not exist')
        body = [];
    }
    res.send(body);
})

app.post('/products', (req, res)=>{
    const basket = req.body;

    console.log(basket);

    const rawProducts = fs.readFileSync('./data/products.json');
    const products = JSON.parse(rawProducts); 

    
        products.forEach(p => {
            const matchingProductInBasket = basket.find(b => b.name === p.name);
        
            if (matchingProductInBasket) {
                p.stock_quantity -= matchingProductInBasket.items;
            }
        });
        
        fs.writeFileSync('./data/products.json', JSON.stringify(products));
        
        res.send({ message: 'Stock inventory updated.' });
 
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000...');
})