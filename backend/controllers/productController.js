import Product from '../models/Product.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';

// @desc    Get all products (with filters/sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Product.find(JSON.parse(queryStr)).populate('seller', 'name email');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Product.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const products = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: products.length,
            pagination,
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res, next) => {
    try {
        req.body.seller = req.user.id;

        // Sellers must be approved
        if (req.user.role !== 'admin' && req.user.sellerStatus !== 'approved') {
            return res.status(403).json({ success: false, message: 'Only approved sellers can list products' });
        }

        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Make sure user is product seller or admin
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this product' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Place bid on product
// @route   POST /api/products/:id/bid
// @access  Private
export const placeBid = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!product.isActive || product.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Auction is not active' });
        }

        if (new Date() > new Date(product.auctionEndTime)) {
            product.isActive = false;
            await product.save();
            return res.status(400).json({ success: false, message: 'Auction has ended' });
        }

        if (amount <= product.currentBid || amount < product.startingPrice) {
            return res.status(400).json({ success: false, message: 'Bid must be higher than current bid and starting price' });
        }

        // Create bid
        const bid = await Bid.create({
            product: req.params.id,
            bidder: req.user.id,
            amount
        });

        // Update product
        product.currentBid = amount;
        product.highestBidder = req.user.id;
        product.totalBids += 1;
        await product.save();

        res.status(201).json({ success: true, data: bid });
    } catch (err) {
        next(err);
    }
};

// @desc    Get home page products
// @route   GET /api/products/home
// @access  Public
export const getHomeProducts = async (req, res, next) => {
    try {
        // Only approved and active
        const filter = { status: 'approved', isActive: true };

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        let query = Product.find(filter);

        // Sorting mapping
        const sortMap = {
            latest: '-createdAt',
            endingSoon: 'auctionEndTime',
            highestBid: '-currentBid',
            lowestPrice: 'startingPrice'
        };

        if (req.query.sortBy && sortMap[req.query.sortBy]) {
            query = query.sort(sortMap[req.query.sortBy]);
        } else {
            query = query.sort('-createdAt');
        }

        const products = await query.limit(10); // Simple limit for home page

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (err) {
        next(err);
    }
};
