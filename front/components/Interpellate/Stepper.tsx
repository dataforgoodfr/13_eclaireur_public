type StepperProps = {
  currentStep: number;
  numberOfSteps: number;
};
export default function Stepper({ currentStep, numberOfSteps }: StepperProps) {
  const activeColor = (index: number) =>
    currentStep-1 >= index ? 'text-white bg-gray-950' : 'text-gray-600 bg-gray-300';
  const isFinalStep = (index: number) => index === numberOfSteps - 1;

  return (
    <div className='flex'>
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <div key={index} className='flex items-center'>
          <div
            className={`h-14 w-14 rounded-full text-center text-2xl font-bold leading-[3rem] ${activeColor(index)}`}
          >
            {index+1}
          </div>
          {isFinalStep(index) ? null : <div className={`h-1 w-48 ${activeColor(index+1)}`}></div>}
        </div>
      ))}
    </div>
  );
}
