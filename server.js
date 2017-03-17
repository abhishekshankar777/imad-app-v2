var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool = require('pg'),pool;

var config = {
    user: 'abhishekshankar777',
    database: 'abhishekshankar777',
    host:'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
var articles= {
     'article-one': {
    title: 'article one | abhishek shankar',
    heading: 'article one',
    date: 'sept 5 2017',
    content: `<p>
                abhishek shankar is batman.
            </p>
            <p>
                abhishek shankar is batman.
            </p>`
},
     'article-two' : {
        title: 'article two| abhishek shankar',
        heading: 'article two',
        date: 'sept 5 1988',
        content: `<p>
                bruce wayne is batman.
            </p>
            <p>
                bruce wayne is batman.
            </p>`
        
    },
     'article-three': {
        title: 'article three| abhishek shankar',
        heading: 'article three',
        date: 'sept 5 1947',
        content: `<p>
                bruce wayne is batman.
            </p>
            <p>
                bruce wayne is batman.
            </p>`
        
    },
};
function createTemplate (data) {
  var tittle = 'data.title';
  var heading = 'data.heading';
  var date = 'data.date';
  var content ='data.content';

var htmltemplate= `<html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width-device-width,initial-scale-1"/>
        <link href="/ui/style.css" rel="stylesheet" />
       
    </head>
    <body>
        <div class="container">
        <div>
            <a href="/">home</a>
        </div>
        <hr/>
        <h3>
            ${heading}
        </h3>
        <div>
            sept 5 2017
        </div>
        <div>
        ${content}
        </div>
        </div>
    </body>
    </html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
  });
  
  var pool = new Pool(config);
  app.get('/test-db',function (req, res) {
      pool.query('SELECT * FROM TEST',function(err,result){
          if(err) {
              res.status(500).send(err.toString());
              
          } else {
              res.send(JSON,stringify(result));
              
          }
      });
      
      
  });
  
  
  
var counter=0;
app.get('/counter', function(req, res) {
    counter= counter+1;
    res.send(counter.toString());
});
app.get('/:articlename', function(req, res) {
    var articlename= req.param.articlename;
 res.send(createTemplate(articles[articlename]));
  });
  

  
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
