"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

interface StepUploadProps {
  onNext: (imageUrl: string) => void;
}

export default function StepUpload({ onNext }: StepUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const supabase = createClient();

  const handleFile = (f: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Sadece JPG, PNG veya WebP formatı kabul edilir");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Dosya boyutu 10MB'dan küçük olmalıdır");
      return;
    }
    setError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    []
  );

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum açmanız gerekiyor");

      const ext = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("land-photos")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("land-photos")
        .getPublicUrl(fileName);

      onNext(publicUrl);
    } catch (err) {
      setError("Yükleme başarısız. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">
          Arsa Fotoğrafı Yükle
        </h2>
        <p className="text-muted text-sm">
          Arsanızın veya arazinizin fotoğrafını yükleyin
        </p>
      </div>

      {!preview ? (
        <label
          className={`
            relative flex flex-col items-center justify-center gap-4
            border-2 border-dashed rounded-2xl p-12 cursor-pointer
            transition-all duration-200
            ${isDragging
              ? "border-gold bg-gold/5"
              : "border-border hover:border-gold/40 hover:bg-white/[0.02]"
            }
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Upload className="w-7 h-7 text-gold" />
          </div>

          <div className="text-center">
            <p className="font-medium text-white mb-1">
              Fotoğraf seçin veya sürükleyip bırakın
            </p>
            <p className="text-sm text-muted">JPG, PNG, WebP — Maks. 10MB</p>
          </div>

          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-gold/5 border-2 border-gold flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gold" />
            </div>
          )}
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#111] aspect-video border border-border">
            <Image
              src={preview}
              alt="Arsa önizlemesi"
              fill
              className="object-contain"
            />
            <button
              onClick={() => { setPreview(null); setFile(null); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-border flex items-center justify-center text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <ImageIcon className="w-4 h-4" />
            <span>{file?.name}</span>
            <span>({(file!.size / 1024 / 1024).toFixed(1)} MB)</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {preview && (
        <Button
          onClick={handleUpload}
          loading={uploading}
          size="lg"
          fullWidth
        >
          {uploading ? "Yükleniyor..." : "Devam Et →"}
        </Button>
      )}
    </div>
  );
}
