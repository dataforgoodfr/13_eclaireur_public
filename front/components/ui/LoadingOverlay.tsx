type LoadingOverlayProps = {
  isVisible: boolean;
  color?: string;
  message?: string;
  opacity?: 'light' | 'medium' | 'heavy';
};

const OPACITY_CLASSES = {
  light: 'bg-white/40 backdrop-blur-sm',
  medium: 'bg-white/70',
  heavy: 'bg-white/90',
} as const;

export default function LoadingOverlay({
  isVisible,
  color = 'bg-primary',
  message = 'Chargement des données...',
  opacity = 'light',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center rounded-lg ${OPACITY_CLASSES[opacity]}`}
    >
      <div className='flex items-center gap-2' style={{ color }}>
        <div
          className='h-5 w-5 animate-spin rounded-full border-2 border-t-transparent'
          style={{ borderColor: color }}
        />
        <span>{message}</span>
      </div>
    </div>
  );
}
