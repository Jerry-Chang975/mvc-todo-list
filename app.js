const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

const router = require('./router');
const messageHandler = require('./middleware/message-handler');
const errorHandler = require('./middleware/error-handler');

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

app.use(messageHandler);

app.use(router);

app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
