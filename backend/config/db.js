const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...")
    console.log("MongoDB URI:", process.env.MONGO_URI)

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

module.exports = connectDB
