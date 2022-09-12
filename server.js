var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer')
var db=require('./database');
var app = express();
var port = process.env.PORT || 4000;
  
// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// serving static files
app.use('/uploads', express.static('uploads'));
  
// request handlers
app.get('/', (req, res) => {
    res.send('Node js file upload rest apis');
});
// handle storage using multer
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads');
   },
   filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
   }
});
 
var upload = multer({ storage: storage });
 
// handle single file upload
app.post('/upload-avatar', upload.single('dataFile'), (req, res, next) => {
   const file = req.file;
   if (!file) {
      return res.status(400).send({ message: 'Please upload a file.' });
   }
   var sql = "INSERT INTO `file`(`name`) VALUES ('" + req.file.filename + "')";
   var query = db.query(sql, function(err, result) {
       return res.send({ message: 'File is successfully.', file });
    });
});
 
app.listen(port, () => {
    console.log('Server started on: ' + port);
});
