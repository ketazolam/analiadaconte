import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Home, Building2, Warehouse, LandPlot, Store, HelpCircle, Check, MapPin, Ruler, DoorOpen, Sparkles, Car, RotateCcw } from "lucide-react";
import { whatsappLink, EASE } from "@/lib/constants";

const propertyTypes = [
  { icon: Home, label: "Casa / Chalet" },
  { icon: Building2, label: "Departamento" },
  { icon: Warehouse, label: "PH" },
  { icon: LandPlot, label: "Lote / Terreno" },
  { icon: Store, label: "Local comercial" },
  { icon: HelpCircle, label: "Otro" },
];

const ambientesOptions = ["1", "2", "3", "4", "5+"];
const estadoOptions = ["Excelente", "Muy bueno", "Bueno", "A reciclar"];

const TOTAL_STEPS = 3;

/* ── Static-label input field ── */
const FloatingField = ({
  label, type = "text", placeholder = "", value, onChange, suffix, optional, error,
}: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; suffix?: string; optional?: boolean; error?: string;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        className="font-body block mb-2"
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: error ? "hsl(0,84%,60%)" : focused ? "hsl(var(--primary))" : "hsl(var(--text-muted))",
          transition: "color 0.15s",
        }}
      >
        {label}{optional && <span style={{ opacity: 0.6 }}> (opcional)</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none font-body text-base text-foreground py-3"
          style={{
            borderBottom: error
              ? "1px solid hsl(0,84%,60%)"
              : focused
                ? "1px solid hsl(var(--primary))"
                : "1px solid hsl(var(--border))",
            transition: "border-color 0.15s",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className="font-body text-base text-text-muted shrink-0">{suffix}</span>}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-xs mt-1.5"
          style={{ color: "hsl(0,84%,60%)" }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

/* ── Pill selector (ambientes / estado) ── */
const PillSelector = ({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <p className="font-body mb-3" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(var(--text-muted))" }}>
      {label}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="font-body text-sm px-5 py-2.5 transition-all"
          style={{
            backgroundColor: value === o ? "hsl(var(--primary))" : "transparent",
            color: value === o ? "hsl(var(--primary-foreground))" : "hsl(var(--text-secondary))",
            border: value === o ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
          }}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

/* ── Cochera toggle ── */
const PillToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div>
    <p className="font-body mb-3" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(var(--text-muted))" }}>
      ¿Tiene cochera?
    </p>
    <div className="flex">
      {[false, true].map((v) => (
        <button
          key={String(v)}
          type="button"
          className="font-body text-sm px-8 py-2.5 transition-all"
          style={{
            backgroundColor: value === v ? (v ? "hsl(var(--primary))" : "hsl(var(--muted))") : "transparent",
            color: value === v ? (v ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))") : "hsl(var(--text-muted))",
            border: "1px solid hsl(var(--border))",
          }}
          onClick={() => onChange(v)}
        >
          {v ? "Sí" : "No"}
        </button>
      ))}
    </div>
  </div>
);

/* ── Summary chip ── */
const SummaryChip = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: "hsl(var(--gold-dim))", border: "1px solid hsl(var(--primary) / 0.2)" }}>
    <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
    <span className="font-body text-xs text-text-secondary">{text}</span>
  </div>
);

/* WhatsApp SVG icon */
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── Main component ── */
const ValuationTool = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [estado, setEstado] = useState("");
  const [cochera, setCochera] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => { setDirection(1); setStep((s) => s + 1); };
  const handleBack = () => { setDirection(-1); setStep((s) => s - 1); };

  const validateStep2 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!zona.trim()) e.zona = "Ingresá la zona o barrio";
    if (!superficie.trim() || Number(superficie) <= 0) e.superficie = "Ingresá la superficie";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [zona, superficie]);

  const buildMessage = useCallback(() => {
    const lines = [
      `Hola Analía! 👋 Quiero tasar mi *${selectedType}*.`,
      ``,
      `📍 Zona: ${zona}`,
      direccion ? `🗺️ Dirección: ${direccion}` : null,
      `📐 Superficie: ${superficie} m²`,
      ambientes ? `🚪 Ambientes: ${ambientes}` : null,
      estado ? `✨ Estado: ${estado}` : null,
      `🚗 Cochera: ${cochera ? "Sí" : "No"}`,
      ``,
      `¡Muchas gracias!`,
    ].filter((l) => l !== null);
    return lines.join("\n");
  }, [selectedType, zona, direccion, superficie, ambientes, estado, cochera]);

  const handleSendWhatsApp = () => {
    const url = whatsappLink(buildMessage());
    window.open(url, "_blank");
    setSubmitted(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedType("");
    setZona("");
    setDireccion("");
    setSuperficie("");
    setAmbientes("");
    setEstado("");
    setCochera(false);
    setSubmitted(false);
    setErrors({});
  };

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const stepLabels = ["Tipo de propiedad", "Ubicación", "Detalles y envío"];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <>
      <div className="section-divider" />
      <section id="tasacion" ref={ref} className="section-lazy section-padding noise-overlay" style={{ backgroundColor: "hsl(var(--bg-secondary))", contain: "content" }}>
        <div className="max-w-[660px] mx-auto relative z-10">

          {/* Wizard card */}
          <motion.div
            className="relative overflow-hidden"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* Progress bar */}
            <div className="h-[2px] w-full" style={{ backgroundColor: "hsl(var(--border))" }}>
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-between px-8 pt-6 pb-1">
              <span
                className="font-body text-xs uppercase tracking-[0.15em]"
                style={{ color: "hsl(var(--text-muted))" }}
              >
                Paso {step} de {TOTAL_STEPS}
              </span>
              <span
                className="font-body text-xs"
                style={{ color: "hsl(var(--primary))", opacity: 0.75 }}
              >
                {stepLabels[step - 1]}
              </span>
            </div>

            <div className="p-8 min-h-[460px] flex flex-col">
              <AnimatePresence mode="wait" custom={direction}>
                {!submitted ? (
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex-1 flex flex-col"
                  >
                    {/* ── STEP 1: Property type ── */}
                    {step === 1 && (
                      <>
                        <p className="font-body text-foreground mb-6 text-base">
                          Seleccioná el tipo de propiedad:
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-auto">
                          {propertyTypes.map((pt, i) => (
                            <motion.button
                              key={pt.label}
                              type="button"
                              className="relative h-28 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                              style={{
                                border: selectedType === pt.label
                                  ? "1px solid hsl(var(--primary))"
                                  : "1px solid hsl(var(--border))",
                                background: selectedType === pt.label
                                  ? "hsl(var(--gold-dim))"
                                  : "transparent",
                              }}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              whileHover={{ borderColor: "hsl(var(--primary) / 0.5)" }}
                              onClick={() => setSelectedType(pt.label)}
                            >
                              {selectedType === pt.label && (
                                <Check className="absolute top-2.5 right-2.5 w-4 h-4 text-primary" />
                              )}
                              <pt.icon
                                className="w-7 h-7 stroke-[1.2] transition-colors"
                                style={{ color: selectedType === pt.label ? "hsl(var(--primary))" : "hsl(var(--text-secondary))" }}
                              />
                              <span className="font-body text-sm text-text-secondary">{pt.label}</span>
                            </motion.button>
                          ))}
                        </div>
                        <div className="mt-8">
                          <button
                            type="button"
                            disabled={!selectedType}
                            onClick={handleNext}
                            className="w-full font-body text-base uppercase tracking-wider py-4 transition-all"
                            style={{
                              backgroundColor: selectedType ? "hsl(var(--primary))" : "hsl(var(--muted))",
                              color: selectedType ? "hsl(var(--primary-foreground))" : "hsl(var(--text-muted))",
                              cursor: selectedType ? "pointer" : "not-allowed",
                            }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      </>
                    )}

                    {/* ── STEP 2: Location & surface ── */}
                    {step === 2 && (
                      <>
                        <div className="space-y-7 flex-1">
                          <FloatingField
                            label="Zona / Barrio"
                            placeholder="Ej: Playa Grande, Centro..."
                            value={zona}
                            onChange={(v) => { setZona(v); setErrors((e) => ({ ...e, zona: "" })); }}
                            error={errors.zona}
                          />
                          <FloatingField
                            label="Dirección aproximada"
                            placeholder="Ej: Av. Colón 1234"
                            value={direccion}
                            onChange={setDireccion}
                            optional
                          />
                          <FloatingField
                            label="Superficie cubierta"
                            type="number"
                            value={superficie}
                            onChange={(v) => { setSuperficie(v); setErrors((e) => ({ ...e, superficie: "" })); }}
                            suffix="m²"
                            error={errors.superficie}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="font-body text-sm text-text-muted hover:text-primary transition-colors"
                          >
                            ← Volver
                          </button>
                          <button
                            type="button"
                            disabled={!zona.trim() || !superficie.trim()}
                            onClick={() => {
                              if (validateStep2()) handleNext();
                            }}
                            className="font-body text-base uppercase tracking-wider py-4 px-8 transition-all"
                            style={{
                              backgroundColor: (zona.trim() && superficie.trim()) ? "hsl(var(--primary))" : "hsl(var(--muted))",
                              color: (zona.trim() && superficie.trim()) ? "hsl(var(--primary-foreground))" : "hsl(var(--text-muted))",
                              cursor: (zona.trim() && superficie.trim()) ? "pointer" : "not-allowed",
                            }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      </>
                    )}

                    {/* ── STEP 3: Features + Summary + CTA ── */}
                    {step === 3 && (
                      <>
                        <div className="space-y-7">
                          <PillSelector label="Ambientes" options={ambientesOptions} value={ambientes} onChange={setAmbientes} />
                          <PillSelector label="Estado de la propiedad" options={estadoOptions} value={estado} onChange={setEstado} />
                          <PillToggle value={cochera} onChange={setCochera} />
                        </div>

                        {/* Summary preview */}
                        <div className="mt-7 p-4" style={{ background: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border))" }}>
                          <p className="font-body text-xs text-text-muted mb-3 uppercase tracking-[0.1em]">Resumen</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedType && <SummaryChip icon={Home} text={selectedType} />}
                            {zona && <SummaryChip icon={MapPin} text={zona} />}
                            {superficie && <SummaryChip icon={Ruler} text={`${superficie} m²`} />}
                            {ambientes && <SummaryChip icon={DoorOpen} text={`${ambientes} amb.`} />}
                            {estado && <SummaryChip icon={Sparkles} text={estado} />}
                            <SummaryChip icon={Car} text={cochera ? "Con cochera" : "Sin cochera"} />
                          </div>
                        </div>

                        <div className="mt-7 space-y-3">
                          {/* WhatsApp CTA */}
                          <button
                            type="button"
                            onClick={handleSendWhatsApp}
                            className="w-full font-body text-base py-4 flex items-center justify-center gap-3 rounded-lg transition-all hover:opacity-90"
                            style={{
                              backgroundColor: "hsl(var(--whatsapp))",
                              color: "#fff",
                              cursor: "pointer",
                              boxShadow: "0 4px 20px hsl(var(--whatsapp) / 0.3)",
                            }}
                          >
                            <WhatsAppIcon className="w-5 h-5 fill-white" />
                            Enviar por WhatsApp
                          </button>
                          <p className="text-center font-body text-text-muted" style={{ fontSize: 11 }}>
                            Tu consulta va directo al chat de Analía
                          </p>

                          <button
                            type="button"
                            onClick={handleBack}
                            className="w-full font-body text-sm text-text-muted hover:text-primary transition-colors pt-2"
                          >
                            ← Volver
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  /* ── SUCCESS SCREEN ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-8"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ border: "1.5px solid hsl(var(--primary))", background: "hsl(var(--gold-dim))" }}
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        />
                      </motion.svg>
                    </div>

                    <h3 className="font-display text-2xl text-foreground mb-2">¡Consulta enviada!</h3>
                    <p className="font-body text-sm text-text-secondary mb-10 max-w-xs">
                      Analía te responde en menos de 2 horas por WhatsApp con la valuación de tu propiedad.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/propiedades")}
                      className="font-body text-sm text-text-muted hover:text-primary transition-colors mb-4"
                    >
                      Ver propiedades disponibles →
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 font-body text-[13px] text-text-muted hover:text-primary transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Enviar otra consulta
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <p className="text-center mt-6 font-body text-text-muted" style={{ fontSize: 11 }}>
            Sin formularios. Tu consulta va directo al WhatsApp de Analía.
          </p>
        </div>
      </section>
    </>
  );
};

export default ValuationTool;
