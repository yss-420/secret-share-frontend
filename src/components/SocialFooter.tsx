import { Instagram } from "lucide-react";

interface SocialFooterProps {
  className?: string;
}

export const SocialFooter = ({ className = "" }: SocialFooterProps) => {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/secretshare.ai/",
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
    },
    {
      name: "X",
      url: "https://x.com/secret_share0",
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: "Pinterest",
      url: "https://pinterest.com/yoursecretshare/",
      icon: (
        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.562-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
        </svg>
      ),
    },
    {
      name: "Ko-fi",
      url: "https://ko-fi.com/secretshare",
      icon: <img src="/lovable-uploads/f57d4e98-b536-4e4c-8dce-9d7265bfca2c.png" alt="Ko-fi" className="w-5 h-5 object-contain" loading="eager" />,
    },
  ];

  return (
    <div className={`flex justify-center items-center gap-6 py-4 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-200 flex items-center justify-center hover:scale-110"
          aria-label={`Visit our ${social.name} page`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};