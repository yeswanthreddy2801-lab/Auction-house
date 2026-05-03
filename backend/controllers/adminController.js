import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

// @desc    Block/Unblock user
// @route   PATCH /api/admin/toggle-block/:id
// @access  Private/Admin
export const toggleBlockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve/Reject product
// @route   PATCH /api/admin/approve-product/:id
// @access  Private/Admin
export const approveProduct = async (req, res, next) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.status = status;
        await product.save();

        res.status(200).json({ success: true, message: `Product ${status}` });
    } catch (err) {
        next(err);
    }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSellers = await User.countDocuments({ role: 'seller' });
        const activeAuctions = await Product.countDocuments({ status: 'approved', isActive: true });

        // Revenue could be calculated from total successful bids where auction ended
        // For simplicity, let's just sum current bids of ended auctions
        const endedAuctions = await Product.find({ status: 'approved', isActive: false });
        const totalRevenue = endedAuctions.reduce((acc, p) => acc + (p.currentBid || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalSellers,
                activeAuctions,
                totalRevenue
            }
        });
    } catch (err) {
        next(err);
    }
};
