import { FileImage, UploadCloud, Video } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadZoneProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function FileUploadZone({ files, onChange }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const appendFiles = (list: FileList | null) => {
    if (!list) {
      return;
    }
    onChange([...files, ...Array.from(list)]);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          appendFiles(event.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-5 py-7 text-center transition ${
          isDragging ? "border-ocdeBlue bg-blue-50" : "border-slate-300 bg-slate-50"
        }`}
      >
        <UploadCloud className="mb-2 text-ocdeBlue" size={28} />
        <p className="text-sm font-semibold text-slate-900 sm:text-base">Arrastra imagenes o videos aqui</p>
        <p className="mt-1 text-sm text-slate-500">PNG, JPG, MP4, MOV o cualquier evidencia compatible del navegador</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,video/*"
        onChange={(event) => appendFiles(event.target.files)}
      />
      <div className="grid gap-2">
        {files.map((file, index) => (
          <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3 overflow-hidden">
              {file.type.startsWith("video") ? <Video size={18} className="text-ocdeBlue" /> : <FileImage size={18} className="text-ocdeGreen" />}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(files.filter((_, currentIndex) => currentIndex !== index))}
              className="text-xs font-semibold text-red-500"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
