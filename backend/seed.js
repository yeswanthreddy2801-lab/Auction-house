import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data (optional, but good for clean seed)
        await Product.deleteMany({});

        // Check if admin/seller exists
        let seller = await User.findOne({ email: 'admin@example.com' });
        if (!seller) {
            seller = await User.create({
                name: 'Admin Seller',
                email: 'admin@example.com',
                password: 'Password123',
                role: 'admin',
                sellerStatus: 'approved'
            });
        } else if (seller.role !== 'admin' || seller.sellerStatus !== 'approved') {
            seller.role = 'admin';
            seller.sellerStatus = 'approved';
            await seller.save();
        }

        const auctions = [
            {
                title: 'Rare Vintage Rolex Submariner',
                description: 'A beautiful 1968 Rolex Submariner in excellent condition. Includes original box and papers.',
                category: 'Watches',
                startingPrice: 15000,
                currentBid: 0,
                auctionEndTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
                images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
                seller: seller._id,
                isActive: true,
                status: 'approved'
            },
            {
                title: 'Modern Abstract Painting - "Azure Dream"',
                description: 'Large scale abstract oil on canvas by renowned artist Sarah Jenkins.',
                category: 'Art',
                startingPrice: 5000,
                currentBid: 5500,
                totalBids: 3,
                auctionEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
                images: ['https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800'],
                seller: seller._id,
                isActive: true,
                status: 'approved'
            },
            {
                title: 'Classic 1965 Mustang Shelby GT350',
                description: 'Fully restored classic muscle car. Matching numbers, original Wimbledon White paint.',
                category: 'Automobiles',
                startingPrice: 120000,
                currentBid: 125000,
                totalBids: 1,
                auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'],
                seller: seller._id,
                isActive: true,
                status: 'approved'
            }
        ];

        await Product.insertMany(auctions);
        console.log('Database Seeded!');
        process.exit();
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seed();
