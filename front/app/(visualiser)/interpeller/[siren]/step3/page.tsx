import InterpellateForm from "@/components/Interpellate/InterpellateForm";





export default function InterpellateStep3({ params }: { params: { siren: string } }) {
  return (
    <section id='interpellation-step3' className='my-16'>
      <article>
        <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Envoyez votre message</h2>
        <InterpellateForm to={['olivier.pretre@gmx.fr', 'toto']} missingData='' communityParam={params.siren} />
      </article>
    </section>
  );
}