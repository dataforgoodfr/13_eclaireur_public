// "use client"
// import React from 'react';
// import { Treemap, ResponsiveContainer, Tooltip, Cell, Label } from 'recharts'; 

// const data = [
//       { name: 'Axes', size: 1302 },
//       { name: 'Axis', size: 24593 },
//       { name: 'AxisGridLine', size: 652 },
//       { name: 'AxisLabel', size: 636 },
//       { name: 'CartesianAxes', size: 6703 },
//     ]

// export default function TreemapViz({rawData}:{rawData: any[]}) {
// // export default function TreemapViz() {

//   // Formatter la data pour correspondre au format recharts
//     const groupedData = rawData.reduce((acc, { cpv_2_label, montant }) => {
//       if (!acc[cpv_2_label]) {
//         acc[cpv_2_label] = 0;
//       }
//       acc[cpv_2_label] += parseFloat(montant);
//       return acc;
//     }, {});
    
//   // Convertir l'objet en tableau et trier par montant décroissant
//   const formattedData = Object.entries(groupedData)
//     .map(([name, size]) => ({ name, size }))
//     .sort((a, b) => b.size - a.size); // Tri décroissant

//   // Séparer les 9 premiers et le reste si plus de 10 catégories
//   if (formattedData.length > 10) {
//     const data = formattedData.slice(0, 9);
//     const rest = formattedData.slice(9);
  
//     // Calculer la somme des autres catégories
//     const autresSum = rest.reduce((sum, item) => sum + item.size, 0);
//     // Ajouter la catégorie "Autres" si nécessaire
//     if (autresSum > 0) {
//       data.push({ name: "Autres", size: autresSum });
//     }
//   }
//   else {
//     const data = formattedData;
//   }

//   console.log(data)
    
//   return (
//     <ResponsiveContainer width="100%" height={600}>
//       {/* <Treemap width={400} height={200} data={data} dataKey="size" aspectRatio={1} stroke="#fff" fill="#8884d8" isAnimationActive={false} >
//         <Tooltip isAnimationActive={false}/>
//       </Treemap> */}
//       <Treemap
//         width={400}
//         height={200}
//         data={data}
//         dataKey="size"
//         stroke="#fff"
//         fill="#8884d8"
//         aspectRatio={1}
//       >

      
//       </Treemap> 
//     </ResponsiveContainer>
//   )
// }
