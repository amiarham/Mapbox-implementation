/** @format */

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapWithSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "MAPBOX API KEY";
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-1.7, 55],
      zoom: 20,
    });

    map.on("load", () => {
      setMap(map);
      addMarkers(data, map);
    });
  }, []);

  const addMarkers = (data, map) => {
    data.forEach((point) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(point.geometry.coordinates)
        .addTo(map);
      marker
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<p>${point.properties.name}</p><p>${point.properties.address}</p>
            <p>${point.properties.foodbank}</p>
            <p>${point.properties.foodbank_url}</p>
            <p>${point.properties.network}</p>
            <p>${point.properties.email}</p>
            <p>${point.properties.telephone}</p>
            <p>${point.properties.parliamentary_constituency}</p>
            <p>${point.properties.url}</p>

            <a href="${point.properties.url}">More Info</a>

            `
          )
        )
        .setLngLat(point.geometry.coordinates)
        .addTo(map);
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=MAPBOX_API_KEY`
    );
    const data = await response.json();
    setSearchResults(data.features);

    if (map) {
      map.flyTo({
        center: data.features[0].center,
        zoom: 12,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type='text' name='search' placeholder='Search for location' />
        <button type='submit'>Search</button>
      </form>

      <div ref={mapContainer} style={{ width: "100vw", height: "80vh" }} />
    </div>
  );
};

export default MapWithSearch;
