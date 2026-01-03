import React from 'react';

const CoordinateOverlay = ({ orientation, showCoordinates, boardWidth }) => {
    if (!showCoordinates) return null;

    // Generate Ranks and Files based on orientation
    const ranks = orientation === 'white' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
    const files = orientation === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

    // Calculate a responsive font size
    const fontSize = Math.max(12, boardWidth / 45);

    return (
        <div className="absolute inset-0 pointer-events-none select-none">
            
            {/* 1. RANKS (Numbers) - Left Side Outside */}
            {/* We position it -25px to the left */}
            <div className="absolute -left-8 top-0 h-full flex flex-col w-8">
                {ranks.map((rank) => (
                    <div 
                        key={rank} 
                        className="flex-1 flex items-center justify-end pr-2 text-gray-300 font-bold font-mono" 
                        style={{ fontSize }}
                    >
                        {rank}
                    </div>
                ))}
            </div>

            {/* 2. FILES (Letters) - Bottom Side Outside */}
            {/* We position it -25px to the bottom */}
            <div className="absolute left-0 -bottom-8 w-full flex h-8">
                {files.map((file) => (
                    <div 
                        key={file} 
                        className="flex-1 flex items-start justify-center pt-1 text-gray-300 font-bold font-mono" 
                        style={{ fontSize }}
                    >
                        {file}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoordinateOverlay;