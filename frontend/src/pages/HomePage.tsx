import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, MessageSquare, BarChart2, ArrowRight, Sparkles } from 'lucide-react';
import FeatureCard from '../components/home/FeatureCard';
import TestimonialCard from '../components/home/TestimonialCard';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-10 h-10 text-sky-600" />,
      title: 'Clarity-first task flow',
      description: 'Quick add, smart ordering, and focused views that keep the noise out.',
    },
    {
      icon: <Calendar className="w-10 h-10 text-emerald-500" />,
      title: 'Calendar that works',
      description: 'Plan your week, move deadlines, and see what is actually doable.',
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-amber-500" />,
      title: 'AI task partner',
      description: 'Ask for daily summaries, recommendations, or quick task creation.',
    },
    {
      icon: <BarChart2 className="w-10 h-10 text-rose-500" />,
      title: 'Progress you can feel',
      description: 'Track momentum, understand bottlenecks, and celebrate wins.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya K.',
      role: 'Product Lead',
      content: 'Task Dash keeps our team aligned without adding more meetings. The weekly view is a game-changer.',
    },
    {
      name: 'Ethan R.',
      role: 'Founder',
      content: 'I can finally see what is realistic for the week. The AI summaries save me 20 minutes every day.',
    },
    {
      name: 'Hana S.',
      role: 'Designer',
      content: 'The interface feels calm and focused. It is the first tool that makes me want to finish tasks.',
    },
  ];

  const stats = [
    { value: '92%', label: 'tasks finished on time' },
    { value: '4.8x', label: 'faster weekly planning' },
    { value: '12 mins', label: 'avg. daily review' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-aurora">
        <div className="absolute inset-0 bg-grid opacity-40"></div>
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="text-left fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Focused task intelligence
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                Plan a week that actually fits. Deliver what matters.
              </h1>
              <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
                Task Dash turns your daily chaos into an intentional workflow. Prioritize faster, track progress, and let AI keep you one step ahead.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-sky-600 text-white font-semibold shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/chat"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Try AI Chat
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="fade-in">
              <div className="card-soft rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Today</p>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Momentum Board</h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold dark:bg-emerald-500/20 dark:text-emerald-200">
                    6 tasks
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    { title: 'Prepare client review', tag: 'High focus', time: '10:00 AM' },
                    { title: 'Design sprint notes', tag: 'In progress', time: '12:30 PM' },
                    { title: 'Weekly planning', tag: 'Quick win', time: '3:00 PM' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.tag}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{item.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="text-xs uppercase tracking-widest text-slate-500">AI Summary</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                    You are 70% done for the day. Move one medium task to tomorrow to stay on track.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Built for momentum
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Everything you need to keep priorities clear and teams aligned.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              A calmer way to work
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Three layers keep you focused: capture, prioritize, and deliver.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Capture without friction',
                copy: 'Create tasks in seconds and let the AI propose labels, priorities, and timing.',
                link: '/tasks',
                linkText: 'Create tasks',
              },
              {
                step: '02',
                title: 'Focus with context',
                copy: 'See the right tasks at the right time with priority filters and daily summaries.',
                link: '/dashboard',
                linkText: 'Open dashboard',
              },
              {
                step: '03',
                title: 'Ship consistently',
                copy: 'Track momentum and adjust quickly with calendar and analytics insights.',
                link: '/calendar',
                linkText: 'View calendar',
              },
            ].map((item) => (
              <div key={item.step} className="card-soft rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-3">{item.copy}</p>
                <Link to={item.link} className="text-sky-600 dark:text-sky-400 font-semibold inline-flex items-center mt-6">
                  {item.linkText} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Teams feel the difference
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Focused workflows, fewer handoffs, and a lighter mental load.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-soft rounded-3xl p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Ready to lead your week?
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Set up your dashboard in minutes and let AI handle the busywork.
              </p>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition dark:bg-white dark:text-slate-900"
            >
              Start free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;