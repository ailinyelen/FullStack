require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = 'mongodb+srv://ailinyelenb:mongoDBtest@test.vu51asg.mongodb.net/contactsApp?retryWrites=true&w=majority'

module.exports = {
  MONGODB_URI,
  PORT
}