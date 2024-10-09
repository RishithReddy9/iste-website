import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID, // Replace with your Razorpay key_id
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY // Replace with your Razorpay key_secret
});

export async function POST(req) {
        
        const { price } = await req.json();
        const options = {
            amount: price * 100, 
            currency: 'INR',
            receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
        };

        try {
            const order = await razorpay.orders.create(options);
            return NextResponse.json({orderId:order.id},{status:200})
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}
