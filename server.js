var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
var articles= {
     articleOne: {
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
     articletwo : {
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
     articlethree: {
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

app.get('/article-one', function(req, res) {
 res.send(createTemplate(articleone));
  });
  
app.get('/article-two', function(req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
  });
  
app.get('/article-three', function(req, res) {
 res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
  });
  
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
