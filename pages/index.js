import { useEffect, useState } from "react";
import Autocomplete from "../src/components/Autocomplete/Autocomplete";

const App = () => {
  const [place, setPlace] = useState(null);

  const handleSelectHandler = (selectedPlace) => {
    setPlace(selectedPlace);
  };

  return (
    <div className="main" style={{ height: "100vh" }}>
      <Autocomplete onSelect={handleSelectHandler} />
      {!place && <div className="results">No place selected</div>}
      {place && (
        <div className="results">
          Info about the place: <pre>{JSON.stringify(place, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
