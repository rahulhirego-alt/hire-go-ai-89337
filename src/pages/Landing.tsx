import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Briefcase, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HireGoai
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Hiring Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Hire smarter.{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Onboard faster.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your hiring process with AI. From candidate screening to interviews and onboarding - all automated and optimized for scale.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg" className="group">
                Start Hiring Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup&role=candidate">
              <Button variant="outline" size="lg">
                Find Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to hire at scale
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by AI, built for 10,000+ candidates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI-Powered Matching"
              description="Intelligent candidate-job matching with ML algorithms that understand skills, experience, and cultural fit."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Smart Onboarding"
              description="Multi-step onboarding with AI resume parsing, video assessments, and automated skill evaluation."
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Unified Dashboards"
              description="Separate, intuitive dashboards for candidates and employers with real-time updates and analytics."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Automated Screening"
              description="AI-driven resume parsing and skill assessments reduce screening time by 80%."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Interview Assistant"
              description="Generate role-specific questions, schedule interviews, and get AI-powered candidate insights."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Built for Scale"
              description="Optimized infrastructure to handle 10,000+ candidates with lightning-fast performance."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm border border-border rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to revolutionize your hiring?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join forward-thinking companies using AI to find the perfect candidates faster.
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="gradient" size="lg" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">HireGoai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 HireGoai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default Landing;
