type BudgetGlobalProps = {
  communityName: string;
};
export default function BudgetGlobal({ communityName }: BudgetGlobalProps) {
  return (
    <div className='right max-w-[300] px-4 py-2 font-bold'>
      Budget Global : <span>XX,X Mds</span>
    </div>
  );
}
