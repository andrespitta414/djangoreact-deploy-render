import type { ReportAsset } from "@/lib/types";

interface EvidenceGalleryProps {
  assets: ReportAsset[];
}

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|ogg)$/i.test(url);
}

export function EvidenceGallery({ assets }: EvidenceGalleryProps) {
  if (!assets.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Esta denuncia no tiene evidencia adjunta.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {assets.map((asset) => (
        <a
          key={asset.id}
          href={asset.file}
          target="_blank"
          rel="noreferrer"
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
        >
          {isVideoAsset(asset.file) ? (
            <video src={asset.file} controls className="h-44 w-full bg-slate-950 object-cover" />
          ) : (
            <img src={asset.file} alt="Evidencia adjunta" className="h-44 w-full bg-slate-100 object-cover" />
          )}
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Abrir evidencia
          </div>
        </a>
      ))}
    </div>
  );
}
