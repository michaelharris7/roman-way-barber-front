const express = require('express')
const app = express();
const path = require('path')

app.use(express.static(__dirname + '/src/app'));
app.listen(process.env.PORT || 5000);
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/index.html'));
})

console.log('Console listening!');


// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000

// express()
//   .use(express.static(path.join(__dirname, 'src/app')))
//   // .use(express.static(__dirname))

//   .get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/src/index.html'));
//   })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`));