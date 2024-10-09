

export default function Payment({searchParams}) {
    const {price,selectedSeats}=searchParams

    
    return (
        // <div>{price}</div>
        <div>
            {price}
        </div>
    );
}