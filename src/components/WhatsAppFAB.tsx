import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppFAB = () => {
  return (
    <motion.a
      href="https://wa.me/5492235000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-whatsapp flex items-center justify-center shadow-lg shadow-whatsapp/25"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-6 h-6 text-foreground fill-foreground" />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-whatsapp"
        animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
    </motion.a>
  );
};

export default WhatsAppFAB;
