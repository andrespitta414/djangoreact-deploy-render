import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onChange: (coords: { latitude: number; longitude: number }) => void;
}

function ClickHandler({ onChange }: { onChange: (coords: { latitude: number; longitude: number }) => void }) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });
  return null;
}

export function MapPicker({ latitude = 4.711, longitude = -74.0721, onChange }: MapPickerProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-56 md:h-60">
        <MapContainer center={[latitude, longitude]} zoom={6} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} />
          <ClickHandler onChange={onChange} />
        </MapContainer>
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-slate-600">Selecciona el punto exacto del incidente</span>
        <span className="font-mono text-slate-900">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
      </div>
    </div>
  );
}
