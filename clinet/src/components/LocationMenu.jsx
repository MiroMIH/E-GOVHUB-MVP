import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";

const LocationMenu = ({ locations, onSelectLocation, selectedLocation }) => {
  const [selectedWilaya, setSelectedWilaya] = useState("16");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [wilayas, setWilayas] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    // Extract unique wilaya IDs
    const uniqueWilayaIDs = Array.from(new Set(locations.map((location) => location.wilaya_id)));
    // Limit to 50 options
    const limitedWilayaIDs = uniqueWilayaIDs.slice(0, 50);
    setWilayas(limitedWilayaIDs);
  }, [locations]);

  useEffect(() => {
    if (selectedWilaya && selectedCommune) {
      const locationString = `${selectedCommune}, ${getWilayaName(selectedWilaya)}`;
      onSelectLocation(locationString);
    }
  }, [selectedWilaya, selectedCommune, onSelectLocation]);

  useEffect(() => {
    if (selectedWilaya) {
      // Filter communes based on selected wilaya
      const filteredCommunes = locations.filter((location) => location.wilaya_id === selectedWilaya).map((location) => location.name); // Use 'name' field for commune
      setCommunes(filteredCommunes);
      setSelectedCommune(""); // Reset selected commune
    }
  }, [selectedWilaya, locations]);

  useEffect(() => {
    // If selectedLocation prop is provided, extract Wilaya and Commune from it
    if (selectedLocation) {
      const [commune, wilaya] = selectedLocation.split(", ");
      setSelectedCommune(commune);
      setSelectedWilaya(getWilayaID(wilaya));
    }
  }, [selectedLocation]);

  const handleWilayaChange = (e) => {
    setSelectedWilaya(e.target.value);
  };

  const handleCommuneChange = (e) => {
    setSelectedCommune(e.target.value);
  };

  const getWilayaName = (wilayaID) => {
    const wilaya = locations.find((location) => location.wilaya_id === wilayaID);
    return wilaya ? wilaya.name : "";
  };

  const getWilayaID = (wilayaName) => {
    const wilaya = locations.find((location) => location.name === wilayaName);
    return wilaya ? wilaya.wilaya_id : "";
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          {/* <InputLabel>Select Wilaya</InputLabel> */}
          <Select value={selectedWilaya} onChange={handleWilayaChange} fullWidth disabled>
            <MenuItem value="">Select Wilaya</MenuItem>
            {wilayas.map((wilayaID) => (
              <MenuItem key={wilayaID} value={wilayaID}>
                {getWilayaName(wilayaID)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {selectedWilaya && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select Commune</InputLabel>
            <Select value={selectedCommune} onChange={handleCommuneChange} fullWidth>
              <MenuItem value="">Select Commune</MenuItem>
              {communes.map((commune) => (
                <MenuItem key={commune} value={commune}>
                  {commune}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

export default LocationMenu;
