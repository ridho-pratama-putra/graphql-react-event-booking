const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.listen(3000);

app.get('/',(req, res, next) => {
    // console.log('yayay')
    res.send('yayaya');
});