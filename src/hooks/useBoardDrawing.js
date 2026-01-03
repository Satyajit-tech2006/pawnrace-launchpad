import { useState, useRef } from 'react';

export const useBoardDrawing = (orientation = 'white') => {
    const [arrows, setArrows] = useState([]);
    const [squares, setSquares] = useState({});
    const [drawStart, setDrawStart] = useState(null);
    const boardWrapperRef = useRef(null);

    // 1. Math to get Square from Mouse X/Y
    const getSquareFromCoords = (e) => {
        if (!boardWrapperRef.current) return null;
        const rect = boardWrapperRef.current.getBoundingClientRect();
        
        // Calculate relative coordinates
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const squareSize = rect.width / 8;
        
        const fileIdx = Math.floor(x / squareSize);
        const rankIdx = 7 - Math.floor(y / squareSize);

        if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) return null;

        const files = ['a','b','c','d','e','f','g','h'];
        // Adjust for Orientation
        const finalFile = orientation === 'white' ? files[fileIdx] : files[7 - fileIdx];
        const finalRank = orientation === 'white' ? (rankIdx + 1) : (8 - rankIdx);

        return `${finalFile}${finalRank}`;
    };

    // 2. Event Handlers
    const handleMouseDown = (e) => {
        if (e.button === 2) { // Right Click only
            const sq = getSquareFromCoords(e);
            if (sq) setDrawStart(sq);
        }
    };

    const handleMouseUp = (e) => {
        if (e.button === 2 && drawStart) {
            const drawEnd = getSquareFromCoords(e);
            if (!drawEnd) { setDrawStart(null); return; }

            let newArrows = [...arrows];
            let newSquares = { ...squares };
            let hasChanged = false;

            // A. CLICK (Start == End) -> Toggle Color
            if (drawStart === drawEnd) {
                const colors = [undefined, "rgba(255, 170, 0, 0.5)", "rgba(21, 120, 27, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.5)"];
                const currentBg = squares[drawStart]?.backgroundColor;
                
                // Find next color
                let nextIdx = 0;
                if (currentBg) {
                    const idx = colors.indexOf(currentBg);
                    nextIdx = (idx + 1) % colors.length;
                } else {
                    nextIdx = 1;
                }

                if (colors[nextIdx]) {
                    newSquares[drawStart] = { backgroundColor: colors[nextIdx] };
                } else {
                    delete newSquares[drawStart];
                }
                hasChanged = true;
            } 
            // B. DRAG (Start != End) -> Draw Arrow
            else {
                // Check if identical arrow exists (same start/end)
                const existsIdx = arrows.findIndex(a => a[0] === drawStart && a[1] === drawEnd);
                
                if (existsIdx !== -1) {
                    // Remove it (Toggle off)
                    newArrows.splice(existsIdx, 1);
                } else {
                    // Add new one
                    newArrows.push([drawStart, drawEnd, "rgb(255, 170, 0)"]);
                }
                hasChanged = true;
            }

            setArrows(newArrows);
            setSquares(newSquares);
            setDrawStart(null);

            // Return changes so Parent can emit to socket
            return { hasChanged, newArrows, newSquares };
        }
        return { hasChanged: false };
    };

    const clearAnnotations = () => {
        setArrows([]);
        setSquares({});
        return { newArrows: [], newSquares: {} };
    };

    return {
        arrows, setArrows,
        squares, setSquares,
        boardWrapperRef,
        handleMouseDown,
        handleMouseUp,
        clearAnnotations
    };
};