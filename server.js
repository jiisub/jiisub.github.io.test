const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');

// Connect MongoDB
const { MongoClient, ObjectId } = require('mongodb');

let db
const url = 'mongodb+srv://admin:qwer1234@cluster0.4wtyxpm.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url).connect().then((client) => {
  console.log('Connected DB');
  db = client.db('forum');
}).catch((err) => {
  console.log(err);
});


app.use(express.json());
app.use(express.urlencoded({extended:true}));
var cors = require('cors');
const whiteDomain = 'localhost:8080'; 
app.use(cors({ origin : whiteDomain }));

app.listen(8080, () => {
  console.log('http://localhost:8080 에서 서버 실행중');
});


// PassPort
app.use(passport.initialize());
app.use(session({
  secret: 'tlswltjq8747!',
  resave: false,
  saveUninitialized: false,
  store : MongoStore.create({
    mongoUrl : 'mongodb+srv://admin:qwer1234@cluster0.4wtyxpm.mongodb.net/?retryWrites=true&w=majority',
    dbName : 'forum'
  })
}));

app.use(passport.session());

passport.use(new LocalStrategy(async (idValue, pwValue, cb) => {
  try{
    let result = await db.collection('user').findOne({ username : idValue });
    if (!result) {
      return cb(null, false, { message : 'None ID in DB' });
    }
    if (await bcrypt.compare(pwValue, result.password)) {
      return cb(null, result);
    } else {
      return cb(null, false, { message : 'Incorrect PW' });
    }
  } catch(err) {
    console.log(err);
  }
}));

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username })
  });
});

passport.deserializeUser(async (user, done) => {
  let result = await db.collection('user').findOne({_id : new ObjectId(user.id)});
  delete result.password;
  
  process.nextTick(() => {
    return done(null, result);
  });
});

app.use(express.static(path.join(__dirname, 'article-project/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/article-project/build/index.html'));
});

app.post('/login', async (req, res, next) => {

  passport.authenticate('local', (error, user, info) => {
    if (error) return res.status(500).json(error);
    if (!user) return res.status(401).json(info.message);
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect('/user');
    });
  })(req, res, next);

});

app.post('/register', async (req, res) => {

  try{
    const dbID = await db.collection('user').findOne({username : req.body.username});
    if(dbID){
      res.redirect('/alert');
    } else {
      let hash = await bcrypt.hash(req.body.password, 10);

      await db.collection('user').insertOne({
        username : req.body.username,
        password : hash
      });

      res.redirect('/login');
    }
  } catch(err) {
    console.log(err);
  }
  
});

app.get('/check', async (req, res) => {
  res.json({user : req.user});
});

app.post('/add', async (req, res) => {
  await db.collection('scrap').insertOne({
    article_id : req.body.article_id,
    headline : req.body.headline,
    byline : req.body.byline,
    date : req.body.date,
    source : req.body.source,
    keyword : req.body.keyword,
    url : req.body.url,
    username : req.user.username
  });
});

app.get('/article', async (req, res) => {
  let result = await db.collection('scrap').find({
    username : req.user.username
  }).toArray();
  res.json({result : result});
});

app.post('/delete', async (req, res) => {
  await db.collection('scrap').deleteOne({article_id : req.body.article_id});
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/article-project/build/index.html'));
});