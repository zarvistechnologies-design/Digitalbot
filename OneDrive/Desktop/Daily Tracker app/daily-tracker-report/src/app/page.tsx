import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Target,
  BarChart3,
  Brain,
  Calendar,
  Zap,
  ArrowRight,
  Check,
  Mic,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Daily Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
            <Sparkles className="h-4 w-4" />
            AI-Powered Productivity
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Master Your Goals with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Tracking
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Set goals, track daily progress, and understand your productivity patterns. Our AI analyzes
            your energy levels, mood, and habits to help you work smarter, not harder.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Everything You Need to Stay on Track
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            A complete productivity system that adapts to how you work best
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Target}
            title="Smart Goal Setting"
            description="Break down big goals into manageable tasks. AI generates an optimized schedule based on your preferences."
          />
          <FeatureCard
            icon={Calendar}
            title="Daily Check-ins"
            description="Beautiful task cards with one-tap completion. Track energy, mood, and add voice or text remarks."
          />
          <FeatureCard
            icon={Zap}
            title="Energy Tracking"
            description="Log your energy levels to discover your peak productivity hours and optimize your schedule."
          />
          <FeatureCard
            icon={Brain}
            title="Pattern Detection"
            description="AI analyzes your habits to identify procrastination patterns and suggests personalized improvements."
          />
          <FeatureCard
            icon={BarChart3}
            title="Powerful Analytics"
            description="Weekly reports with completion rates, mood correlations, and actionable insights."
          />
          <FeatureCard
            icon={Mic}
            title="Voice Remarks"
            description="Quickly capture thoughts with voice recording. Perfect for reflecting on your day."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
              Get started in minutes and transform your productivity
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number={1}
              title="Set Your Goal"
              description="Tell us what you want to achieve and break it into tasks. Set difficulty and time estimates."
            />
            <StepCard
              number={2}
              title="AI Creates Your Plan"
              description="Our AI generates an optimized schedule based on your energy patterns and preferences."
            />
            <StepCard
              number={3}
              title="Track & Improve"
              description="Check in daily, log your progress, and watch as AI helps you understand and improve your habits."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Transform Your Productivity?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
            Join thousands of achievers who are accomplishing more with less stress.
          </p>
          <div className="mt-10">
            <Link href="/signup">
              <Button size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started for Free
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Free forever plan
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Daily Tracker. Built with ❤️ for productivity enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
        <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-violet-500/25">
        {number}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
