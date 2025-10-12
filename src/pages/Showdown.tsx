import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { SocialFooter } from "@/components/SocialFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Swords, RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { trackNavigation } from "@/utils/analytics";
import RatingAnimation from "@/components/animations/RatingAnimation";
import BattleAnimation from "@/components/animations/BattleAnimation";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ShowdownStatus {
  cost: number;
  free: boolean;
  canAfford: boolean;
  gems?: number;
  message: string;
  remaining?: number;
}

interface ShowdownData {
  rating: ShowdownStatus;
  arena: ShowdownStatus;
  gems: number;
  subscription: string | null;
}

const Showdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { telegramUser } = useAuth();
  
  const [showdownStatus, setShowdownStatus] = useState<ShowdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchShowdownStatus();
  }, [telegramUser?.id]);

  const fetchShowdownStatus = async () => {
    if (!telegramUser?.id) {
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const { data, error } = await supabase.functions.invoke('get-showdown-status', {
        body: { telegram_id: telegramUser.id }
      });

      if (error) throw error;
      setShowdownStatus(data);
    } catch (error) {
      console.error('Error fetching showdown status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
        {/* Top Actions Bar */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={fetchShowdownStatus}
            disabled={refreshing}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition gap-2"
            aria-label="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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

        {loading && !showdownStatus ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin text-4xl">⏳</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Private Rating Card */}
            <Card className="card-premium border-primary/20 hover:border-primary/40 transition-all duration-300 relative">
              {/* FREE BADGE - Only show if free trial available */}
              {showdownStatus?.rating.free && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse z-10">
                  🎁 FIRST FREE
                </div>
              )}
              
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

                {/* Dynamic Cost Display */}
                <div className="text-center mb-6">
                  {loading ? (
                    <span className="text-muted-foreground text-2xl">Loading...</span>
                  ) : showdownStatus?.rating.free ? (
                    <span className="text-green-400 text-3xl font-bold animate-pulse">FREE!</span>
                  ) : (
                    <span className="text-yellow-400 text-3xl font-bold">150 💎</span>
                  )}
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

                {/* Status Message */}
                <div className="text-center text-sm text-muted-foreground min-h-[20px]">
                  {loading ? '...' : showdownStatus?.rating.message}
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
                  {loading ? 'Loading...' : showdownStatus?.rating.free ? '🎁 Try Free Rating!' : t('showdown.privateRating.cta')}
                </Button>
              </CardContent>
            </Card>

            {/* Photo Battle Arena Card */}
            <Card className="card-premium border-primary/20 hover:border-primary/40 transition-all duration-300 relative">
              {/* FREE BADGE - Only show if free trials available */}
              {showdownStatus?.arena.free && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse z-10">
                  🎁 {showdownStatus.arena.remaining} FREE
                </div>
              )}
              
              <CardHeader>
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

                {/* Dynamic Cost Display */}
                <div className="text-center mb-6">
                  {loading ? (
                    <span className="text-muted-foreground text-2xl">Loading...</span>
                  ) : showdownStatus?.arena.free ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-green-400 text-3xl font-bold animate-pulse">
                        {showdownStatus.arena.remaining} FREE!
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {showdownStatus.arena.remaining} free {showdownStatus.arena.remaining === 1 ? 'battle' : 'battles'} left
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-yellow-400 text-2xl font-bold">200 💎</span>
                      <span className="text-green-400 text-sm">→ Win 300 💎</span>
                    </div>
                  )}
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

                {/* Status Message */}
                <div className="text-center text-sm text-muted-foreground min-h-[20px]">
                  {loading ? '...' : showdownStatus?.arena.message}
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
                    <span>{loading ? 'Loading...' : showdownStatus?.arena.free ? '🎁 Try Free Battle!' : t('showdown.battleArena.cta')}</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <SocialFooter className="mt-8" />
      </main>

      <NavigationBar />
    </div>
  );
};

export default Showdown;