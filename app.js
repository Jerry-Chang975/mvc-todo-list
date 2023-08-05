const express = require('express');
const app = express();
const port = 3000;

// import routes
const todosRoute = require('./router/routes');
app.use('/todos', todosRoute);

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
