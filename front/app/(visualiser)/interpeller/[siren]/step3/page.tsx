import InterpellateForm from '@/components/Interpellate/InterpellateForm';
import Stepper from '@/components/Interpellate/Stepper';

export default async function InterpellateStep3({
  params,
}: {
  params: Promise<{ siren: string }>;
}) {
  const { siren } = await params;

  return (
    <section id='interpellation-step3' className='my-16'>
      <article>
        <Stepper currentStep={3} />

        <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Envoyez votre message</h2>
        <InterpellateForm
          missingData=''
          communityParam={siren}
        />
      </article>
    </section>
  );
}
