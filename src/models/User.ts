import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  address: {
    required: true,
    type: String,
  },
  username: {
		required: true,
    type: String,
	},
	avatar: {
		required: true,
    type: String,
  }
}, {timestamps: true});

const User = mongoose.model('_User', UserSchema);

export { User }
