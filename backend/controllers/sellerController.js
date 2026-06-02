import User from '../models/User.js';

// @desc    Request to become a seller
// @route   POST /api/seller/request
// @access  Private
export const requestSellerStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.role === 'seller' || user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'You are already a seller or admin' });
        }

        if (user.sellerStatus === 'pending') {
            return res.status(400).json({ success: false, message: 'Request already pending' });
        }

        user.sellerStatus = 'pending';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Seller request submitted successfully'
        });
    } catch (err) {
        console.error('Seller request failed:', err);
        res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
};

// @desc    Get all seller requests (Admin only)
// @route   GET /api/admin/seller-requests
// @access  Private/Admin
export const getSellerRequests = async (req, res, next) => {
    try {
        const requests = await User.find({ sellerStatus: 'pending' });
        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve seller request
// @route   PATCH /api/admin/approve-seller/:id
// @access  Private/Admin
export const approveSeller = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.sellerStatus = 'approved';
        user.role = 'seller';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Seller request approved'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Reject seller request
// @route   PATCH /api/admin/reject-seller/:id
// @access  Private/Admin
export const rejectSeller = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.sellerStatus = 'rejected';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Seller request rejected'
        });
    } catch (err) {
        next(err);
    }
};
