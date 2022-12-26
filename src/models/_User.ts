import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  ethAddress: {
      type: String,
      require: false,
  },
  username: {
      type: String,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String
  },
  email: {
    type: String,
  },
  facebook: {
    type: String,
  },
  telegram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  availableItems: {
    type: Array,
  },
}, {timestamps: true, versionKey: false});

const User = mongoose.model('User', UserSchema, "_User");

export { User }