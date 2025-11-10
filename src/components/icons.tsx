import { IconSvgProps } from "@/types";

export const Logo = ({ size = 32, ...props }: IconSvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" fill="currentColor" />
  </svg>
);

export const SearchIcon = ({ size = 18, ...props }: IconSvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <path
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-1-4.35-4.35"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Minimal placeholders for other icons (keep named exports for compatibility)
export const DiscordIcon = (_props?: any) => <span>🐙</span>;
export const TwitterIcon = (_props?: any) => <span>🐦</span>;
export const GithubIcon = (_props?: any) => <span>🐱</span>;
export const MoonFilledIcon = (_props?: any) => <span>🌙</span>;
export const SunFilledIcon = (_props?: any) => <span>☀️</span>;
export const HeartFilledIcon = (_props?: any) => <span>❤</span>;
