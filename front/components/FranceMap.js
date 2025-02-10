"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const FranceMap = () => {
  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    const width = 1000;
    const height = 800;

    // Get the 2D drawing context of the canvas
    const context = canvasRef.current.getContext("2d");

    // Define a geographic projection for France
    const projection = d3.geoConicConformal()
      .center([2.5, 46.5]) // Center the map on France
      .scale(3000) // Adjust zoom level
      .translate([width / 2, height / 2]); // Position in the canvas

    // Create a path generator for the projection
    const pathGenerator = d3.geoPath().projection(projection).context(context);

    let transform = d3.zoomIdentity; // Stores the current zoom state

    /**
     * Function to load and draw the map
     */
    const drawMap = async () => {
      context.clearRect(0, 0, width, height); // Clear the canvas
      context.save(); // Save the initial state

      // Apply the zoom transformation
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      // Load and draw Regions (highest administrative level)
      const regions = await d3.json("/data/regions.json");
      context.strokeStyle = "blue"; // Blue borders for regions
      context.lineWidth = 1;
      context.fillStyle = "#a0c4ff"; // Light blue fill color
      regions.features.forEach(feature => {
        context.beginPath();
        pathGenerator(feature);
        context.fill();
        context.stroke();
      });

      // Load and draw Departments (mid-level administrative units)
      const departements = await d3.json("/data/departements.json");
      context.strokeStyle = "black"; // Black borders for departments
      context.lineWidth = 0.5;
      departements.features.forEach(feature => {
        context.beginPath();
        pathGenerator(feature);
        context.stroke();
      });

      // Load and draw Communes (smallest administrative units) with population > 3,500
     /* const communes = await d3.json("/data/communes.json");
      
      const filteredCommunes = communes.features.filter(feature => {
        const population = feature.properties.population || feature.properties.POPULATION; // Check JSON property
        return population && population > 3500; // Only keep communes with more than 3,500 inhabitants
      });

      console.log(`Number of communes displayed: ${filteredCommunes.length}`);

      context.strokeStyle = "gray"; // Gray borders for communes
      context.lineWidth = 0.1;
      filteredCommunes.forEach(feature => {
        context.beginPath();
        pathGenerator(feature);
        context.stroke();
      });*/

      context.restore(); // Restore the initial state after drawing
    };

    drawMap(); // Initial rendering of the map

    /**
     * Zoom functionality using D3.js
     */
    const zoom = d3.zoom()
      .scaleExtent([0.5, 10]) // Allow zoom-out up to 50% and zoom-in up to 10x
      .on("zoom", (event) => {
        transform = event.transform; // Update zoom state
        drawMap(); // Redraw the entire map on zoom
      });

    d3.select(canvasRef.current).call(zoom); // Apply zoom to the canvas

  }, []);

  return <canvas ref={canvasRef} width={1000} height={800}></canvas>;
};

export default FranceMap;
