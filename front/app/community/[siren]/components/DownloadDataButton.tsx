import { ActionButton } from '#components/ui/action-button';
import { ArrowDownToLine } from 'lucide-react';

type DownloadDataButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function DownloadDataButton({ onClick, disabled }: DownloadDataButtonProps) {
  return (
    <ActionButton
      icon={<ArrowDownToLine />}
      variant='default'
      onClick={onClick}
      disabled={disabled}
    />
  );
}
