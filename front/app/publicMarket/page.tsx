"use client"

import { useState, useEffect} from "react";
import Stats from "@/components/publicMarket/Stats";
import MarketByActivities from "@/components/publicMarket/MarketByActivities";
import MarketType from "@/components/publicMarket/MarketType";
import MarketProcess from "@/components/publicMarket/MarketProcess";
import MarketAndAmount from "@/components/publicMarket/MarketAndAmount";
import Best10 from "@/components/publicMarket/Best10";


export default function PublicMarket() {


  const [data, setData] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  const fetchDataMarseille = async () => {
    try {
      const response = await fetch("/api/lyon");
      const data = await response.json();
      setData(data.data);

    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const initialize = async () => {
      await fetchDataMarseille();
    };
    initialize();
  }, []);


  //useEffect pour analyse des données
  useEffect(() =>{
    console.log(data);

    const marketProcess = Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.procedure]) {
          acc[item.procedure] = { name: item.procedure, value: 0 };
        }
        acc[item.procedure].value += parseFloat(item.montant);
        return acc;
      }, {})
    );

    
    
    console.log(marketProcess)
    
  },[data]);

  
  // Stats data
  const totalSubvention = data.reduce((acc, marche) => acc + parseFloat(marche.montant), 0);
  const formattedTotalSubvention = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(totalSubvention);

  //MarketAndAmount data
  const contractsByYear = Object.values(
    data.reduce((acc, item) => {
      const year = item.datenotification.split("-")[0];
  
      if (!acc[year]) {
        acc[year] = { Année: year, Montant: 0, Nombre: 0 };
      }
  
      acc[year].Montant += parseFloat(item.montant) || 0;
      acc[year].Nombre += 1;
  
      return acc;
    }, {})
  );

  // MarketByActivities data
  const totalByCategory = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.cpv_2_label]) {
        acc[item.cpv_2_label] = { name: item.cpv_2_label, size: 0 };
      }
      acc[item.cpv_2_label].size += parseFloat(item.montant);
      return acc;
    }, {})
  );
  
  // MarketType data
  const marketType = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.nature]) {
        acc[item.nature] = { name: item.nature, value: 0 };
      }
      acc[item.nature].value += 1;
      return acc;
    }, {})
  );
  
  // MarketProcess data
  const marketProcess = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.procedure]) {
        acc[item.procedure] = { name: item.procedure, value: 0 };
      }
      acc[item.procedure].value += parseFloat(item.montant);
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen">
      <h1 className="text-4xl text-center pt-8">Lyon - Marché Public</h1>
      <div className="max-w-screen-lg mx-auto mt-8">
        <div className="w-32 border px-3 py-1 rounded-lg">2022</div>
      </div>
      <Stats marketNumber={data.length} marketAmount={formattedTotalSubvention} />
      <MarketAndAmount data={contractsByYear}/>
      <MarketByActivities data={totalByCategory} />
      <Best10 />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-lg mx-auto mt-6 mb-20">
        <MarketType data={marketType}/>
        <MarketProcess data={marketProcess} />
      </div>
    </div>
  )
}
