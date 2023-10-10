import { PrintIcon } from "@/components/PrintIcon";
import { Inter } from "next/font/google";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const downloadPDF = async () => {
    setLoading(true);
    const response = await fetch("/api/pdf");
    const data = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(data);
    const fileName = `Arrest-data-${new Date().toISOString()}.pdf`;
    link.download = fileName;
    link.click();
    setLoading(false);
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <button
        className="button flex items-center gap-2 bg-[#090E24] rounded-lg shadow-lg px-4 py-2 text-white"
        onClick={downloadPDF}
        disabled={loading}
      >
        <PrintIcon />
        Print
        {loading && <span className="animate-pulse">...</span>}
      </button>
    </main>
  );
}
