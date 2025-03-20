import mongoose from 'mongoose';

const dbconnect = (URL) => {
  mongoose.connect(URL)
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log(err));
};



export default dbconnect;