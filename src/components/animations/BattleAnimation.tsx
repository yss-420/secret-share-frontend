import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BattleAnimation = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-center bg-card/20 backdrop-blur-sm rounded-lg border border-muted/10 transition-smooth opacity-60">
      <DotLottieReact
        src="/animations/battle.json"
        loop
        autoplay
        style={{
          width: isMobile ? 300 : 280,
          height: isMobile ? 214 : 200
        }}
      />
    </div>
  );
};

export default BattleAnimation;