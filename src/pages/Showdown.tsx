import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Swords } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { trackNavigation } from "@/utils/analytics";
import RatingAnimation from "@/components/animations/RatingAnimation";
import BattleAnimation from "@/components/animations/BattleAnimation";

const Showdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRatingClick = () => {
    trackNavigation('showdown_rating_cta');
    window.open('https://t.me/yoursecretsharebot?start=rating', '_blank', 'noopener,noreferrer');
  };

  const handleArenaClick = () => {
    trackNavigation('showdown_arena_cta');
    window.open('https://t.me/YourSecretShareBot?start=arena', '_blank', 'noopener,noreferrer');
  };

  const handleLeaderboardClick = () => {
    trackNavigation('showdown_leaderboard_cta');
    navigate('/leaderboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-purple-900/20">
      <Header />
      
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        {/* Leaderboard Button - Top Right */}
        <div className="flex justify-end mb-4">
          <Button 
            onClick={handleLeaderboardClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            aria-label="View Leaderboard"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              {t('showdown.title')}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {t('showdown.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Private Rating Card */}
          <Card className="card-premium border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                {t('showdown.privateRating.title')}
              </CardTitle>
              <p className="text-muted-foreground text-center text-sm">
                {t('showdown.privateRating.tagline')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-6">
                <RatingAnimation />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span>{t('showdown.privateRating.step1')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span>{t('showdown.privateRating.step2')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span>{t('showdown.privateRating.step3')}</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground animate-pulse-note">
                  {t('showdown.note')}
                </p>
              </div>

              <Button 
                onClick={handleRatingClick}
                className="w-full btn-premium animate-shimmer"
                aria-label="Open Private Rating in Telegram"
              >
                {t('showdown.privateRating.cta')}
              </Button>
            </CardContent>
          </Card>

          {/* Photo Battle Arena Card */}
          <Card className="card-premium border-primary/20 hover:border-primary/40 transition-all duration-300 relative">
            <CardHeader className="relative">
              <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground animate-breathing">
                Subscribers Only
              </Badge>
              <CardTitle className="text-xl font-bold text-center">
                {t('showdown.battleArena.title')}
              </CardTitle>
              <p className="text-muted-foreground text-center text-sm">
                {t('showdown.battleArena.tagline')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-6">
                <BattleAnimation />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span>{t('showdown.battleArena.step1')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span>{t('showdown.battleArena.step2')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span>{t('showdown.battleArena.step3')}</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground animate-pulse-note">
                  {t('showdown.note')}
                </p>
              </div>

              <Button 
                onClick={handleArenaClick}
                className="w-full btn-premium animate-shimmer"
                aria-label="Open Battle Arena in Telegram"
              >
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  <span>{t('showdown.battleArena.cta')}</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <NavigationBar />
    </div>
  );
};

export default Showdown;