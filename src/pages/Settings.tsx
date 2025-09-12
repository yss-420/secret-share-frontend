
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { NavigationBar } from "@/components/NavigationBar";
import { SocialFooter } from "@/components/SocialFooter";
import { ArrowLeft, ChevronRight, Crown, Globe, HelpCircle, Phone, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { FreeGemsButton } from "@/components/FreeGemsButton";
import { EarnModal } from "@/components/EarnModal";
import { adService } from "@/services/adService";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useState } from "react";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStats } = useUserData();
  const { t } = useTranslation();
  const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();
  const { user: telegramUser } = useTelegramAuth();
  const [earnModalOpen, setEarnModalOpen] = useState(false);

  // Check if user should see Free Gems
  const shouldShowFreeGems = !adService.isPaidUser(userStats?.subscription_type);

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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {userStats?.subscription_type || t('settings.freePlan')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {userStats?.tier === 'premium' ? t('settings.unlimitedConversations') : t('settings.limitedConversations')}
                  </div>
                </div>
              </div>
              <Button variant="premium" size="sm" onClick={() => navigate('/store')}>
                {t('settings.upgrade')}
              </Button>
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

      <NavigationBar activeTab={getActiveTab()} onTabChange={handleTabChange} />

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
