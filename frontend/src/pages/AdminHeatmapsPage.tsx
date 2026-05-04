import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, TileLayer } from "react-leaflet";
import { useReports } from "@/hooks/useReports";

export function AdminHeatmapsPage() {
  const { reports } = useReports();

  return (
    <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocdeBlue">Mapas de calor</p>
        <h3 className="mt-2 text-3xl font-semibold text-slate-950">Visualizacion geoespacial con OpenStreetMap</h3>
      </div>
      <div className="overflow-hidden rounded-[32px] border border-slate-200">
        <div className="h-[620px]">
          <MapContainer center={[4.711, -74.0721]} zoom={5} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports
              .filter((report) => report.latitude && report.longitude)
              .map((report) => (
                <Circle
                  key={report.id}
                  center={[Number(report.latitude), Number(report.longitude)]}
                  radius={report.status === "resolved" ? 14000 : 22000}
                  pathOptions={{
                    color: report.status === "resolved" ? "#145A32" : "#1B4F72",
                    fillColor: report.status === "rejected" ? "#ef4444" : "#1B4F72",
                    fillOpacity: 0.35,
                  }}
                />
              ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
