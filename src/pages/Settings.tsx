
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { SocialFooter } from "@/components/SocialFooter";
import { ArrowLeft, BookOpen, ChevronRight, Crown, Globe, HelpCircle, Phone, Shield, Settings as SettingsIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { FreeGemsButton } from "@/components/FreeGemsButton";
import { EarnModal } from "@/components/EarnModal";
import { adService } from "@/services/adService";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useState, useEffect } from "react";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStats } = useUserData();
  const { t } = useTranslation();
  const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();
  const { user: telegramUser } = useTelegramAuth();
  const [earnModalOpen, setEarnModalOpen] = useState(false);
  
  // Check if current user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = () => {
      const tg = (window as any).Telegram?.WebApp;
      const user = tg?.initDataUnsafe?.user;
      const adminId = 1226785406;
      
      console.log('🔍 Admin check:', {
        telegramId: user?.id,
        isAdmin: user?.id === adminId
      });
      
      setIsAdmin(user?.id === adminId);
    };
    
    checkAdminStatus();
  }, []);

  // Check if user should see Free Gems
  const shouldShowFreeGems = !adService.isPaidUser(userStats?.subscription_type);

  // Check if user is subscribed (has active paid subscription)
  const isSubscribed = adService.isPaidUser(userStats?.subscription_type);

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/store') return 'upgrade';
    if (path === '/settings') return 'settings';
    return 'characters';
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'characters') {
      navigate('/');
    } else if (tab === 'upgrade') {
      navigate('/store');
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      {/* Header with back button and Free Gems */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-base font-semibold text-gradient ml-3">{t('settings.title')}</h1>
        </div>
        {shouldShowFreeGems && (
          <FreeGemsButton 
            onClick={() => setEarnModalOpen(true)}
            size="sm"
          />
        )}
      </div>

      <div className="px-4 py-3 space-y-6">
        {/* My Plan */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t('settings.myPlan')}</h2>
          <Card className="card-premium transition-smooth p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSubscribed 
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-600' 
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {isSubscribed 
                      ? (userStats?.subscription_type?.charAt(0).toUpperCase() + userStats?.subscription_type?.slice(1) + ' Plan')
                      : t('settings.freePlan')
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isSubscribed ? t('settings.unlimitedConversations') : t('settings.limitedConversations')}
                  </div>
                </div>
              </div>
              {!isSubscribed && (
                <Button variant="premium" size="sm" onClick={() => navigate('/store')}>
                  {t('settings.upgrade')}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* App Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t('settings.appSettings')}</h2>
          <Card className="card-premium transition-smooth p-4 cursor-pointer" onClick={() => navigate('/language-selection')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {availableLanguages.find(lang => lang.code === currentLanguage)?.nativeName || 'English'}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('settings.appLanguage')}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Help & Support */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t('settings.helpSupport')}</h2>
          <div className="space-y-3">
            {/* Admin Panel - Only visible to admin */}
            {isAdmin && (
              <Card className="card-premium transition-smooth p-4 cursor-pointer bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20" onClick={() => navigate('/admin/blog')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SettingsIcon className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">Admin Panel</div>
                      <div className="text-xs text-muted-foreground">Manage blog posts</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            )}

            <Card className="card-premium transition-smooth p-4 cursor-pointer" onClick={() => navigate('/blog')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">Blog</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer" onClick={() => navigate('/help-center')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">{t('settings.helpCenter')}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer" onClick={() => navigate('/contact-support')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">{t('settings.contactSupport')}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>

            <Card className="card-premium transition-smooth p-4 cursor-pointer" onClick={() => navigate('/privacy-policy')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div className="text-sm font-semibold text-foreground">{t('settings.privacyPolicy')}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Footer */}
      <SocialFooter className="border-t border-border/50" />

      <NavigationBar />

      {/* Earn Modal */}
      <EarnModal 
        open={earnModalOpen}
        onOpenChange={setEarnModalOpen}
        userId={telegramUser?.id}
        subscriptionType={userStats?.subscription_type}
      />
    </div>
  );
};

export default Settings;
