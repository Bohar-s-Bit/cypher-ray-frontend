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

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden py-16 pt-28 md:pt-32">
        {/* Gradient Background matching system */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)",
          }}
        />

        {/* Purple overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/10" />

        {/* Content */}
        <div className="relative mx-auto w-full max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold md:text-4xl text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-white/60 max-w-2xl">
                Here are some common questions and answers that you might encounter when using Cypher-Ray. If you don't find the answer you're looking for, feel free to reach out.
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 backdrop-blur-sm border border-purple-500/30 text-white placeholder:text-white/40 outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section
        className="relative py-7"
        style={{
          background:
            "linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4">
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
                  className="text-center py-16"
                >
                  <MessageCircle className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-6">
                    No FAQs found matching "{query}"
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
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
                    className="bg-white/5 dark:bg-white/5 backdrop-blur-sm w-full -space-y-px rounded-lg border border-purple-500/20"
                    defaultValue="item-1"
                  >
                    {filtered.map((item) => (
                      <AccordionItem
                        value={item.id}
                        key={item.id}
                        className="relative border-x border-purple-500/20 first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
                      >
                        <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline text-white hover:text-purple-300 transition-colors">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-white/70 pb-4 px-4">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <p className="text-white/60 mt-7 text-sm">
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
