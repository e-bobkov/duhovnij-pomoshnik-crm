const express = require('express');
const bodyParser = require('body-parser');
const appRoutes = require('./routes/appRoutes');
const db = require('./database/Db');

const app = express();
const port = 5556;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api', appRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
