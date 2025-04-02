// import * as d3 from 'd3';



// type TreemapProps = {
//   width: number;
//   height: number;
//   data: Tree;
// };

// type TreeNode = {
//   type: 'node';
//   value: number;
//   name: string;
//   children: Tree[];
// };
// type TreeLeaf = {
//   type: 'leaf';
//   name: string;
//   value: number;
// };

// type Tree = TreeNode | TreeLeaf;


// export default function TreemapViz2 ({ rawData }: {rawData: any[]}) {

//   // Formatter la data pour correspondre au format recharts
//   const groupedData = rawData.reduce((acc, { cpv_2_label, montant }) => {
//     if (!acc[cpv_2_label]) {
//       acc[cpv_2_label] = 0;
//     }
//     acc[cpv_2_label] += parseFloat(montant);
//     return acc;
//   }, {});
    
//   // Convertir l'objet en tableau et trier par montant décroissant
//   const formattedData = Object.entries(groupedData)
//     .map(([name, size]) => ({ name, size }))
//     .sort((a, b) => b.size - a.size);

  
//   // Séparer les 9 premiers et aggréger le reste si plus de 10 catégories
//   let sortedData

//   if (formattedData.length > 10) {
//     sortedData = formattedData.slice(0, 9);
//     const rest = formattedData.slice(9);

//     const autresSum = rest.reduce((sum, item) => sum + item.size, 0);
//     if (autresSum > 0) {
//       sortedData.push({ name: "Autres", size: autresSum });
//     }
//   }
//   else {
//     sortedData = formattedData;
//   }

//   const data = {
//     type: "node",
//     name: "boss",
//     value: 0,
//     children: sortedData.map((item) => ({
//       type: "leaf",
//       name: item.name,
//       value: item.size,
//     })),
//   };

//   const width : number = 1486;
//   const height : number = 500;

//   const hierarchy = d3.hierarchy(data).sum((d) => d.value);

//   const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
//   const root = treeGenerator(hierarchy);

//   const allShapes = root.leaves().map((leaf) => {
//     return (
//       <g key={leaf.id}>
//         <rect
//           x={leaf.x0}
//           y={leaf.y0}
//           width={leaf.x1 - leaf.x0}
//           height={leaf.y1 - leaf.y0}
//           stroke="transparent"
//           fill={'#69b3a2'}
//           className="opacity-80 hover:opacity-100"
//           rx={10}
//         />
//         <text
//           x={leaf.x0 + 10}
//           y={leaf.y0 + 6}
//           fontSize={12}
//           textAnchor="start"
//           alignmentBaseline="hanging"
//           fill="white"
//           className="font-bold"
//         >
//           {leaf.data.name}
//         </text>
//         <text
//           x={leaf.x0 +10}
//           y={leaf.y0 + 22}
//           fontSize={12}
//           textAnchor="start"
//           alignmentBaseline="hanging"
//           fill="white"
//           className="font-light"
//         >
//           {leaf.data.value}
//         </text>
//       </g>
//     );
//   });

//   return (
//     <div>
//       <svg width={width} height={height}>
//         {allShapes}
//       </svg>
//     </div>
//   );
// };
