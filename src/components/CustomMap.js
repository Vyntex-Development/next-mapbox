const MAPBOX_TOKEN_PRODUCTION = process.env.MAPBOX_TOKEN_PRODUCTION;
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const CustomMap = ({ height, coordinates, zoom }) => {
  return (
    <div
      style={{
        height: `${height}px`,
        width: "100%",
        maxWidth: "34rem",
        overflow: "hidden",
        borderRadius: "1rem",
        position: "relative",
      }}
    >
      <Map
        initialViewState={{
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          zoom: zoom,
        }}
        style={{ width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN_PRODUCTION}
        viewState={{
          longitude: coordinates.lng || 2,
          latitude: coordinates.lat || 3,
        }}
      />
    </div>
  );
};

export default CustomMap;
