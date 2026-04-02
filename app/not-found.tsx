import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-8xl font-bold text-gold/20 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold mb-3">Sayfa Bulunamadı</h1>
        <p className="text-muted mb-8 max-w-sm">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/">
          <Button size="lg">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  );
}
