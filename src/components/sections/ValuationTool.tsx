import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Home, Building2, Warehouse, LandPlot, Store, HelpCircle, Check, MapPin, Ruler, DoorOpen, Sparkles, Car, MessageCircle, RotateCcw } from "lucide-react";
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

/* ── Floating input field ── */
const FloatingField = ({
  label, type = "text", placeholder = "", value, onChange, suffix, optional, error,
}: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; suffix?: string; optional?: boolean; error?: string;
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.label
        className="absolute left-0 font-body pointer-events-none origin-left"
        style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}
        animate={{
          y: active ? -20 : 0,
          scale: active ? 0.85 : 1,
          color: error ? "hsl(0,84%,60%)" : focused ? "hsl(var(--primary))" : "hsl(var(--text-muted))",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}{optional && " (opcional)"}
      </motion.label>
      <div className="flex items-center">
        <input
          type={type}
          placeholder={focused ? placeholder : ""}
          className="w-full bg-transparent outline-none font-body text-sm text-foreground py-2"
          style={{
            borderBottom: error
              ? "1px solid hsl(0,84%,60%)"
              : focused
                ? "1px solid hsl(var(--primary))"
                : "1px solid hsl(var(--border))",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className="font-body text-sm text-text-muted ml-1">{suffix}</span>}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-xs mt-1"
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
    <p className="font-body text-text-muted mb-3" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
      {label}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="font-body text-sm px-4 py-2 transition-all"
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
    <p className="font-body text-text-muted mb-3" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
      ¿Tiene cochera?
    </p>
    <div className="flex gap-0">
      {[false, true].map((v) => (
        <button
          key={String(v)}
          type="button"
          className="font-body text-sm px-6 py-2 transition-all"
          style={{
            backgroundColor: value === v ? (v ? "hsl(var(--primary))" : "hsl(var(--muted))") : "transparent",
            color: value === v ? (v ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))") : "hsl(var(--text-muted))",
            border: "1px solid hsl(var(--border))",
          }}
          onClick={() => onChange(v)}
        >
          {v ? "SÍ" : "NO"}
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

/* ── Main component ── */
const ValuationTool = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [estado, setEstado] = useState("");
  const [cochera, setCochera] = useState(false);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
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

  const validateStep3 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = "Ingresá tu nombre";
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 8) e.whatsapp = "Ingresá un número válido (mín. 8 dígitos)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [nombre, whatsapp]);

  const handleStep2Next = () => {
    if (validateStep2()) handleNext();
  };

  const buildMessage = () => {
    const parts = [
      `Hola Analía! Solicito tasación gratuita:`,
      `• Tipo: ${selectedType}`,
      `• Zona: ${zona}`,
      direccion && `• Dirección: ${direccion}`,
      `• Superficie: ${superficie} m²`,
      ambientes && `• Ambientes: ${ambientes}`,
      estado && `• Estado: ${estado}`,
      `• Cochera: ${cochera ? "Sí" : "No"}`,
      `• Nombre: ${nombre}`,
      `• WhatsApp: ${whatsapp}`,
      email && `• Email: ${email}`,
    ].filter(Boolean);
    return parts.join("\n");
  };

  const handleSendWhatsApp = () => {
    if (!validateStep3()) return;
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
    setNombre("");
    setWhatsapp("");
    setEmail("");
    setSubmitted(false);
    setErrors({});
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;
  const step3Valid = nombre.trim().length > 0 && whatsapp.replace(/\D/g, "").length >= 8;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <>
      <div className="section-divider" />
      <section id="tasacion" ref={ref} className="section-lazy section-padding noise-overlay" style={{ backgroundColor: "hsl(var(--bg-secondary))", contain: "content" }}>
        <div className="max-w-[640px] mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="label-eyebrow text-primary mb-4">Tasación gratuita</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] text-foreground mb-3">
              ¿Cuánto vale tu propiedad?
            </h2>
            <p className="font-body text-sm text-text-muted">
              Completá los datos y te contactamos en menos de 2 horas
            </p>
          </motion.div>

          {/* Wizard card */}
          <motion.div
            className="relative overflow-hidden"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            {/* Progress bar */}
            <div className="h-[2px] w-full" style={{ backgroundColor: "hsl(var(--border))" }}>
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-3 pt-6 pb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: step >= s ? "hsl(var(--primary))" : "transparent",
                    border: `1px solid ${step >= s ? "hsl(var(--primary))" : "hsl(var(--text-muted))"}`,
                  }}
                />
              ))}
            </div>

            <div className="p-8 min-h-[420px] flex flex-col">
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
                        <p className="font-body text-primary mb-6" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          Tipo de propiedad
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-auto">
                          {propertyTypes.map((pt, i) => (
                            <motion.button
                              key={pt.label}
                              type="button"
                              className="relative h-20 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
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
                              whileHover={{ borderColor: "hsl(var(--primary) / 0.4)" }}
                              onClick={() => setSelectedType(pt.label)}
                            >
                              {selectedType === pt.label && (
                                <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-primary" />
                              )}
                              <pt.icon className="w-5 h-5 text-text-secondary stroke-[1.2]" />
                              <span className="font-body text-xs text-text-secondary">{pt.label}</span>
                            </motion.button>
                          ))}
                        </div>
                        <div className="mt-8">
                          <button
                            type="button"
                            disabled={!selectedType}
                            onClick={handleNext}
                            className="w-full font-body text-sm uppercase tracking-wider py-3 transition-all"
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

                    {/* ── STEP 2: Location & characteristics ── */}
                    {step === 2 && (
                      <>
                        <p className="font-body text-primary mb-6" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          Ubicación y características
                        </p>
                        <div className="space-y-7 mb-auto">
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
                          <PillSelector label="Ambientes" options={ambientesOptions} value={ambientes} onChange={setAmbientes} />
                          <PillSelector label="Estado" options={estadoOptions} value={estado} onChange={setEstado} />
                          <PillToggle value={cochera} onChange={setCochera} />
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
                            onClick={handleStep2Next}
                            className="font-body text-sm uppercase tracking-wider py-3 px-8"
                            style={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      </>
                    )}

                    {/* ── STEP 3: Contact + summary ── */}
                    {step === 3 && (
                      <>
                        <p className="font-body text-primary mb-4" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          Tus datos de contacto
                        </p>

                        {/* Enriched summary */}
                        <div className="mb-6 p-4" style={{ background: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border))" }}>
                          <p className="font-body text-xs text-text-muted mb-3">Resumen de tu propiedad:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedType && <SummaryChip icon={Home} text={selectedType} />}
                            {zona && <SummaryChip icon={MapPin} text={zona} />}
                            {superficie && <SummaryChip icon={Ruler} text={`${superficie} m²`} />}
                            {ambientes && <SummaryChip icon={DoorOpen} text={`${ambientes} amb.`} />}
                            {estado && <SummaryChip icon={Sparkles} text={estado} />}
                            <SummaryChip icon={Car} text={cochera ? "Con cochera" : "Sin cochera"} />
                          </div>
                        </div>

                        <div className="space-y-7 mb-auto">
                          <FloatingField
                            label="Nombre completo"
                            value={nombre}
                            onChange={(v) => { setNombre(v); setErrors((e) => ({ ...e, nombre: "" })); }}
                            error={errors.nombre}
                          />
                          <div className="relative">
                            <span className="absolute left-0 top-2 font-body text-sm text-text-muted">🇦🇷 +54</span>
                            <div className="pl-16">
                              <FloatingField
                                label="WhatsApp"
                                type="tel"
                                value={whatsapp}
                                onChange={(v) => { setWhatsapp(v); setErrors((e) => ({ ...e, whatsapp: "" })); }}
                                error={errors.whatsapp}
                              />
                            </div>
                          </div>
                          <FloatingField label="Email" type="email" value={email} onChange={setEmail} optional />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="font-body text-sm text-text-muted hover:text-primary transition-colors"
                          >
                            ← Volver
                          </button>

                          {/* WhatsApp send button */}
                          <motion.button
                            type="button"
                            onClick={handleSendWhatsApp}
                            className="font-body text-sm uppercase tracking-wider py-3 px-6 flex items-center gap-2 transition-all"
                            style={{
                              backgroundColor: step3Valid ? "hsl(var(--whatsapp))" : "hsl(var(--muted))",
                              color: step3Valid ? "#fff" : "hsl(var(--text-muted))",
                              cursor: step3Valid ? "pointer" : "default",
                            }}
                            animate={step3Valid ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Enviar por WhatsApp
                          </motion.button>
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
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border-2 border-primary">
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

                    <h3 className="font-display text-2xl text-foreground mb-2">¡Tu consulta fue enviada!</h3>
                    <p className="font-body text-sm text-text-secondary mb-8">
                      Analía te responde en menos de 2 horas por WhatsApp
                    </p>

                    <a
                      href="#propiedades"
                      className="font-body text-[13px] text-text-muted hover:text-primary transition-colors mb-4"
                    >
                      Ver propiedades disponibles →
                    </a>

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
            🔒 Tus datos son confidenciales. Solo los usa Analía para contactarte.
          </p>
        </div>
      </section>
    </>
  );
};

export default ValuationTool;
