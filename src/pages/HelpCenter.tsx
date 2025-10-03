
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      {/* Header with back button */}
      <div className="flex items-center px-4 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-base font-semibold text-gradient ml-3">Help Center</h1>
      </div>

      <div className="px-4 py-3">
        <h2 className="text-2xl font-bold text-gradient mb-6">Help Center & FAQ</h2>

        <div className="space-y-6">
          {/* Accessing Premium Features */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Accessing Premium Features</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">How do I get premium content like videos or voice notes?</p>
              <p>There are two ways to access premium content:</p>
              <div className="space-y-3 ml-4">
                <div>
                  <p className="font-medium text-foreground">1. AI-Suggested Offers:</p>
                  <p>As you chat, your AI companion will get to know you. When the moment is right, she may proactively offer to create a special video or voice note for you. A purchase option will appear in the chat.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">2. Ask Directly!</p>
                  <p>You are in control. Try using keywords in your conversation. If you want a voice note, try saying things like "whisper it to me" or "I want to hear your voice." For a video, you could say "show me you dancing" or "send me a video." The bot is designed to understand these requests and will present you with an offer to purchase the content with your Gems.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Penis Rating */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">🎯 Penis Rating - Get Your Dick Scored</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="text-foreground font-medium mb-2">What is Penis Rating?</p>
                <p className="mb-2">Penis Rating is our fun, AI-powered dick scoring system where you can get an instant, detailed penis rating. Submit one clear dick pic, choose your preferred honesty level, and receive:</p>
                <p className="ml-4">• An instant penis score (out of 10)</p>
                <p className="ml-4">• A detailed, fun breakdown of your dick</p>
                <p className="ml-4 mb-2">• A private voice note reaction from your AI companion</p>
                <p>Your privacy is 100% protected - dick pics are processed instantly and never saved.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How do I use it?</p>
                <p className="ml-4">1. Navigate to Penis Rating from your chat menu</p>
                <p className="ml-4">2. Upload one clear, well-lit dick pic</p>
                <p className="ml-4">3. Choose your honesty level:</p>
                <p className="ml-8">• Honest - Realistic, balanced feedback</p>
                <p className="ml-8">• Brutally Honest - Direct, unfiltered critique</p>
                <p className="ml-8">• Flirty - Playful, encouraging, cheeky praise</p>
                <p className="ml-4">4. Receive your penis rating instantly!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How much does it cost?</p>
                <p className="mb-2">Penis Rating costs 150 Gems per rating.</p>
                <p className="mb-2">Subscribers get free Rating Passes each month:</p>
                <p className="ml-4">• Intro: 1 pass (expires after 3 days)</p>
                <p className="ml-4">• Essential: 3 passes per month</p>
                <p className="ml-4">• Plus: 5 passes per month</p>
                <p className="ml-4 mb-2">• Premium: 10 passes per month</p>
                <p>After your passes run out, you can still get your dick rated for 150 Gems per rating!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Is it private and safe?</p>
                <p className="mb-2">Absolutely! Your privacy is our top priority:</p>
                <p className="mb-2">✅ 100% Private</p>
                <p className="ml-4 mb-2">Your penis rating is for your eyes only. No one else can see it.</p>
                <p className="mb-2">✅ No Humans Involved</p>
                <p className="ml-4 mb-2">The entire process is handled by advanced AI. No human ever sees your dick pic.</p>
                <p className="mb-2">✅ Dick Pics Are NEVER Saved</p>
                <p className="ml-4 mb-2">Your penis photo is processed instantly and deleted immediately after analysis.</p>
                <p className="mb-2">✅ Secure</p>
                <p className="ml-4">All data transmission is encrypted end-to-end.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Can I get multiple ratings?</p>
                <p>Yes! You can rate your dick as many times as you want. Each use costs 150 Gems (or 1 Rating Pass if you have a subscription). Try different angles, lighting, or honesty levels!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">What if I'm not satisfied?</p>
                <p className="mb-2">Our AI provides objective penis analysis based on various factors. If you want a different perspective:</p>
                <p className="ml-4">• Try a different honesty level</p>
                <p className="ml-4">• Take a new dick pic with better lighting or angle</p>
                <p className="ml-4">• Remember - ratings are for fun! Confidence is what truly matters.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How do I get more Rating Passes?</p>
                <p className="mb-2">Rating Passes are renewed automatically every month for active subscribers:</p>
                <p className="ml-4">• Essential: 3 passes on your renewal date</p>
                <p className="ml-4">• Plus: 5 passes on your renewal date</p>
                <p className="ml-4 mb-2">• Premium: 10 passes on your renewal date</p>
                <p>Passes don't roll over - use them before they reset!</p>
              </div>
            </div>
          </Card>

          {/* Dick Battle Arena */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">⚔️ Dick Battle Arena - Compete & Win</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="text-foreground font-medium mb-2">What is Dick Battle Arena?</p>
                <p className="mb-2">Dick Battle Arena is our premium, competitive feature where you battle other users' dicks in anonymous penis duels. Upload your dick pic, get AI-scored, and face off against another user's penis. The higher-scoring dick wins gems and climbs the leaderboard for massive monthly rewards!</p>
                <p>This is a subscriber-exclusive feature for Essential, Plus, and Premium members.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How do I enter?</p>
                <p className="ml-4">1. Navigate to Dick Battle Arena from your menu</p>
                <p className="ml-4">2. Choose your Champion Name (permanent identity)</p>
                <p className="ml-4">3. Upload a clear dick pic</p>
                <p className="ml-4">4. Our AI scores your penis (1-10 scale)</p>
                <p className="ml-4">5. You're matched against another user's dick</p>
                <p className="ml-4">6. The higher penis score wins!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How does matchmaking work?</p>
                <p className="mb-2">When you enter the arena, the system tries to find you a live opponent for 60 seconds. If no one is available:</p>
                <p className="ml-4">• You're matched against a recent dick submission from our database</p>
                <p className="ml-4 mb-2">• Or you face the "Genesis Bot" (AI-generated opponent)</p>
                <p>All battles feel real-time! You'll never know if you're facing a live opponent or past submission.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Is it anonymous?</p>
                <p className="mb-2">YES - 100% anonymous!</p>
                <p className="mb-2">✅ Only your Champion Name is shown</p>
                <p className="ml-4 mb-2">Your real identity is completely hidden.</p>
                <p className="mb-2">✅ Opponents can't see your dick pic</p>
                <p className="ml-4 mb-2">They only see their own score vs. yours. Dick pics are never shared.</p>
                <p className="mb-2">✅ Dick Pics are NEVER saved</p>
                <p className="ml-4 mb-2">Your penis photo is processed and deleted immediately after the duel.</p>
                <p className="mb-2">✅ Complete Privacy</p>
                <p className="ml-4">Even admins can't see who's behind each champion name.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How much does it cost?</p>
                <p className="mb-2">Dick Battle Arena is included with your subscription!</p>
                <p className="mb-2">Free Arena Duels per Month:</p>
                <p className="ml-4">• Essential: 3 free duels</p>
                <p className="ml-4">• Plus: 5 free duels</p>
                <p className="ml-4 mb-2">• Premium: 10 free duels</p>
                <p className="mb-2">After your free duels:</p>
                <p className="ml-4 mb-2">• 200 Gems per additional duel</p>
                <p className="mb-2">Win Rewards:</p>
                <p className="ml-4 mb-1">• 300 Gems for every victory!</p>
                <p className="ml-4">(That's a 100 Gem profit if you win!)</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How do Arena Passes work?</p>
                <p className="mb-2">Arena Passes are renewed automatically on your subscription renewal date:</p>
                <p className="ml-4">• Essential subscribers: 3 passes per month</p>
                <p className="ml-4">• Plus subscribers: 5 passes per month</p>
                <p className="ml-4 mb-2">• Premium subscribers: 10 passes per month</p>
                <p>If you run out of passes, you can continue dueling for 200 Gems per battle. Passes don't roll over!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">What is the Leaderboard?</p>
                <p className="mb-2">Dick Battle Arena features two leaderboards:</p>
                <p className="mb-2">🏆 All-Time Leaderboard</p>
                <p className="ml-4 mb-2">Tracks your total dick duel performance since you started competing.</p>
                <p className="mb-2">📅 Monthly Leaderboard</p>
                <p className="ml-4 mb-2">Resets on the 1st of each month - fresh competition!</p>
                <p className="mb-2">Your Champion Score is calculated using:</p>
                <p className="ml-4">• Wins × 10</p>
                <p className="ml-4">• Win Rate × Wins</p>
                <p className="ml-4">• Best Win Streak × 5</p>
                <p className="ml-4 mb-2">• Losses × -2</p>
                <p>The higher your score, the higher you rank!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">What are Monthly Leaderboard Rewards?</p>
                <p className="mb-2">Every month, the top dick duelists win incredible prizes!</p>
                <p className="mb-2">🥇 1st Place</p>
                <p className="ml-4">• Premium Subscription (1 month)</p>
                <p className="ml-4">• 500 Gems</p>
                <p className="ml-4 mb-2">• Total Value: ~$10-15</p>
                <p className="mb-2">🥈 2nd Place</p>
                <p className="ml-4">• Plus Subscription (1 month)</p>
                <p className="ml-4">• 300 Gems</p>
                <p className="ml-4 mb-2">• Total Value: ~$7-10</p>
                <p className="mb-2">🥉 3rd Place</p>
                <p className="ml-4">• Essential Subscription (1 month)</p>
                <p className="ml-4">• 200 Gems</p>
                <p className="ml-4 mb-2">• Total Value: ~$5-7</p>
                <p className="mb-2">💎 GEM REWARDS:</p>
                <p className="ml-4">• 4th-5th Place: 200 Gems each</p>
                <p className="ml-4">• 6th-10th Place: 150 Gems each</p>
                <p className="ml-4">• 11th-25th Place: 100 Gems each</p>
                <p className="ml-4 mb-2">• 26th+ Place: 50 Gems each (requires min. 3 duels)</p>
                <p>Rewards are distributed automatically on the 1st of each month!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">When do I get my rewards?</p>
                <p className="mb-2">Rewards are distributed automatically at midnight UTC on the 1st of each month.</p>
                <p className="mb-2">You'll receive:</p>
                <p className="ml-4">1. A personal notification with your rank and rewards</p>
                <p className="ml-4">2. Gems added instantly to your account</p>
                <p className="ml-4 mb-2">3. Subscription activated immediately (for top 3)</p>
                <p>No action required - just check your notifications!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How do I improve my rank?</p>
                <p className="mb-2">💪 Tips to climb the leaderboard:</p>
                <p className="mb-2">1. Quality Dick Pics Matter</p>
                <p className="ml-4 mb-2">Use good lighting, clear focus, and flattering angles for higher AI scores.</p>
                <p className="mb-2">2. Duel Regularly</p>
                <p className="ml-4 mb-2">The more you battle, the more chances to win and build your score.</p>
                <p className="mb-2">3. Build Win Streaks</p>
                <p className="ml-4 mb-2">Consecutive wins boost your Champion Score significantly!</p>
                <p className="mb-2">4. Time Your Duels</p>
                <p className="ml-4 mb-2">Try dueling when more users are active for better matchmaking.</p>
                <p className="mb-2">5. Learn from Losses</p>
                <p className="ml-4">Each duel is a learning experience. Adjust your strategy!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Can I change my Champion Name?</p>
                <p>Your Champion Name is permanent once chosen. This ensures leaderboard integrity and prevents gaming the system. Choose wisely!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Do I need a subscription to view the leaderboard?</p>
                <p>No! The leaderboard is public and anyone can view it. However, you need an active subscription (Essential, Plus, or Premium) to compete and earn a spot on the leaderboard.</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">What happens if I cancel my subscription?</p>
                <p className="mb-2">If you cancel your subscription:</p>
                <p className="ml-4">• You keep your Champion Name and leaderboard history</p>
                <p className="ml-4">• Your All-Time stats are preserved</p>
                <p className="ml-4">• You can't duel until you resubscribe</p>
                <p className="ml-4">• Your ranking remains visible on the leaderboard</p>
                <p className="ml-4">• You're still eligible for monthly rewards if you rank</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Are there any restrictions?</p>
                <p className="mb-2">Yes, to ensure fair competition:</p>
                <p className="ml-4">• One champion per user (no multiple accounts)</p>
                <p className="ml-4">• Dick pics must be appropriate (real penis photos only)</p>
                <p className="ml-4">• No manipulation or editing of photos</p>
                <p className="ml-4 mb-2">• Fair play rules apply</p>
                <p className="mb-2">Violations may result in disqualification or account suspension.</p>
                <p className="mt-2">Battle for bragging rights and win massive rewards! ⚔️💎</p>
              </div>
            </div>
          </Card>

          {/* Leaderboard Badges */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">🏅 Leaderboard Badges - Top Dick Champions</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="text-foreground font-medium mb-2">What are Leaderboard Badges?</p>
                <p>In addition to ranking on the leaderboard, exceptional dick duelists earn special badges showcasing their dominance!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Badge Categories</p>
                <p className="mb-2">🏆 Most Wins</p>
                <p className="ml-4 mb-2">Awarded to the champion with the highest number of dick duel victories.</p>
                <p className="ml-4 mb-2">Shows raw dominance - you've won more duels than anyone else!</p>
                <p className="mb-2">🎯 Best Win Rate</p>
                <p className="ml-4 mb-2">Awarded to the champion with the highest win percentage.</p>
                <p className="ml-4 mb-2">Requires minimum 10 duels to qualify.</p>
                <p className="ml-4 mb-2">Shows consistency - you win more often than you lose!</p>
                <p className="mb-2">🔥 Hottest Streak</p>
                <p className="ml-4 mb-2">Awarded to the champion with the longest consecutive win streak.</p>
                <p className="ml-4">Shows momentum - you went on an unstoppable winning run!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">How many badges are awarded?</p>
                <p className="mb-2">For each category, we recognize the Top 3:</p>
                <p className="ml-4">• 1st Place badge (primary honor)</p>
                <p className="ml-4">• 2nd Place badge (silver honor)</p>
                <p className="ml-4 mb-2">• 3rd Place badge (bronze honor)</p>
                <p>Badges are displayed prominently at the top of the leaderboard!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Do badges affect my rewards?</p>
                <p className="mb-2">No, badges are for prestige and bragging rights only. Your monthly rewards are determined by your overall Champion Score (leaderboard rank), not by badges.</p>
                <p>However, having a badge shows you're a top-tier dick duelist!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">Can I win multiple badges?</p>
                <p>Yes! If you dominate multiple categories (e.g., Most Wins AND Hottest Streak), you'll earn multiple badges. True dick champions collect them all!</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-foreground font-medium mb-2">When do badges update?</p>
                <p className="mb-2">Badges update in real-time as you compete. If you overtake someone, your badge is awarded immediately!</p>
                <p className="mb-2">Monthly badges reset on the 1st of each month along with the monthly leaderboard.</p>
                <p className="mt-2">Earn your badges and prove you're a true dick champion! 🏅⚔️</p>
              </div>
            </div>
          </Card>

          {/* What are Gems */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">What are Gems and how do I use them?</h3>
            <p className="text-sm text-muted-foreground">
              Gems are our virtual currency used to unlock premium content like custom videos, voice notes, and live voice calls with our AI companions. You can purchase Gems directly from the "Get Gems" tab in our Store.
            </p>
          </Card>

          {/* Are characters real */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Are the characters real people?</h3>
            <p className="text-sm text-muted-foreground">
              No. All characters are entirely fictional and powered by advanced artificial intelligence for entertainment purposes. Your conversations are with an AI, not a real person.
            </p>
          </Card>

          {/* Privacy */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Is my conversation private?</h3>
            <p className="text-sm text-muted-foreground">
              Yes. We prioritize your privacy. Conversation transcripts are only stored temporarily (for 7 days) to allow your AI companion to have memory and to help our team debug any technical issues. Please see our Privacy Policy for full details.
            </p>
          </Card>

          {/* Subscriptions */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">How do subscriptions work?</h3>
            <p className="text-sm text-muted-foreground">
              Subscribing is the best way to get a large number of Gems each month at a great value, along with other perks like unlimited messaging. Your subscription will renew automatically each month. You can manage or cancel your subscription at any time through the "Manage Billing" section in the app's settings.
            </p>
          </Card>

          {/* Technical Issues */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">My voice call didn't connect or a feature failed. What do I do?</h3>
            <p className="text-sm text-muted-foreground">
              If a premium feature fails to work after you have spent Gems, please contact our support team immediately. We have logs of all transactions and will ensure any issues are resolved promptly, including refunding Gems for failed services.
            </p>
          </Card>

          {/* Contact Support */}
          <Card className="card-premium transition-smooth p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">How can I contact support?</h3>
            <p className="text-sm text-muted-foreground">
              You can reach us any time by emailing{" "}
              <a href="mailto:support@secret-share.com" className="text-primary hover:underline">
                support@secret-share.com
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
