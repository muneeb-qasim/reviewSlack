const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const {MONGOURI} = require('./config/key');

app.use(cors());
mongoose.connect(process.env.MONGODB_URI || MONGOURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB...');
});

mongoose.connection.on('err', () => {
  console.log('Could not connect to MongoDB...', err);
});

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(require('./routes/user'));
app.use(require('./routes/appReviews'));
// app.use(require('./routes/health'));
// //app.use(require('./routes/Security/Authentication'));

app.listen(port, () => console.log(`Listening on port ${port}...`));
