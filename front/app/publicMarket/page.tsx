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

  //useEffect de contrôle
  useEffect(() =>{
    console.log(data);
    const companiesList = data.reduce((acc, company) => acc + (company.titulaires), 0);
    // console.log(companiesList)
  },[data]);
  
 
  const totalSubvention = data.reduce((acc, marche) => acc + parseFloat(marche.montant), 0);
  const formattedTotalSubvention = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(totalSubvention);



  return (
    <div className="min-h-screen">
      <h1 className="text-4xl text-center pt-8">Lyon - Marché Public</h1>
      <div className="max-w-screen-lg mx-auto mt-8">
        <div className="w-32 border px-3 py-1 rounded-lg">2022</div>
      </div>
      <Stats marketNumber={data.length} marketAmount={formattedTotalSubvention} />
      <MarketAndAmount />
      <MarketByActivities />
      <Best10 />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-lg mx-auto mt-6 mb-20">
        <MarketType />
        <MarketProcess />
      </div>
    </div>
  )
}
