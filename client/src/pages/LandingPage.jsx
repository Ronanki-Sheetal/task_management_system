import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, CheckCircle, BarChart3, Kanban, Users,
  Shield, Globe, Star, ChevronDown, Play, Sparkles,
  CheckSquare, Clock, TrendingUp, Bell
} from 'lucide-react';

const FEATURES = [
  { icon: CheckSquare, title: 'Smart Task Management', desc: 'Create, assign, and track tasks with intelligent prioritization and deadline tracking.', color: '#06B6D4' },
  { icon: Kanban, title: 'Kanban Board', desc: 'Visualize your workflow with a Trello-style drag & drop board. Move tasks between columns effortlessly.', color: '#8B5CF6' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into team productivity, completion rates, and task distribution with beautiful charts.', color: '#3B82F6' },
  { icon: Bell, title: 'Real-time Updates', desc: 'Live task updates via Socket.IO. See changes instantly without refreshing the page.', color: '#10B981' },
  { icon: Shield, title: 'Enterprise Security', desc: 'JWT authentication, bcrypt hashing, rate limiting, XSS protection, and role-based access control.', color: '#F59E0B' },
  { icon: Users, title: 'Team Collaboration', desc: 'Assign tasks to team members, add comments, and collaborate in real-time across your organization.', color: '#EF4444' },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Product Manager at TechCorp', text: 'TaskTrack transformed how our team operates. The Kanban board and real-time updates are game changers.', stars: 5 },
  { name: 'Marcus Johnson', role: 'Engineering Lead at StartupXYZ', text: 'The analytics dashboard gives us visibility we never had before. Productivity is up 40% since we switched.', stars: 5 },
  { name: 'Priya Patel', role: 'CTO at InnovateCo', text: 'Best task management system we\'ve used. Clean, fast, and incredibly intuitive. Our whole team loves it.', stars: 5 },
];

const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50M+', label: 'Tasks Completed' },
  { value: '4.9★', label: 'User Rating' },
];

function Particle({ style }) {
  return (
    <motion.div
      className="particle"
      style={style}
      animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
    />
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    width: `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: i % 2 === 0
      ? `rgba(6,182,212,${0.2 + Math.random() * 0.4})`
      : `rgba(139,92,246,${0.2 + Math.random() * 0.4})`,
    animationDelay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="min-h-screen bg-dark overflow-x-hidden">

      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4"
        style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">TaskTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Analytics', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="btn-ghost text-sm px-4 py-2">Login</button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="btn-primary text-sm px-4 py-2"
            >
              Get Started <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          {particles.map((p, i) => <Particle key={i} style={p} />)}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
              <Sparkles size={12} /> Enterprise Task Management Platform
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Manage Tasks with
              <span className="block gradient-text mt-1">Superhuman Speed</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one task management platform built for modern teams.
              Real-time collaboration, smart analytics, and a stunning interface
              that makes work feel effortless.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6,182,212,0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="btn-primary px-8 py-4 text-base"
              >
                Start Free Today <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-ghost px-8 py-4 text-base"
              >
                <Play size={16} className="fill-current" /> Live Demo
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-400" /> No credit card required</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-400" /> Free to use</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-400" /> Setup in 2 minutes</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={24} className="text-slate-600" />
        </motion.div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-black gradient-text">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Everything you need to
              <span className="gradient-text"> ship faster</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Packed with powerful features to streamline your workflow.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 group cursor-default"
                style={{ borderTop: `2px solid ${f.color}30` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Analytics Preview ───────────────────────────────── */}
      <section id="analytics" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Data-driven <span className="gradient-text">insights</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Beautiful charts and analytics to track your team's productivity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 overflow-hidden"
            style={{ border: '1px solid rgba(6,182,212,0.15)' }}
          >
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Tasks', value: '1,284', color: '#06B6D4' },
                { label: 'Completed', value: '876', color: '#10B981' },
                { label: 'In Progress', value: '312', color: '#3B82F6' },
                { label: 'Productivity', value: '68%', color: '#8B5CF6' },
              ].map((stat, i) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <p className="text-2xl font-display font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1 h-32">
              {[65, 80, 45, 90, 70, 55, 85, 75, 95, 60, 88, 72, 50, 92].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  className="flex-1 rounded-t-sm"
                  style={{ background: `linear-gradient(180deg, #06B6D4, #8B5CF6)`, opacity: 0.6 + (i % 3) * 0.15 }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-600 text-center mt-2">Tasks completed over the last 14 days</p>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">
              Ready to <span className="gradient-text">transform</span> your workflow?
            </h2>
            <p className="text-slate-400 mb-10 text-lg">Join thousands of teams already using TaskTrack.</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(6,182,212,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="btn-primary px-10 py-4 text-lg"
            >
              Get Started Free <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#06B6D4,#8B5CF6)' }}>
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-display font-bold gradient-text">TaskTrack</span>
        </div>
        <p className="text-sm text-slate-600">© 2025 TaskTrack. Built for Sheetal Thiranex Internship Project.</p>
      </footer>
    </div>
  );
}
