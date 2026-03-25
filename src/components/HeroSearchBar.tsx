import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Check } from "lucide-react";
import { usePropertyFilterOptions } from "@/hooks/useProperties";

const HeroSearchBar = () => {
  const navigate = useNavigate();
  const { data: options } = usePropertyFilterOptions();
  const [operacion, setOperacion] = useState("");
  const [tipos, setTipos] = useState<string[]>([]);
  const [dormitorios, setDormitorios] = useState("");
  const [tipoOpen, setTipoOpen] = useState(false);
  const tipoRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target as Node)) {
        setTipoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTipo = (t: string) => {
    setTipos((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const tipoLabel =
    tipos.length === 0 ? "Tipo" :
    tipos.length === 1 ? tipos[0] :
    `${tipos[0]} +${tipos.length - 1}`;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (operacion) params.set("operacion", operacion);
    if (tipos.length > 0) params.set("tipo", tipos.join(","));
    if (dormitorios) params.set("dormitorios", dormitorios);
    navigate(`/propiedades?${params.toString()}`);
  };

  const selectClass =
    "bg-transparent border-none font-body text-[15px] focus:outline-none appearance-none w-full py-2 px-1";

  const glassBorder = { borderColor: "rgba(255,255,255,0.08)" };

  return (
    <div
      className="flex flex-col sm:flex-row items-stretch w-full max-w-2xl mx-auto mt-6 md:mt-10 overflow-visible"
      style={{
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "2px",
      }}
    >
      {/* Filtros */}
      <div className="flex flex-row flex-1">

        {/* Operación */}
        <div className="flex-1 px-3 py-2 sm:px-4 border-r" style={glassBorder}>
          <label className="font-body text-[9px] sm:text-[11px] uppercase tracking-[0.12em] block mb-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>Operación</label>
          <select value={operacion} onChange={(e) => setOperacion(e.target.value)} className={selectClass} style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
            <option value="">Selecciona</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* Tipo — multi-select */}
        <div className="flex-1 px-3 py-2 sm:px-4 border-r relative" style={glassBorder} ref={tipoRef}>
          <label className="font-body text-[9px] sm:text-[11px] uppercase tracking-[0.12em] block mb-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>Tipo</label>
          <button
            type="button"
            onClick={() => setTipoOpen((v) => !v)}
            className="flex items-center w-full gap-1 font-body text-[13px] py-2 px-1"
            style={{ color: tipos.length > 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)" }}
          >
            <span className="truncate flex-1 text-left">{tipoLabel}</span>
            <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
          </button>

          {tipoOpen && (
            <div
              className="absolute left-0 top-full mt-1 z-50 min-w-[170px] py-1 shadow-xl"
              style={{ background: "rgba(30,20,50,0.97)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "2px" }}
            >
              {(options?.tipos || []).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTipo(t)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 font-body text-[13px] text-left transition-colors hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  <span
                    className="w-4 h-4 shrink-0 flex items-center justify-center border rounded-sm"
                    style={{
                      borderColor: tipos.includes(t) ? "hsl(var(--primary))" : "rgba(255,255,255,0.3)",
                      background: tipos.includes(t) ? "hsl(var(--primary))" : "transparent",
                    }}
                  >
                    {tipos.includes(t) && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                  {t}
                </button>
              ))}
              {tipos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTipos([])}
                  className="w-full px-3 py-2 font-body text-[11px] uppercase tracking-wider text-center transition-colors hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.40)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dormitorios */}
        <div className="flex-1 px-3 py-2 sm:px-4 sm:border-r" style={glassBorder}>
          <label className="font-body text-[9px] sm:text-[11px] uppercase tracking-[0.12em] block mb-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>Dormitorios</label>
          <select value={dormitorios} onChange={(e) => setDormitorios(e.target.value)} className={selectClass} style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
            <option value="">Selecciona</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-primary text-primary-foreground font-body text-[13px] sm:text-[14px] uppercase tracking-[0.1em] hover:bg-gold-light transition-colors shrink-0 w-full sm:w-auto"
      >
        <Search className="w-4 h-4" />
        <span>Buscar propiedades</span>
      </button>
    </div>
  );
};

export default HeroSearchBar;
