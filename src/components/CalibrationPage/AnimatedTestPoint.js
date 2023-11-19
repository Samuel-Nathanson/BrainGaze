import React from 'react';

const AnimatedTestPoint = ({ x, y, visibility }) => {
  const delays  = ['-3', '-2', '-1', '0'];
  const animationDuration = 4;
  const animationDirection = 'reverse'
  const animationFillMode = 'none'
  const animationIterationCount = 1;
  const color = 'blue'
  
  return (
    <>
      {delays.map((delay, index) => (
        <div
          key={`circle-${x}-${y}-${delay}`}
          className='calibrationPointCircle'
          style={{
            left: x,
            top: y,
            visibility: visibility,
            backgroundColor: color,
            animationDelay: `${delay}s`,
            animationName: 'scaleIn',
            animationIterationCount: animationIterationCount,
            animationTimingFunction: 'linear',
            animationFillMode: animationFillMode,
            animationDuration: `${animationDuration}s`,
            animationDirection: animationDirection,
          }}
        />
      ))}
    </>
  );
};

export default AnimatedTestPoint;
