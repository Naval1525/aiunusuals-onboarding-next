"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { helioConfig } from "@/lib/helio-config"
import Image from "next/image"

function Navbar() {
  const router = useRouter()

  return (
    <nav className="w-full fixed top-0 left-0 flex items-center justify-between py-4 px-4 sm:px-8 z-50">
      <div
        className="text-xl sm:text-2xl font-normal tracking-wide text-[#fcc60e] cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img src='./image.png' className="w-8 h-8 object-contain inline-block align-middle" />
      </div>
    </nav>
  )
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fcc60e]/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0097fc]/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#495266]/3 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>
    </div>
  )
}

type IconInputProps = {
  icon: React.ReactNode
  type: string
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
}

function IconInput({ icon, ...props }: IconInputProps) {
  return (
    <div className="relative w-full mb-6">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636f8a] text-lg opacity-80 z-10">{icon}</span>
      <input
        {...props}
        className={`pl-12 pr-4 py-4 w-full rounded-2xl border border-[#495266] bg-[#21252e]/50 backdrop-blur-sm text-white placeholder-[#636f8a] font-normal focus:outline-none focus:ring-2 focus:ring-[#0097fc]/50 focus:border-[#0097fc]/50 transition-all duration-300 ${props.className || ""}`}
      />
    </div>
  )
}

type IconSelectProps = {
  icon: React.ReactNode
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  className?: string
  children: React.ReactNode
}

function IconSelect({ icon, children, ...props }: IconSelectProps) {
  return (
    <div className="relative w-full mb-6">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636f8a] text-lg opacity-80 z-10">{icon}</span>
      <select
        {...props}
        className={`pl-12 pr-10 py-4 w-full rounded-2xl border border-[#495266] bg-[#21252e]/50 backdrop-blur-sm text-white font-normal focus:outline-none focus:ring-2 focus:ring-[#0097fc]/50 focus:border-[#0097fc]/50 transition-all duration-300 appearance-none cursor-pointer ${props.className || ""}`}
      >
        {children}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#636f8a] pointer-events-none text-sm">▼</span>
    </div>
  )
}

export default function PreOrderPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    useCase: "",
    teamSize: "",
    role: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [animating, setAnimating] = useState(false)
  const [showInvitationForm, setShowInvitationForm] = useState(true)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email) return

    setAnimating(true)
    setTimeout(() => {
      setStep(2)
      setAnimating(false)
    }, 400)
  }

  const handleStripe = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.useCase || !formData.teamSize || !formData.role) return

    setIsSubmitting(true)
    // Save form data to localStorage (status is false for now)
    const formToStore = { ...formData, status: false }
    localStorage.setItem("registrationFormData", JSON.stringify(formToStore))

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setIsSubmitting(false)
        alert("Failed to start payment. Please try again.")
      }
    } catch {
      setIsSubmitting(false)
      alert("Failed to start payment. Please try again.")
    }
  }

  const handleCrypto = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.useCase || !formData.teamSize || !formData.role) return

    setIsSubmitting(true)
    const formToStore = { ...formData, status: false }
    localStorage.setItem("registrationFormData", JSON.stringify(formToStore))
    window.location.href = helioConfig.paymentUrl
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden bg-[#13151a]">
        {/* Dotted Background */}
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#13151a] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <AnimatedBackground />

        {/* Main Content */}
        <div className="w-full min-h-screen flex items-center justify-center pt-20 pb-8 px-4 relative z-10 flex-row mx-0 mb-px">
          <div className="max-w-5xl w-full relative">
            {/* Mobile Background Cards - Individual for each card */}
            <div className="lg:hidden">
              {/* First card background */}
              <div className="absolute top-10 left-3 right-3 h-[508px] bg-[#1F1F1E]/20 backdrop-blur-2xl border border-[#495266]/30 rounded-3xl transform scale-[1.02] -z-10"></div>
              {/* Second card background */}
              <div className="absolute top-[605px] left-3 right-3 h-[508px] bg-[#1F1F1E]/20 backdrop-blur-2xl border border-[#495266]/30 rounded-3xl transform scale-[1.02] -z-10"></div>
            </div>

            {/* Desktop Background Cards */}
            {/* Left background card */}
            <div className="hidden w-[400px] lg:block absolute top-2 bottom-2  right-1/2 bg-[#1F1F1E]/20 backdrop-blur-2xl border border-[#495266]/30 rounded-3xl transform scale-105 -z-10 ml-[9px] mr-[15px] mt-[39px] mb-[29px]"></div>
            {/* Right background card */}
            <div className="hidden lg:block absolute top-2 bottom-2 right-2 left-1/2 bg-[#1F1F1E]/20 backdrop-blur-2xl border border-[#495266]/30 rounded-3xl transform scale-105 -z-10 mr-[90px] ml-[15px] mt-[39px] mb-[29px]">
            
            </div>

            {/* Main Cards Container with responsive spacing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 p-4 mr-0 lg:mr-[-25px]">
              {/* Left Card - Image with Overlay */}
              <div className="bg-gradient-to-br md:w-[400px]  bg-blue-500 rounded-2xl overflow-hidden relative h-[500px] shadow-2xl mt-[26px] md:ml-[79px] mb-[17px]">
                {/* Background Image Placeholder */}
                <div className="absolute w-[260px] inset-0 bg-gradient-to-br bg-blue-500 ml-[100px]">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=300')] bg-cover bg-center opacity-80 mt-[-1px]"></div>
                  {/* Golden Gate Bridge Style Elements */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t bg-blue-500  to-transparent mb-0"></div>
                  <div className="absolute top-10 left-10 right-10 h-40 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-3xl"></div>
                </div>

                {/* Overlay Content - Centered */}
                <div className="absolute w-[300px] inset-0 flex items-center justify-center mr-[-4px] ml-[20px]">
                  <div className="text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <span className="text-sm font-medium tracking-wide">Usuals.ai</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">One Prompt</h2>
                    <p className="text-xl italic font-light tracking-wide">One Video</p>
                  </div>
                </div>
              </div>

              {/* Right Card - Invitation Form */}
              <div className="bg-[#1F1F1E]/80 backdrop-blur-xl border border-[#495266] rounded-2xl p-4 shadow-2xl h-[500px] flex flex-col px-4 py-4 mx-0 lg:mx-[-13px] mt-[26px] mb-[17px] lg:mr-[105px] lg:ml-[-24px]">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Usuals.ai Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-8">
                  <p className="text-[#636f8a] text-sm leading-relaxed">
                  Welcome to Usuals. We're in private beta early access is invite-only. Have a code? Enter it below. No code? Pre-order now to reserve your spot.
                  </p>
                </div>

                {/* Form */}
                {showInvitationForm ? (
                  <div className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <label className="block text-white text-sm font-medium mb-3">Invitation code</label>
                      <input
                        type="text"
                        placeholder="Enter your invitation code"
                        className="w-full px-4 py-3 rounded-xl border border-[#495266] bg-[#13151a]/50 text-white placeholder-[#636f8a] focus:outline-none focus:ring-2 focus:ring-[#fcc60e]/50 focus:border-[#fcc60e]/50 transition-all duration-300"
                      />
                    </div>
                    <button className="w-full bg-white text-black font-medium rounded-xl px-6 py-3 hover:bg-gray-100 transition-all duration-300 mb-6">
                      Get started
                    </button>
                    <div className="text-center mb-6">
                      <p className="text-[#636f8a] text-sm mt-3">Don't have code?</p>
                    </div>
                    <button
                      className="w-full border border-[#495266] text-[#636f8a] font-medium rounded-xl px-6 py-3 hover:border-[#fcc60e]/50 hover:text-[#fcc60e] transition-all duration-300 mb-auto mt-3"
                      onClick={() => setShowInvitationForm(false)}
                    >
                      Pre-order
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    {/* Step Progress Indicator */}
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-2">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            step >= 1 ? "bg-[#fcc60e]" : "bg-[#495266]"
                          }`}
                        />
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            step >= 2 ? "bg-[#fcc60e]" : "bg-[#495266]"
                          }`}
                        />
                      </div>
                    </div>
                    <p className="text-center text-xs text-[#636f8a] mb-6">Step {step} of 2</p>

                    {step === 1 && (
                      <div
                        className={`transition-all duration-400 ${
                          !animating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                        }`}
                      >
                        <div className="mb-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#495266] bg-[#13151a]/50 text-white placeholder-[#636f8a] focus:outline-none focus:ring-2 focus:ring-[#fcc60e]/50 focus:border-[#fcc60e]/50 transition-all duration-300"
                            required
                          />
                        </div>
                        <div className="mb-6">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#495266] bg-[#13151a]/50 text-white placeholder-[#636f8a] focus:outline-none focus:ring-2 focus:ring-[#fcc60e]/50 focus:border-[#fcc60e]/50 transition-all duration-300"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          className="w-full bg-[#fcc60e] text-[#13151a] font-medium rounded-xl px-6 py-3 hover:bg-[#e6b30d] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={!formData.fullName || !formData.email || isSubmitting}
                          onClick={handleContinue}
                        >
                          Continue
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div
                        className={`transition-all duration-400 ${
                          !animating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                        }`}
                      >
                        <div className="mb-2">
                          <select
                            value={formData.useCase}
                            onChange={(e) => handleInputChange("useCase", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#495266] bg-[#13151a]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#fcc60e]/50 focus:border-[#fcc60e]/50 transition-all duration-300 appearance-none cursor-pointer"
                            required
                          >
                            <option value="" disabled>
                              Select Use Case
                            </option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="School">School</option>
                            <option value="Agency">Agency</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="mb-2">
                          <select
                            value={formData.teamSize}
                            onChange={(e) => handleInputChange("teamSize", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#495266] bg-[#13151a]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#fcc60e]/50 focus:border-[#fcc60e]/50 transition-all duration-300 appearance-none cursor-pointer"
                            required
                          >
                            <option value="" disabled>
                              Select Team Size
                            </option>
                            <option value="Just me">Just me</option>
                            <option value="2-9">2-9 people</option>
                            <option value="10-49">10-49 people</option>
                            <option value="50-199">50-199 people</option>
                            <option value="200-499">200-499 people</option>
                            <option value="500-999">500-999 people</option>
                            <option value="1000+">1000+ people</option>
                          </select>
                        </div>
                        <div className="mb-1">
                          <select
                            value={formData.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#495266] bg-[#13151a]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#fcc60e]/50 focus:border-[#fcc60e]/50 transition-all duration-300 appearance-none cursor-pointer"
                            required
                          >
                            <option value="" disabled>
                              Select Your Role
                            </option>
                            <option value="Marketer">Marketer</option>
                            <option value="Business Owner">Business Owner</option>
                            <option value="Creative Director">Creative Director</option>
                            <option value="Digital Marketing Agency">Digital Marketing Agency</option>
                            <option value="Content Creator">Content Creator</option>
                            <option value="Developer">Developer</option>
                            <option value="Student">Student</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex-1 bg-[#0097fc] text-white mt-2 md:mb-2 font-medium rounded-xl px-6 py-2 hover:bg-[#0080d6] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={
                              isSubmitting ||
                              !formData.fullName ||
                              !formData.email ||
                              !formData.useCase ||
                              !formData.teamSize ||
                              !formData.role
                            }
                            onClick={handleStripe}
                          >
                            {isSubmitting ? "Redirecting..." : "Pay with Stripe"}
                          </button>
                          <button
                            type="button"
                            className="flex-1 bg-[#fcc60e] text-black mt-2 md:mb-2 font-medium rounded-xl px-4  hover:bg-[#e6b30d] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={
                              isSubmitting ||
                              !formData.fullName ||
                              !formData.email ||
                              !formData.useCase ||
                              !formData.teamSize ||
                              !formData.role
                            }
                            onClick={handleCrypto}
                          >
                            {isSubmitting ? "Redirecting..." : "Pay with Solana"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
