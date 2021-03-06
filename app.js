const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');

dotenv.config({ path: path.resolve(__dirname, 'config', '.env') });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas successfully connected!'))
  .catch((error) => console.log(error));

const app = express();

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: [process.env.DEV_HOST, process.env.PROD_HOST],
}));

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use(passport.authenticate('jwt', { session: false }));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;
