import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Flame, Loader2, ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { trackNavigation } from "@/utils/analytics";

interface LeaderboardEntry {
  rank: number;
  champion_name: string;
  score: number;
  wins: number;
  losses: number;
}

interface BadgeEntry {
  champion_name: string;
  wins?: number;
  win_rate?: number;
  best_streak?: number;
  badge: string;
}

interface LeaderboardData {
  period: 'alltime' | 'monthly';
  leaderboard: LeaderboardEntry[];
  badges: {
    most_wins: BadgeEntry[];
    best_win_rate: BadgeEntry[];
    hottest_streak: BadgeEntry[];
  };
}

const Leaderboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'alltime' | 'monthly'>('monthly');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (selectedPeriod: 'alltime' | 'monthly') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://secret-share-backend-production.up.railway.app/api/arena/leaderboard?period=${selectedPeriod}&limit=50`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(period);
    trackNavigation(`leaderboard_${period}`);
  }, [period]);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-purple-900/20">
      <Header />
      
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Button 
            onClick={() => navigate('/showdown')}
            variant="outline"
            className="gap-2"
            aria-label="Back to Showdown"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              Dick Battle Arena
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Leaderboard</h2>
        </div>

        {/* Period Tabs */}
        <Tabs value={period} onValueChange={(value) => setPeriod(value as 'alltime' | 'monthly')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alltime">All Time</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="card-premium">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => fetchLeaderboard(period)} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : data ? (
          <>
            {/* Badges Section */}
            {(data.badges.most_wins.length > 0 || data.badges.best_win_rate.length > 0 || data.badges.hottest_streak.length > 0) && (
              <Card className="card-premium border-primary/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    🏆 Top Champions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.badges.most_wins[0] && (
                    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                      <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Most Wins</p>
                        <p className="font-bold text-foreground">
                          {data.badges.most_wins[0].champion_name} - {data.badges.most_wins[0].wins} wins
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {data.badges.best_win_rate[0] && (
                    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                      <Target className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Best Win Rate</p>
                        <p className="font-bold text-foreground">
                          {data.badges.best_win_rate[0].champion_name} - {data.badges.best_win_rate[0].win_rate?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {data.badges.hottest_streak[0] && (
                    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                      <Flame className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Hottest Streak</p>
                        <p className="font-bold text-foreground">
                          {data.badges.hottest_streak[0].champion_name} - {data.badges.hottest_streak[0].best_streak} wins
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Leaderboard */}
            <Card className="card-premium border-primary/20">
              <CardContent className="p-0">
                {data.leaderboard.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No champions yet. Be the first to compete!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-4 px-4 text-center font-semibold text-sm text-muted-foreground">
                            Rank
                          </th>
                          <th className="py-4 px-4 text-left font-semibold text-sm text-muted-foreground">
                            Champion Name
                          </th>
                          <th className="py-4 px-4 text-right font-semibold text-sm text-muted-foreground">
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.leaderboard.map((entry) => (
                          <tr 
                            key={`${entry.rank}-${entry.champion_name}`}
                            className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors"
                          >
                            <td className="py-4 px-4 text-center text-lg">
                              {getRankDisplay(entry.rank)}
                            </td>
                            <td className="py-4 px-4 font-bold text-foreground truncate max-w-[200px]">
                              {entry.champion_name}
                            </td>
                            <td className="py-4 px-4 text-right font-bold text-xl text-primary">
                              {entry.score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>

      <NavigationBar />
    </div>
  );
};

export default Leaderboard;
