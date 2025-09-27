import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Gem } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { trackNavigation } from "@/utils/analytics";

const Showdown = () => {
  const { t } = useTranslation();

  const handleRatingClick = () => {
    trackNavigation('showdown_rating_cta');
    window.open('https://t.me/yoursecretsharebot?start=rating', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-purple-900/20">
      <Header />
      
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <Trophy className="w-8 h-8 text-primary" />
              <Star className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
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
                <div className="flex items-center gap-2">
                  <span>{t('showdown.privateRating.cta')}</span>
                  <div className="flex items-center gap-1">
                    <span>150</span>
                    <Gem className="w-4 h-4" />
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Photo Battle Arena Card */}
          <Card className="card-premium border-muted/20 relative">
            <Badge className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse-note">
              {t('showdown.battleArena.comingSoon')}
            </Badge>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center text-muted-foreground">
                {t('showdown.battleArena.title')}
              </CardTitle>
              <p className="text-muted-foreground text-center text-sm">
                {t('showdown.battleArena.tagline')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 opacity-60">
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-muted/20 text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span>{t('showdown.battleArena.step1')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-muted/20 text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span>{t('showdown.battleArena.step2')}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="bg-muted/20 text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                disabled
                className="w-full bg-muted/20 text-muted-foreground cursor-not-allowed"
              >
                {t('showdown.battleArena.cta')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <NavigationBar activeTab="showdown" onTabChange={(tab) => trackNavigation(tab)} />
    </div>
  );
};

export default Showdown;