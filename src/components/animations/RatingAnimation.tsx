import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RatingAnimation = () => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('/animations/rating.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load rating animation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimation();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-card/20 backdrop-blur-sm rounded-lg border border-primary/10 transition-smooth">
        <div 
          className="animate-pulse bg-primary/20 rounded"
          style={{
            width: isMobile ? 300 : 280,
            height: isMobile ? 214 : 200
          }}
        />
      </div>
    );
  }

  if (!animationData) {
    return null;
  }

  return (
    <div className="flex items-center justify-center bg-card/20 backdrop-blur-sm rounded-lg border border-primary/10 transition-smooth">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: isMobile ? 300 : 280,
          height: isMobile ? 214 : 200
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
};

export default RatingAnimation;