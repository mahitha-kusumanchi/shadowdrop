import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, FileText, Lock } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-primary/10 ring-1 ring-primary/50 relative">
                        <div className="absolute inset-0 rounded-full animate-pulse-slow bg-primary/20 blur-xl"></div>
                        <ShieldAlert className="w-16 h-16 text-primary relative z-10" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                    Whistleblowing, <br />
                    <span className="text-primary text-4xl md:text-5xl block mt-2">Reimagined & Secure.</span>
                </h1>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                    ShadowDrop utilizes military-grade Hybrid Encryption (RSA + AES) to ensure your report remains completely anonymous and unreadable to anyone but authorized investigators.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link to="/submit" className="px-8 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Submit Secure Report
                    </Link>
                    <Link to="/login" className="px-8 py-3 bg-surface border border-gray-700 rounded-lg hover:border-gray-500 transition-all flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Investigator Login
                    </Link>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl">
                {[
                    { title: "End-to-End Encrypted", desc: "Data is encrypted on your device before it ever touches our servers." },
                    { title: "Anonymous by Default", desc: "No logs, no tracking, no identifiable metadata stored." },
                    { title: "Role-Based Access", desc: "Strict access control ensures only authorized eyes see your report." }
                ].map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        key={i}
                        className="p-6 rounded-xl bg-surface border border-white/5 hover:border-primary/30 transition-colors"
                    >
                        <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
