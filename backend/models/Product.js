import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    startingPrice: {
        type: Number,
        required: [true, 'Please add a starting price']
    },
    currentBid: {
        type: Number,
        default: 0
    },
    auctionEndTime: {
        type: Date,
        required: [true, 'Please add an auction end time']
    },
    images: [{
        type: String
    }],
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    highestBidder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    totalBids: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add index for search and sorting
productSchema.index({ status: 1, isActive: 1, auctionEndTime: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
