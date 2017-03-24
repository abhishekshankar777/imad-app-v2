var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'abhishekshankar777',
    database: 'abhishekshankar777',
    host:'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {MaxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data) {
  var title = 'data.title';
  var heading = 'data.heading';
  var date = 'data.date';
  var content ='data.content';

var htmltemplate= `
<html>
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
      <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/article.js"></script>
    </body>
    </html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
  });
  
  
  function hash(input,salt) {
    
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return["pkdf2","10000",salt,hashed.toString('hex')].join('$');
      
  }
  
  
  
  app.get('/hash/:input', function (req,res){
      var hashedString = hash(req.params.input,'this-is-some-random-string');
      res.send(hashedString);
    
  });
  
  app.post('/create-user',function(req,res){
      var username = req.body.username;
      var password = req.body.password;
     
      var salt = crypto.randomBytes(128).toString('hex');
      var dbString =hash(password,salt);
      pool.query('INSERT INTO "user" (username,password) VALUES($1,$2)',[username,dbString],function(err,result) {
        if(err) {
              res.status(500).send(err.toString());
              
          } else {
              res.send('user succesfully created:'+username);
              
          }
       
        });
    });
  
  app.post('/login',function(req,res) {
    var username = req.body.username;
      var password = req.body.password;
     
      
      pool.query('SELECT * FROM "user" WHERE username= $1',[username],function (err,result){
          if(err) {
              res.status(500).send(err.toString());
              
          } else {
             
           if(result.rows.length === 0) {
                res.send(403).send('username/password is invalid'); 
           }else {
               var  dbString = result.rows[0].password;
               var salt = dbString.split('$')[2];
               var hashedpassword = hash(password, salt);
               if (hashedpassword === dbString) {
                   req.session.auth = {userId: result.rows[0].id};
                   res.send('credentials correct!');
               } else {
                  res.send(403).send('username/password is invalid'); 
               }
           }
          }
      });
      });
      
      app.get('/check-login', function(req, res) {
          if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});
   
      app.get('/logout', function (req,res){
          delete req.session.auth;
          res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
      });
         
      
      
      
      
      
      
      
      
      
      
      
      
      
      
  
   var pool = new Pool(config);
  app.get('/test-db',function (req, res) {
      pool.query('SELECT * FROM TEST',function(err,result){
          if(err) {
              res.status(500).send(err.toString());
              
          } else {
              res.send(JSON.stringify(result));
              
          }
      });
      
      
  });
  
   var pool = new Pool(config);
  app.get('/abhishek-db',function (req, res) {
      pool.query("SELECT * FROM abhishek",function(err,result){
          if(err) {
              res.status(500).send(err.toString());
              
          } else {
              res.send(JSON.stringify(result.rows));
              
          }
      });
      
      
  });
  
  
  
  var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});


app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});























  
  
  
var counter=0;
app.get('/counter', function(req, res) {
    counter= counter+1;
    res.send(counter.toString());
});

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
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
