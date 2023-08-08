const express = require('express');
const app = express();
const port = 3000;

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// import routes
const todosRoute = require('./router/routes');
app.use('/todos', todosRoute);

app.get('/', (req, res) => res.render('index'));

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
