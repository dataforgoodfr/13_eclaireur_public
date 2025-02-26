import Link from "next/link"

export default function Footer() {
  return (
    <div className='bg-neutral-400 mx-auto max-w-screen-lg w-full p-4 md:p-6'>
      <div className="flex items-center justify-start space-x-3 pb-4">
        <div>
          <h2 className="text-xl md:text-3xl font-extrabold">Éclaireur Public</h2>
          <div className="text-lg md:text-2xl font-bold">Pour une transparence des dépenses</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
        <div className="grid grid-cols-2 col-span-1 gap-1 text-center text-sm md:text-base">
          <Link href={"/methodology"} className="text-white bg-neutral-700 hover:bg-neutral-800 p-1 rounded flex items-center justify-center">Méthodologie</Link>
          <div className="text-white bg-neutral-700 hover:bg-neutral-800 p-1 rounded flex items-center justify-center">Télécharger les données</div>
          <a href="mailto:" className="text-white bg-neutral-700 hover:bg-neutral-800 p-1 rounded flex items-center justify-center">Contact</a>
          <Link href={"/faq"} className="text-white bg-neutral-700 hover:bg-neutral-800 p-1 rounded flex items-center justify-center">FAQ</Link>
        </div>
        <div className="col-span-1">
          <div className="leading-7">
            Projet mené par
            <a href="https://dataforgood.fr/" target="_blank" className="relative rounded-md bg-neutral-400 hover:bg-neutral-300 px-1 -my-2 whitespace-nowrap inline-flex items-baseline">
              <img src="dataforgoodLogo.png" alt="logo de Data For Good" className="absolute top-1/2 -translate-y-1/2 w-4 h-4"/>
              <span className="pl-5 font-semibold">Data For Good</span>
            </a>
            en partenariat avec
            <a href="https://www.anticor.org/" target="_blank" className="relative rounded-md bg-neutral-400 hover:bg-neutral-300 px-1 py-0 whitespace-nowrap inline-flex items-baseline">
              <img src="anticorLogo.png" alt="logo de Anticor" className="absolute top-1/2 -translate-y-1/2 h-4"/>
              <span className="pl-12 font-semibold">Anticor</span>
            </a>
            et
            <a href="https://transparency-france.org/" target="_blank" className="relative rounded-md bg-neutral-400 hover:bg-neutral-300 px-1 py-0 whitespace-nowrap inline-flex items-baseline">
              <img src="transparencyLogo.png" alt="logo de Transparency International" className="absolute top-1/2 -translate-y-1/2 w-4 h-4"/>
              <span className="pl-5 font-semibold">Transparency International</span>
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 pt-6 text-white text-sm">
        <Link href={"/legal"} className="hover:text-neutral-200">Mentions légales</Link>
        <Link href={"/license"} className="hover:text-neutral-200">Licence d'utilisation</Link>
      </div>
    </div>
  )
}
