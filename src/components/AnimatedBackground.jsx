import React from 'react';

const AnimatedBackground = () => {
  // Elements to float across the background
  const elements = [
    { id: 1, icon: '🎓', size: '3rem', delay: '0s', duration: '20s', top: '10%', left: '10%' },
    { id: 2, icon: '📚', size: '2.5rem', delay: '2s', duration: '25s', top: '20%', left: '80%' },
    { id: 3, icon: '🏛️', size: '4rem', delay: '4s', duration: '22s', top: '70%', left: '15%' },
    { id: 4, icon: '💻', size: '2rem', delay: '1s', duration: '18s', top: '60%', left: '75%' },
    { id: 5, icon: '🔬', size: '3.5rem', delay: '5s', duration: '28s', top: '40%', left: '40%' },
    { id: 6, icon: '🎓', size: '2rem', delay: '7s', duration: '19s', top: '80%', left: '50%' },
    { id: 7, icon: '💡', size: '2.8rem', delay: '3s', duration: '24s', top: '30%', left: '60%' },
    { id: 8, icon: '📝', size: '2.2rem', delay: '6s', duration: '21s', top: '15%', left: '30%' },
  ];

  return (
    <div className="animated-background">
      {/* Background glass overlay to keep text legible */}
      <div className="bg-overlay"></div>
      
      {/* Floating 3D Elements */}
      <div className="floating-elements-container">
        {elements.map((el) => (
          <div
            key={el.id}
            className="floating-item"
            style={{
              top: el.top,
              left: el.left,
              fontSize: el.size,
              animationDelay: el.delay,
              animationDuration: el.duration
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
