const express = require('express')
const app = express()

const main = require('./main');
const PDFDocument = require('pdfkit')

app.get('/each', function (req, res) {
  main.loadjsonfiles();
  res.send('Written each transaction to a block!')
  main.writeEachCycleToBlockchain();
})

app.get('/oneblock', function (req, res) {
  main.loadjsonfiles();
  res.send('Written to one block!')
  main.writeCyclesToBlockchain();
})

app.get('/invoice', (req, res) => {
  const doc = new PDFDocument()
  let filename = "invoice";
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf'
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')
  const content = "total billing amount: " + main.totalAmount();
  doc.y = 300
  doc.text(content, 50, 50)
  doc.pipe(res)
  doc.end()
})

app.get('/print', function (req, res) {
  res.send(main.printchain());
})

app.get('/total', function (req, res) {
  res.send(String(main.totalAmount()));
})

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', function (req, res) {
  res.render("index");
});

//Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)

var message = "";
var idx;
//listen on every connection
io.on('connection', (socket) => {
  console.log('#### New connection ####')

  //default username
  socket.username = "Anonymous"

  //listen on new_message
  socket.on('new_message', (data) => {

    //broadcast the new message

    switch (data.message) {
      case "create":
        main.loadjsonfiles();
        main.writeEachCycleToBlockchain();
        data.message = "Added new blocks";
        io.sockets.emit('new_message', {
          message: data.message
        });
        break;
      case "total":
        data.message = main.totalAmount();
        console.log(data.message);
        io.sockets.emit('new_message', {
          message: data.message
        });
        break;
      case "print":
        array = main.printchain();
        var str = "";
        for (let index = 0; index < array.length; index++) {
          data.message = array[index][0].toStr();

          io.sockets.emit('new_message', {
            message: data.message
          });
        }

        break;
      default:
        io.sockets.emit('new_message', {
          message: "Commands: create,total,print,export ## Links: /invoice /each /oneblock /total /print"
        });
        break;
    }

  })

})