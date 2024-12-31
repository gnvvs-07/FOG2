import { useState, useEffect, useRef } from "react";

const ROWS = 15; // Number of rows
const COLS = 20; // Number of columns
const CELL_SIZE = 30; // Size of each cell in pixels
const GROUP_SIZE = 5; // Number of blocks in each falling group
const FALL_SPEED = 0.05; // Falling speed in rows per frame
const COLORS = ["rgb(225, 0, 0)", "rgb(0, 225, 0)", "rgb(0, 0, 255)"]; // Block colors

const App = () => {
  const [blocks, setBlocks] = useState([]); // List of falling block groups
  const animationRef = useRef(null); // Animation loop reference

  // Function to add new falling blocks
  const spawnBlockGroup = (col) => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newGroup = Array.from({ length: GROUP_SIZE }, (_, i) => ({
      col,
      y: -i+4, // Start the group off-screen (stacked above the grid)
      color: randomColor,
    }));
    setBlocks((prevBlocks) => [...prevBlocks, ...newGroup]);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setBlocks((prevBlocks) => {
        // Move all blocks downward and filter out those beyond the grid
        const updatedBlocks = prevBlocks
          .map((block) => ({ ...block, y: block.y + FALL_SPEED })) // Move the blocks down
          .filter((block) => block.y < ROWS); // Remove blocks that are out of the grid

        // Spawn new blocks in random columns
        if (Math.random() > 0.99) {
          const randomCol = Math.floor(Math.random() * COLS);
          // Ensure the new group falls within an empty column range (no overlap)
          if (!updatedBlocks.some((block) => block.col === randomCol && block.y < GROUP_SIZE)) {
            spawnBlockGroup(randomCol); // Only spawn a new group if the column is free
          }
        }

        return updatedBlocks;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-black">
      <div
        className="relative grid"
        style={{
          width: `${COLS * CELL_SIZE}px`,
          height: `${ROWS * CELL_SIZE}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
          backgroundColor: "#222", // Darker grid background
          borderRadius: "12px", // Rounded corners for the grid
          boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)", // Glowing shadow around grid
        }}
      >
        {/* Render empty cells for the grid */}
        {Array.from({ length: ROWS * COLS }).map((_, index) => (
          <div
            key={index}
            style={{
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              backgroundColor: "#333", // Dark background color for empty cells
              borderRadius: "5px", // Slightly rounded corners for cells
            }}
          />
        ))}

        {/* Render falling blocks */}
        {blocks.map((block, index) => (
          <div className="border border-black"
            key={index}
            style={{
              position: "absolute",
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              backgroundColor: block.color,
              opacity:
                block.y >= ROWS - GROUP_SIZE
                  ? 1 - (block.y - (ROWS - GROUP_SIZE)) / GROUP_SIZE
                  : 1, // Gradual fade-out near the bottom
              transform: `translate(${block.col * CELL_SIZE}px, ${
                block.y * CELL_SIZE
              }px)`, // Align blocks perfectly within columns
              transition: "opacity 0.3s ease-in-out",
              boxShadow: "0 0 10px rgba(220, 20, 60, 0.5)", // Glowing effect around falling blocks
              borderRadius: "4px", // Slightly rounded corners for blocks
              zIndex: 1, // Ensures blocks are rendered above the grid
              animation: "falling 1s ease-in-out infinite", // Smooth falling animation
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
