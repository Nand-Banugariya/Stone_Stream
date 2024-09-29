const express = require('express');
const connectDB = require('./database/db');
const userRoutes = require('./routes/registerroute'); // Registration routes
const loginRoutes = require('./routes/loginroute'); 
const purchaseRoute = require('./routes/purchaseroute')
const salesRoute = require('./routes/salesrouter')
const inventoryroute = require('./routes/inventoryroute')
const orderhistoryroute = require('./routes/orderhistoryroute')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewarer
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api', userRoutes); 
app.use('/api', loginRoutes); 
app.use('/api',purchaseRoute);
app.use('/api',salesRoute);
app.use('/api',inventoryroute);
app.use('/api/orders',orderhistoryroute) 

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
