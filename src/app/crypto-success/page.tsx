"use client";
import React, { useEffect, useState, Suspense } from "react";
import { motion } from "motion/react";

// Google Form URL for submission
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

function CryptoSuccessContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'confirming' | 'success' | 'failure'>('confirming');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get the stored form data from localStorage
        const stored = localStorage.getItem("registrationFormData");
        if (!stored) {
          throw new Error("No registration data found in localStorage");
        }

        const formData = JSON.parse(stored);
        const userEmail = formData.email;

        if (!userEmail) {
          throw new Error("No email found in registration data");
        }

        console.log("Retrieved email from localStorage:", userEmail);

        // Call the crypto payment verification API with the email from localStorage
        const response = await fetch(`/api/verify-crypto-payment?email=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to verify payment`);
        }

        const result = await response.json();
        console.log("API verification result:", result);

        if (result.success && result.verified) {
          // Payment successful - update form status and submit to Google Form
          formData.status = true;
          
          const formDataToSend = new FormData();
          formDataToSend.append("entry.1885883987", formData.fullName);
          formDataToSend.append("entry.1234487408", formData.email);
          formDataToSend.append("entry.755360426", formData.useCase);
          formDataToSend.append("entry.803028115", formData.teamSize);
          formDataToSend.append("entry.1737138215", formData.role);
          formDataToSend.append("entry.879932707", "True"); // Status True

          console.log("Submitting to Google Form (crypto success):", {
            fullName: formData.fullName,
            email: formData.email,
            useCase: formData.useCase,
            teamSize: formData.teamSize,
            role: formData.role,
            status: true
          });

          await fetch(GOOGLE_FORM_URL, {
            method: "POST",
            body: formDataToSend,
            mode: "no-cors",
          });

          setPaymentStatus('success');
        } else {
          // Payment not found or failed - don't submit to Google Form
          console.log("Crypto payment verification failed:", result.message);
          setPaymentStatus('failure');
        }
      } catch (err) {
        console.error('Error verifying crypto payment:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  if (loading || paymentStatus === 'confirming') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#13151a" }}>
        <AnimatedBackground />
        <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 min-h-screen relative z-10">
          <motion.div 
            className="bg-[#21252e]/50 backdrop-blur-xl border border-[#495266] rounded-2xl p-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcc60e] mb-4"></div>
              <p className="text-lg text-[#636f8a]">Verifying crypto payment and completing registration...</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#13151a" }}>
        <AnimatedBackground />
        <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 min-h-screen relative z-10">
          <motion.div 
            className="bg-[#21252e]/50 backdrop-blur-xl border border-[#495266] rounded-2xl p-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center justify-center text-red-400">
              <p className="text-2xl font-semibold mb-2">❌ {error}</p>
              <p className="text-[#636f8a]">If you believe this is a mistake, please contact support.</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#13151a" }}>
        <AnimatedBackground />
        <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 min-h-screen relative z-10">
          <motion.div 
            className="bg-[#21252e]/50 backdrop-blur-xl border border-[#495266] rounded-2xl p-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-[#fcc60e] mb-4">✅ Crypto Payment Verified!</p>
              <p className="text-lg text-[#636f8a]">Registration complete! Thank you.</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (paymentStatus === 'failure') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#13151a" }}>
        <AnimatedBackground />
        <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 min-h-screen relative z-10">
          <motion.div 
            className="bg-[#21252e]/50 backdrop-blur-xl border border-[#495266] rounded-2xl p-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-red-400 mb-4">❌ Crypto Payment Failed</p>
              <p className="text-lg text-[#636f8a]">Payment was not successful. Please try again.</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return null;
}

export default function CryptoSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#13151a" }}>
        <AnimatedBackground />
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcc60e]"></div>
        </div>
      </div>
    }>
      <CryptoSuccessContent />
    </Suspense>
  );
} 