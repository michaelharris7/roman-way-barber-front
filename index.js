const express = require('express')
const app = express()
const path = require('path')
// const PORT = process.env.PORT || 5000

// app.use(express(path.join('/src/')));
app.use(express.static(__dirname + '/src/'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/index.html'))
});
app.listen(process.env.PORT || 5000);

console.log('Console listening!');


// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000

// express()
//   .use(express.static(__dirname + '/src/'))
//   // .use(express.static(__dirname))

//   .get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/src/index.html'))
//   })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));