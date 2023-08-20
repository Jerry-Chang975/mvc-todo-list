const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// import routes
const router = require('./router');
app.use(router);

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
