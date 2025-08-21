import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LanguageSelection = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/settings")}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('settings.appLanguage')}</h1>
        </div>

        <div className="space-y-3">
          {availableLanguages.map((language) => (
            <Card 
              key={language.code}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleLanguageChange(language.code)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm text-muted-foreground">{language.name}</div>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;