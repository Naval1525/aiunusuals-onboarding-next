"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

// Use the correct /formResponse endpoint for your form
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/17qO2Uci4vrbiDXp-ngLUyHE7OC_KpfVYvxDrtLJa01o/formResponse";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Dot Background Pattern */}
      <motion.div
        className="absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(#404040_1px,transparent_1px)]"
        animate={{
          backgroundPosition: ["0px 0px", "20px 20px"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Radial gradient mask for faded look */}
      <div className="absolute inset-0 bg-[#13151a] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Animated elements */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-[#fcc60e]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0097fc]/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#495266]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />
    </div>
  );
}

export default function CancelPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Try to submit the form data with status: false
    const stored = localStorage.getItem("registrationFormData");
    if (stored) {
      const form = JSON.parse(stored);
      form.status = false;
      const formDataToSend = new FormData();
      formDataToSend.append("entry.1885883987", form.fullName);
      formDataToSend.append("entry.1234487408", form.email);
      formDataToSend.append("entry.755360426", form.useCase);
      formDataToSend.append("entry.803028115", form.teamSize);
      formDataToSend.append("entry.1737138215", form.role);
      formDataToSend.append("entry.879932707", "False"); // Status False (capitalized for dropdown)
      // Debug log
      console.log("Submitting to Google Form (cancel):", {
        fullName: form.fullName,
        email: form.email,
        useCase: form.useCase,
        teamSize: form.teamSize,
        role: form.role,
        status: false
      });
      fetch(GOOGLE_FORM_URL, {
        method: "POST",
        body: formDataToSend,
        mode: "no-cors",
      }).then(() => setSubmitted(true));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#13151a" }}>
      <AnimatedBackground />
      
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 min-h-screen relative z-10">
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="bg-[#21252e]/50 backdrop-blur-xl border border-[#495266] rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div
              className="text-6xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              ❌
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-normal text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Payment Cancelled
            </motion.h1>
            
            <motion.p 
              className="text-lg text-[#636f8a] mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Your payment was cancelled. {submitted ? "Registration was recorded with status: false." : "Recording registration..."}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link href="/signup">
                <motion.button 
                  className="group bg-[#0097fc] text-white font-medium rounded-full px-8 py-3 shadow-lg flex items-center gap-2 mx-auto"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 151, 252, 0.4), 0 10px 10px -5px rgba(0, 151, 252, 0.04)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowLeft size={18} />
                  Return to Home
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 