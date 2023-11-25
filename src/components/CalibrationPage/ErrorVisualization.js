import React from 'react';

const ErrorVisualization = ({ semiMajs, semiMins, rotationDeg }) => {

  // Define the SVG dimensions
  const rotationRadians = rotationDeg * Math.PI / 180;
  const cosRotation = Math.cos(rotationRadians);
  const sinRotation = Math.sin(rotationRadians);

  // Calculate the width and height of the bounding box
  const svgWidth = (Math.max(...semiMajs) * Math.abs(cosRotation) + Math.max(...semiMins) * Math.abs(sinRotation)) * 2;
  const svgHeight = (Math.max(...semiMajs) * Math.abs(sinRotation) + Math.max(...semiMins) * Math.abs(cosRotation)) * 2;

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  // Calculate text size based on svgWidth
  const textSize = svgWidth / 30;

  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* Render the confidence ellipse */}
      {semiMajs.map((v, index) => (
        <>
          <ellipse
            cx={centerX}
            cy={centerY}
            rx={semiMajs[index]}
            ry={semiMins[index]}
            fill="lightblue"
            fillOpacity="0.5"
            stroke="blue"
            strokeWidth="2"
            transform={`rotate(${rotationDeg}, ${centerX}, ${centerY})`}
          />
        </>

      ))}
      {/* Render labels */}
      <text x={centerX} y={centerY + 10} textAnchor="middle" fill="blue" fontSize={textSize}>
        75%, 90%, and 95%
      </text>
      <text x={centerX} y={centerY + 10 - textSize} textAnchor="middle" fill="blue" fontSize={textSize}>
        Confidence Ellipses
      </text>
    </svg>
  );
};

export default ErrorVisualization;
