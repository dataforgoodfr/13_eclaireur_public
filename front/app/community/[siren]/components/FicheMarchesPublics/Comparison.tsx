'use client';

type ComparisonProps = {
  siren: string;
};

export default function Comparison({ siren }: ComparisonProps) {
  return (
    <div className="flex h-[600px] w-full items-center justify-center bg-neutral-200">
      En construction
    </div>
  );
}