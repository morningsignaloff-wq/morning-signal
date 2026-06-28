interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return <div className="marketing-bg min-h-screen">{children}</div>;
}
