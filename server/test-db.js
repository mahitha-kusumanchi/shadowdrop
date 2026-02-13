require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shadowdrop';

console.log('Testing connection to:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');
        console.log('Database Name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ ERROR: Could not connect to MongoDB.');
        console.error(err);
        process.exit(1);
    });
