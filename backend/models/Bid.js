import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    bidder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a bid amount']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for fast lookup of bids per product
bidSchema.index({ product: 1, amount: -1 });

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;
