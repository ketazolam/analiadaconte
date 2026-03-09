import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { usePropertyFilterOptions } from "@/hooks/useProperties";

const HeroSearchBar = () => {
  const navigate = useNavigate();
  const { data: options } = usePropertyFilterOptions();
  const [operacion, setOperacion] = useState("");
  const [tipo, setTipo] = useState("");
  const [dormitorios, setDormitorios] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (operacion) params.set("operacion", operacion);
    if (tipo) params.set("tipo", tipo);
    if (dormitorios) params.set("dormitorios", dormitorios);
    navigate(`/propiedades?${params.toString()}`);
  };

  const selectClass =
    "bg-transparent border-none font-body text-[13px] text-foreground/80 placeholder:text-foreground/40 focus:outline-none appearance-none w-full py-2 px-1";

  return (
    <div
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 sm:gap-0 w-full max-w-2xl mx-auto mt-6 md:mt-10 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Operación */}
      <div className="flex-1 px-4 py-1 sm:py-0 border-b sm:border-b-0 sm:border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <label className="font-body text-[9px] uppercase tracking-[0.15em] text-foreground/40 block mb-0.5">Operación</label>
        <select value={operacion} onChange={(e) => setOperacion(e.target.value)} className={selectClass}>
          <option value="">Todas</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {/* Tipo */}
      <div className="flex-1 px-4 py-1 sm:py-0 border-b sm:border-b-0 sm:border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <label className="font-body text-[9px] uppercase tracking-[0.15em] text-foreground/40 block mb-0.5">Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={selectClass}>
          <option value="">Todos</option>
          {options?.tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Dormitorios */}
      <div className="flex-1 px-4 py-1 sm:py-0 border-b sm:border-b-0 sm:border-r" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <label className="font-body text-[9px] uppercase tracking-[0.15em] text-foreground/40 block mb-0.5">Dormitorios</label>
        <select value={dormitorios} onChange={(e) => setDormitorios(e.target.value)} className={selectClass}>
          <option value="">Todos</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-primary text-primary-foreground font-body text-[13px] uppercase tracking-[0.1em] hover:bg-gold-light transition-colors shrink-0"
      >
        <Search className="w-4 h-4" />
        <span className="sm:hidden">Buscar propiedades</span>
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </div>
  );
};

export default HeroSearchBar;
