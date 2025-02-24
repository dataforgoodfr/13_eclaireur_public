'use client'
export default function HomepageHeader() {
    return (
        <div className="bg-homepage-header bg-cover h-[600px] object-cover">
            <div className="global-margin flex flex-col gap-y-12 items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-semibold">
                    Eclaireur Public
                </h1>
                <h2 className="text-xl font-semibold">
                    Pour une transparence des dépense
                </h2>
                <p className="text-base italic">
                    Derniér mise a jour: le 24 février 2025
                </p>
                </div>
                <div className="border border-black bg-gray-500 rounded-2xl h-72 w-3/5 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold w-3/4 text-center">
                    Comment les dépense publiques sont-elles réparties autour de chez vous ?
                </h2>

                </div>
            </div>
        </div>
    )
}