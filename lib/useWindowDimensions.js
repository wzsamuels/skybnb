import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      if(typeof window !== 'undefined')
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize()
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

