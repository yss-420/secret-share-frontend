import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BattleAnimation = () => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('/animations/battle.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load battle animation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimation();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-card/20 backdrop-blur-sm rounded-lg border border-muted/10 transition-smooth opacity-60">
        <div 
          className="animate-pulse bg-muted/20 rounded"
          style={{
            width: isMobile ? 285 : 265,
            height: isMobile ? 203 : 189
          }}
        />
      </div>
    );
  }

  if (!animationData) {
    return null;
  }

  return (
    <div className="flex items-center justify-center bg-card/20 backdrop-blur-sm rounded-lg border border-muted/10 transition-smooth opacity-60">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: isMobile ? 285 : 265,
          height: isMobile ? 203 : 189
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
};

export default BattleAnimation;