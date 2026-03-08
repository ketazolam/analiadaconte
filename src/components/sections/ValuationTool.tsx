import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Home, Building2, Warehouse, LandPlot, Store, HelpCircle, Check, Loader2 } from "lucide-react";
import MagneticButton from "../MagneticButton";
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

const FloatingField = ({
  label, type = "text", placeholder = "", value, onChange, suffix, optional,
}: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; suffix?: string; optional?: boolean;
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
          color: focused ? "hsl(38,54%,50%)" : "rgba(255,255,255,0.35)",
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
          style={{ borderBottom: focused ? "1px solid hsl(38,54%,50%)" : "1px solid rgba(255,255,255,0.15)" }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className="font-body text-sm text-text-muted ml-1">{suffix}</span>}
      </div>
    </div>
  );
};

const SelectField = ({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <p className="font-body text-text-muted mb-2" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
      {label}
    </p>
    <select
      className="w-full bg-transparent outline-none font-body text-sm text-foreground py-2 appearance-none"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" className="bg-[#111015]">Seleccionar...</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#111015]">{o}</option>
      ))}
    </select>
  </div>
);

const PillToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div>
    <p className="font-body text-text-muted mb-2" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
      ¿Tiene cochera?
    </p>
    <div className="flex gap-0">
      {[false, true].map((v) => (
        <button
          key={String(v)}
          type="button"
          className="font-body text-sm px-6 py-2 transition-all"
          style={{
            backgroundColor: value === v ? (v ? "hsl(38,54%,50%)" : "rgba(255,255,255,0.1)") : "transparent",
            color: value === v ? (v ? "#0C0B0F" : "white") : "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onClick={() => onChange(v)}
        >
          {v ? "SÍ" : "NO"}
        </button>
      ))}
    </div>
  </div>
);

const ValuationTool = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [zona, setZona] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [estado, setEstado] = useState("");
  const [cochera, setCochera] = useState(false);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleNext = () => { setDirection(1); setStep((s) => s + 1); };
  const handleBack = () => { setDirection(-1); setStep((s) => s - 1); };

  const handleSubmit = () => {
    setSubmitting(true);
    const msg = `Hola Analía! Solicito tasación gratuita:\n• Tipo: ${selectedType}\n• Zona: ${zona}\n• Superficie: ${superficie} m²\n• Ambientes: ${ambientes}\n• Estado: ${estado}\n• Cochera: ${cochera ? "Sí" : "No"}\n• Nombre: ${nombre}\n• WhatsApp: ${whatsapp}${email ? `\n• Email: ${email}` : ""}`;
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.open(whatsappLink(msg), "_blank");
    }, 1500);
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  const waMessage = `Hola Analía! Acabo de solicitar una tasación gratuita para mi ${selectedType} en ${zona}. ¿Podemos coordinar?`;

  return (
    <>
      <div className="section-divider" />
      <section id="tasacion" ref={ref} className="section-lazy section-padding noise-overlay" style={{ backgroundColor: "#111015", contain: "content" }}>
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
              backgroundColor: "#141218",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            {/* Progress bar */}
            <div className="h-[2px] w-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full"
                style={{ backgroundColor: "hsl(38,54%,50%)" }}
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
                    backgroundColor: step >= s ? "hsl(38,54%,50%)" : "transparent",
                    border: `1px solid ${step >= s ? "hsl(38,54%,50%)" : "rgba(255,255,255,0.2)"}`,
                  }}
                />
              ))}
            </div>

            <div className="p-8 min-h-[380px] flex flex-col">
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
                                  ? "1px solid hsl(38,54%,50%)"
                                  : "1px solid rgba(255,255,255,0.08)",
                                background: selectedType === pt.label
                                  ? "rgba(196,154,60,0.08)"
                                  : "transparent",
                              }}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              whileHover={{ borderColor: "rgba(196,154,60,0.4)" }}
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
                              backgroundColor: selectedType ? "hsl(38,54%,50%)" : "rgba(255,255,255,0.06)",
                              color: selectedType ? "#0C0B0F" : "rgba(255,255,255,0.3)",
                              cursor: selectedType ? "pointer" : "not-allowed",
                            }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <p className="font-body text-primary mb-6" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          Ubicación y características
                        </p>
                        <div className="space-y-7 mb-auto">
                          <FloatingField label="Zona / Barrio" placeholder="Ej: Playa Grande, Centro..." value={zona} onChange={setZona} />
                          <FloatingField label="Superficie cubierta" type="number" value={superficie} onChange={setSuperficie} suffix="m²" />
                          <SelectField label="Ambientes" options={ambientesOptions} value={ambientes} onChange={setAmbientes} />
                          <SelectField label="Estado" options={estadoOptions} value={estado} onChange={setEstado} />
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
                            onClick={handleNext}
                            className="font-body text-sm uppercase tracking-wider py-3 px-8"
                            style={{ backgroundColor: "hsl(38,54%,50%)", color: "#0C0B0F" }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <p className="font-body text-primary mb-6" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          Tus datos de contacto
                        </p>

                        {/* Summary card */}
                        {(selectedType || zona) && (
                          <div
                            className="mb-6 p-4"
                            style={{
                              background: "rgba(196,154,60,0.05)",
                              border: "1px solid rgba(196,154,60,0.2)",
                            }}
                          >
                            <p className="font-body text-xs text-text-muted mb-1">Tu consulta:</p>
                            <p className="font-body text-[13px] text-text-secondary">
                              {selectedType}{zona && ` en ${zona}`}{superficie && ` · ${superficie} m²`}
                            </p>
                          </div>
                        )}

                        <div className="space-y-7 mb-auto">
                          <FloatingField label="Nombre completo" value={nombre} onChange={setNombre} />
                          <div className="relative">
                            <span className="absolute left-0 top-2 font-body text-sm text-text-muted">🇦🇷 +54</span>
                            <div className="pl-16">
                              <FloatingField label="WhatsApp" type="tel" value={whatsapp} onChange={setWhatsapp} />
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
                          <button
                            type="button"
                            disabled={!nombre || !whatsapp}
                            onClick={handleSubmit}
                            className="font-body text-sm uppercase tracking-wider py-3 px-8 flex items-center gap-2"
                            style={{
                              backgroundColor: nombre && whatsapp ? "hsl(38,54%,50%)" : "rgba(255,255,255,0.06)",
                              color: nombre && whatsapp ? "#0C0B0F" : "rgba(255,255,255,0.3)",
                              cursor: nombre && whatsapp ? "pointer" : "not-allowed",
                            }}
                          >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {submitting ? "Enviando..." : "Quiero mi tasación gratuita"}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-8"
                  >
                    {/* Animated checkmark */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ border: "2px solid hsl(38,54%,50%)" }}>
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                        fill="none"
                        stroke="hsl(38,54%,50%)"
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

                    <h3 className="font-display text-2xl text-foreground mb-2">¡Listo! Recibimos tu consulta</h3>
                    <p className="font-body text-sm text-text-secondary mb-8">
                      Te contactamos en menos de 2 horas por WhatsApp
                    </p>

                    <a
                      href={whatsappLink(waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-wider py-3 px-8 mb-4 text-white"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      Hablar con Analía ahora →
                    </a>

                    <a href="#propiedades" className="font-body text-[13px] text-text-muted hover:text-primary transition-colors">
                      Mientras tanto, mirá propiedades →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Privacy note */}
          <p className="text-center mt-6 font-body text-text-muted" style={{ fontSize: 11 }}>
            🔒 Tus datos son confidenciales. Solo los usa Analía para contactarte.
          </p>
        </div>
      </section>
    </>
  );
};

export default ValuationTool;
