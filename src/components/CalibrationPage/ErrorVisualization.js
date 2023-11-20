import React from 'react';

const ErrorVisualization = ({ semiMaj, semiMin, rotationDeg }) => {

  // Define the SVG dimensions
  const rotationRadians = rotationDeg * Math.PI / 180;
  const cosRotation = Math.cos(rotationRadians);
  const sinRotation = Math.sin(rotationRadians);

  // Calculate the width and height of the bounding box
  const svgWidth = (semiMaj * Math.abs(cosRotation) + semiMin * Math.abs(sinRotation))*2;
  const svgHeight = (semiMaj * Math.abs(sinRotation) + semiMin * Math.abs(cosRotation))*2;

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  // Calculate text size based on svgWidth
  const textSize = svgWidth / 20;

  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* Render the confidence ellipse */}
      <ellipse
        cx={centerX}
        cy={centerY}
        rx={semiMaj}
        ry={semiMin}
        fill="lightblue"
        fillOpacity="0.5"
        stroke="blue"
        strokeWidth="2"
        transform={`rotate(${rotationDeg}, ${centerX}, ${centerY})`}
      />

      {/* Render labels */}
      <text x={centerX} y={centerY + 10} textAnchor="middle" fill="blue" fontSize={textSize}>
        95% Confidence Ellipse
      </text>
    </svg>
  );
};

export default ErrorVisualization;
