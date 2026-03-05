const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const animal = require('./routes/animalRoutes');
const material = require('./routes/materialRoutes');
const formula = require('./routes/formulaRoutes');
const cors = require('cors');

app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use('/' , animal);
app.use('/' , material);
app.use('/' , formula);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
