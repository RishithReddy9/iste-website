'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Script from 'next/script';

export default function Seats() {
    const supabase = createClient();
    const rows = 10;
    const seatsPerRow = 15;
    const router = useRouter();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    const [seatsData, setSeatsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch seat availability from the database on page load
    useEffect(() => {
        const fetchSeats = async () => {
            const { data, error } = await supabase
                .from('seating')
                .select('seat_num, status');

            if (error) {
                console.error('Error fetching seat data:', error);
            } else {
                setSeatsData(data);
            }
            setLoading(false);
        };

        fetchSeats();
    }, []);

    const HandleClick = (seatNumber) => {
        let flag = 0;
        selectedSeats?.map((seat, index) => {
            if (seat === seatNumber) {
                flag = 1;
                selectedSeats.splice(index, 1);
            }
        });
        if (!flag) selectedSeats.push(seatNumber);
        setPrice(selectedSeats.length * 99);
        console.log(selectedSeats);
    };

    const HandlePay = async () => {
        const { data:seating, error } = await supabase
            .from('seating')
            .select('seat_num, status')
            .in('seat_num', selectedSeats);

        if (error) {
            console.error('Error fetching seat data:', error);
            return;
        }

        
        // Get the current time
        const currentTime = new Date();

        // Add 5 minutes to the current time
        const lockedUntilTime = new Date(currentTime.getTime() + 12 * 60000); // 60000 ms = 1 minute

        // Convert the time to an ISO string format for the database
        const lockedUntilISO = lockedUntilTime.toISOString();

        // Update the locked_until column along with the status
        for (const seat of selectedSeats) {
            const { data:update_locked_until, error:e } = await supabase
                .from('seating')
                .update({ 
                    status: 'locked', 
                    locked_until: lockedUntilISO 
                })
                .eq('seat_num', seat);
        }

        const isBooked = seating.some(seat => seat.status === 'booked');

        if (isBooked) {
            window.location.reload();
            return;
        }

        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                price:price
            })
        });
        console.log(response);
        

        const data = await response.json();
        console.log(data);
        

        if (data.orderId) {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_ID, // Enter the Key ID generated from the Dashboard
                amount: price,
                currency: 'INR',
                name: "ISTE-VNRVJIET",
                description: "Test Transaction",
                order_id: data.orderId,
                handler: async function(response) {
                    // alert(response.razorpay_payment_id);
                    // alert(response.razorpay_order_id);
                    // alert(response.razorpay_signature);
                    // After payment is successful, you can handle any post-payment actions here, like booking the seats.
                    for (const seat of selectedSeats) {
                        const { data, error } = await supabase
                            .from('seating')
                            .update({ status: 'booked' })
                            .eq('seat_num', seat);
                    }
                    router.push('thankyou')
                },
                modal: {
                    ondismiss: async function() {
                        // User closed the Razorpay modal without completing the payment
                        selectedSeats.map(async (seat) => {
                            const { data, error } = await supabase
                                .from('seating')
                                .update({ status: 'available' })
                                .eq('seat_num', seat);
                        });
                    }
                },
                notes: {
                    address: "Some Address"
                },
                theme: {
                    color: "#111111"
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            alert('Failed to create Razorpay order');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
                {/* Screen */}
                <div className="w-full h-8 bg-gray-300 text-center mb-20 rounded-sm">
                    <p className="text-lg font-bold">Screen</p>
                </div>

                {/* Rows of Seats */}
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center mb-2">
                        {/* Row Label */}
                        <div className="w-8 h-8 bg-transparent flex items-center justify-center text-lg font-bold mr-2">
                            {String.fromCharCode(65 + rowIndex)} {/* Converts row index to alphabet */}
                        </div>
                        {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                            const seatNumber = rowIndex * seatsPerRow + seatIndex + 1; // Calculate seat number
                            const seatStatus = seatsData.find(seat => seat.seat_num === seatNumber)?.status;
                            const isSelected = selectedSeats.includes(seatNumber);

                            return (
                                <button
                                    key={seatIndex+1}
                                    className={`w-8 h-8 m-1 rounded-sm flex items-center justify-center cursor-pointer 
                                        ${seatStatus === 'booked' ? 'bg-red-500 cursor-not-allowed' : isSelected ? 'bg-green-400' : 'bg-gray-200 hover:bg-blue-400'} 
                                        border border-gray-300`}
                                    onClick={() => HandleClick(seatNumber)}
                                    disabled={seatStatus === 'booked'}
                                    title={seatStatus === 'booked' ? 'Seat is already booked' : ''}
                                >
                                    {seatIndex+1}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4 text-xl font-semibold">
                <div className="text-gray-700">Grand Total:</div>
                <div className="text-green-600">₹{price}</div>
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => HandlePay()}
            >
                Pay Now
            </button>
            </div>

        </>
    );
}
