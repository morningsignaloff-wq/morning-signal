interface PageBackgroundProps {
  children: React.ReactNode;
}

export function PageBackground({ children }: PageBackgroundProps) {
  return (
    <div className="page-bg">
      <div className="page-content">{children}</div>
    </div>
  );
}
