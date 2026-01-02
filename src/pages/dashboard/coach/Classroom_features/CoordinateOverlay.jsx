import React from 'react';

const CoordinateOverlay = ({ orientation, showCoordinates, boardWidth }) => {
    if (!showCoordinates) return null;

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // If board is flipped (Black side), reverse the arrays so h1 is top-left
    const displayFiles = orientation === 'white' ? files : [...files].reverse();
    const displayRanks = orientation === 'white' ? ranks : [...ranks].reverse();

    return (
        <div 
            className="absolute inset-0 pointer-events-none z-10 grid grid-cols-8 grid-rows-8"
            style={{ width: boardWidth, height: boardWidth }}
        >
            {displayRanks.map((rank, rIndex) => (
                displayFiles.map((file, fIndex) => {
                    const isDark = (rIndex + fIndex) % 2 === 1;
                    const squareColor = isDark ? "text-[#e9edcc]/50" : "text-[#779954]/80"; // Contrast text color
                    
                    return (
                        <div 
                            key={`${file}${rank}`} 
                            className={`flex items-start justify-start p-0.5 text-[10px] font-bold font-mono leading-none ${squareColor}`}
                        >
                            {file}{rank}
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default CoordinateOverlay;