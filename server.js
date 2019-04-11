'use strict';

let express = require('express');
let path = require('path');

let app = express();

app.use(express.static(path.resolve(__dirname,'dist')));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(9000);