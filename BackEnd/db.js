const mongoose = require('mongoose')
require('dotenv').config()

const db = async () =>{
  try {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log("Database is connected");
  } catch (error) {
    console.log("unable to connect database");
  }
}
db()

module.exports = mongoose