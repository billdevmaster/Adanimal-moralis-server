import mongoose from 'mongoose';

const KampNFTDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false,
        default: "",
    },
    items: {
        type: Array,
        require: true
    },
    owner: {
        type: String,
        requires: true
    }
}, {timestamps: true, versionKey: false});

const KampNFTDetail = mongoose.model('KampNFTDetail', KampNFTDetailSchema);

export { KampNFTDetail }