const Skeleton = ({ variant = 'text', width, height, className = '', count = 1 }) => {
  const shimmer = {
    background: 'linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-card-alt) 50%, var(--bg-hover) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
    borderRadius: '0.5rem',
  };

  const variants = {
    text: { height: height || '14px', width: width || '100%' },
    heading: { height: '24px', width: width || '60%' },
    avatar: { height: height || '40px', width: width || '40px', borderRadius: '9999px' },
    card: { height: height || '120px', width: width || '100%' },
    'table-row': { height: '48px', width: width || '100%' },
    button: { height: '40px', width: width || '120px', borderRadius: '0.75rem' },
    badge: { height: '22px', width: width || '60px', borderRadius: '9999px' },
    chart: { height: height || '280px', width: width || '100%', borderRadius: '1rem' },
  };

  const style = variants[variant] || variants.text;

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-fadeIn ${className}`}
      style={{
        ...shimmer,
        ...style,
        animationDelay: `${i * 0.08}s`,
        marginBottom: variant === 'table-row' && i < count - 1 ? '1px' : variant === 'text' ? '0.5rem' : 0,
      }}
    />
  ));

  if (variant === 'card' || variant === 'chart') {
    return <div style={{ ...shimmer, ...style, borderRadius: '1rem' }} className={className} />;
  }

  if (variant === 'table-row') {
    return <div className="space-y-px">{items}</div>;
  }

  if (count > 1) {
    return <div className="space-y-2">{items}</div>;
  }

  return items[0];
};

// Convenience: CardSkeleton, TableSkeleton, StatsSkeleton
export const CardSkeleton = ({ count = 1 }) => {
  const cols = count >= 3 ? 'lg:grid-cols-3' : count === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1';
  return (
  <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6`}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="glass-card p-6 animate-stagger" style={{ animationDelay: `${i * 0.1}s` }}>
        <div className="w-12 h-12 rounded-xl mb-4" style={{ background: 'var(--bg-hover)', animation: 'shimmer 1.5s ease-in-out infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-card-alt) 50%, var(--bg-hover) 75%)' }} />
        <Skeleton variant="heading" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    ))}
  </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="glass-card overflow-hidden">
    <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <Skeleton variant="heading" width="30%" />
    </div>
    <div className="p-4">
      <Skeleton variant="table-row" count={rows} />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton variant="heading" width="40%" />
    <div className="mt-4">
      <Skeleton variant="chart" height={260} />
    </div>
  </div>
);

export default Skeleton;
