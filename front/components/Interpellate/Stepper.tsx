type StepperProps = {
  currentStep: number;
  numberOfSteps?: number;
};
const stepLabels = ['Rechercher', 'Contact', 'Coordonnées', 'Envoyé'];
export default function Stepper({ currentStep, numberOfSteps = 4 }: StepperProps) {
  const activeColor = (index: number) =>
    currentStep - 1 >= index ? 'text-white bg-primary-800' : 'text-white bg-muted';
  const activeTextColor = (index: number) =>
    currentStep - 1 >= index ? 'text-primary-800' : 'text-muted';
  const isFinalStep = (index: number) => index === numberOfSteps - 1;
  return (
    <div className='global-margin md:pl-ms-0 flex flex-nowrap justify-start gap-0 pl-8 md:gap-2'>
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <div key={index} className='flex items-baseline font-kanit-bold'>
          <div className='owerflow-visible flex h-[3.5rem] w-[1.875rem] flex-col items-center md:w-auto md:flex-row'>
            <div
              className={`h-[1.875rem] w-[1.875rem] rounded-full text-center text-lg leading-8 ${activeColor(index)}`}
            >
              {index + 1}
            </div>
            <div className={`${activeTextColor(index)} px-3`}>{stepLabels[index]}</div>
          </div>

          {isFinalStep(index) ? null : (
            <div
              className={`relative top-[-7px] h-[1px] w-20 min-w-6 md:w-[120px] ${activeColor(index + 1)}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
