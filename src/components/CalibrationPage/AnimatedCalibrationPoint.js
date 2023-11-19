import React, { useState } from 'react';

const AnimatedCalibrationPoint = ({ x, y, visibility }) => {
  const [color, setColor] = useState('gold');
  const [animationDuration, setAnimationDuration] = useState(4);
  const [animationDirection, setAnimationDirection] = useState('reverse');

  const delays = ['-3', '-2', '-1', '0']
  const changeStyle = (index) => {
    setColor('green');
    setAnimationDirection('normal')
    setAnimationDuration('4s')
  };

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
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationFillMode: 'none',
            animationDuration: `${animationDuration}s`,
            animationDirection: animationDirection,
          }}
          onClick={() => {
            changeStyle(index);
          }}
        />
      ))}
    </>
  );
};

export default AnimatedCalibrationPoint;
