import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, HelpCircle, MessageCircle, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/Accordion";
import Navbar from "../components/layout/Navbar";

export default function FAQPage() {
  const [query, setQuery] = useState("");

  // FAQ content - Cypher-Ray specific
  const questions = [
    {
      id: "item-1",
      title: "What is Cypher-Ray?",
      content:
        "Cypher-Ray is an advanced firmware security analysis platform that helps identify vulnerabilities and cryptographic implementations in IoT and embedded device firmware. We use AI-powered analysis to detect security flaws before they can be exploited.",
    },
    {
      id: "item-2",
      title: "How does the analysis work?",
      content:
        "Upload your firmware binary, and our multi-model AI system analyzes it for cryptographic algorithms, security vulnerabilities, backdoors, and compliance issues. Results are typically available within minutes, with comprehensive reports including remediation recommendations.",
    },
    {
      id: "item-3",
      title: "What file formats are supported?",
      content:
        "We support various firmware formats including raw binaries, ELF files, and common IoT firmware formats. Files up to 10MB are supported on our free tier, with larger files available on paid plans.",
    },
    {
      id: "item-4",
      title: "How does the credit system work?",
      content:
        "Each firmware analysis consumes credits based on file size and complexity. You can purchase credit packages or subscribe to monthly plans. Credits never expire and can be used for any analysis type.",
    },
    {
      id: "item-5",
      title: "Is my firmware data secure?",
      content:
        "Absolutely. All uploads are encrypted in transit and at rest. We use authenticated Cloudinary storage with strict access controls. Your firmware is automatically deleted after analysis unless you choose to save results.",
    },
    {
      id: "item-6",
      title: "Can I integrate Cypher-Ray into my CI/CD pipeline?",
      content:
        "Yes! We provide a comprehensive REST API and SDK for seamless integration. API keys are available in your dashboard, and we offer detailed documentation with code examples in multiple languages.",
    },
    {
      id: "item-7",
      title: "What kind of vulnerabilities can be detected?",
      content:
        "Our AI models detect buffer overflows, weak cryptography, hardcoded credentials, insecure communications, outdated libraries, backdoors, and compliance violations. We continuously update our detection models with the latest threat intelligence.",
    },
    {
      id: "item-8",
      title: "Do you offer enterprise solutions?",
      content:
        "Yes, we offer custom enterprise plans with dedicated support, on-premise deployment options, unlimited analyses, priority processing, and custom integration assistance. Contact us for a tailored solution.",
    },
  ];

  const filtered = query
    ? questions.filter(({ title, content }) =>
        (title + content).toLowerCase().includes(query.toLowerCase())
      )
    : questions;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Enhanced Visual Effects */}
      <section className="relative overflow-hidden pt-52 md:pt-52 pb-12">
        {/* Dark Background Base */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)",
          }}
        />

        {/* Subtle purple overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/5" />

        {/* Radial glow effect behind title - more subtle */}
        <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content */}
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            {/* Title with gradient and glow */}
            <div className="space-y-3 mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent leading-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-base md:text-lg text-purple-200/60 max-w-2xl mx-auto">
                Find answers to common questions about Cypher-Ray
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400/70" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full h-12 pl-12 pr-5 rounded-xl bg-white/5 backdrop-blur-sm border border-purple-500/20 text-white placeholder:text-white/40 outline-none focus:border-purple-400/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Smooth gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-purple-950/20 to-[#060010] pointer-events-none" />
      </section>

      {/* Main Content - Two Column Layout */}
      <section
        className="relative py-16"
        style={{
          background:
            "linear-gradient(180deg, #060010 0%, #0a0015 50%, #060010 100%)",
        }}
      >
        {/* Top gradient fade-in effect */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-purple-900/10 pointer-events-none" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(168 85 247) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Contact Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-24"
              >
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Still have questions?
                  </h3>
                  <p className="text-sm text-white/70 mb-6">
                    Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
                  </p>

                  <div className="space-y-3">
                    <a
                      href="mailto:support@cypherray.com"
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 w-full"
                    >
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">Email Support</div>
                        <div className="text-xs opacity-90">support@cypherray.com</div>
                      </div>
                    </a>
                    
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById("contact");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm border border-purple-500/30 text-white rounded-lg hover:bg-white/10 hover:border-purple-400/50 transition-all w-full"
                    >
                      <MessageCircle className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="text-sm font-semibold">Contact Form</div>
                        <div className="text-xs opacity-70">Fill out our form</div>
                      </div>
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t border-purple-500/20">
                    <p className="text-xs text-white/50">
                      Our support team typically responds within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - FAQ Accordion */}
            <div className="lg:col-span-8">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 px-6 rounded-2xl bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/10"
                >
                  <MessageCircle className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-6">
                    No FAQs found matching "{query}"
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                  >
                    Clear Search
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    className="bg-gradient-to-br from-white/5 to-purple-950/5 backdrop-blur-sm w-full -space-y-px rounded-xl border border-purple-500/20 shadow-xl shadow-purple-900/10 overflow-hidden"
                    defaultValue="item-1"
                  >
                    {filtered.map((item) => (
                      <AccordionItem
                        value={item.id}
                        key={item.id}
                        className="relative border-x border-purple-500/20 first:rounded-t-xl first:border-t last:rounded-b-xl last:border-b hover:bg-purple-900/10 transition-colors"
                      >
                        <AccordionTrigger className="px-6 py-5 text-[15px] leading-6 hover:no-underline text-white hover:text-purple-300 transition-colors font-medium">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-white/70 pb-5 px-6 leading-relaxed">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <p className="text-white/60 mt-8 text-sm text-center bg-gradient-to-r from-transparent via-purple-900/20 to-transparent py-4 rounded-lg">
                    Can't find what you're looking for? Contact our{" "}
                    <a
                      href="mailto:support@cypherray.com"
                      className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                    >
                      customer support team
                    </a>
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section
        className="relative py-8 border-t border-purple-500/20"
        style={{
          background:
            "linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Cypher-Ray — Advanced Firmware Security
            Analysis
          </p>
        </motion.div>
      </section>
    </div>
  );
}
