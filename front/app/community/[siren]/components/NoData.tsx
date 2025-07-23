export function NoData() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-600">Aucune donnée disponible</p>
        <p className="text-sm text-gray-500 mt-1">
          Il n&apos;y a pas de données à afficher pour le moment.
        </p>
      </div>
    </div>
  );
}
