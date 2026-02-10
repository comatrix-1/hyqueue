import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight, Download } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block mt-2">Queue Management?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Join hundreds of businesses already using HyQueue to deliver exceptional customer experiences. 
            <span className="block mt-2 font-semibold">Start your transformation today—it's completely free!</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="secondary" 
              size="xl"
              asChild
              className="group"
            >
              <a href={import.meta.env.VITE_APP_URL || '#'} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-6 h-6" />
                Try Live Demo
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            
            <Button 
              variant="glass" 
              size="xl"
              asChild
            >
              <a href="https://github.com/comatrix-1/hyqueue" target="_blank" rel="noopener noreferrer">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                Get Started Free
              </a>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Installation</h3>
              <p className="text-white/80">Clone and deploy in minutes</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-4">
                <span className="text-2xl">🔓</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Open Source</h3>
              <p className="text-white/80">Free forever, modify as needed</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Setup</h3>
              <p className="text-white/80">Ready in under 5 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;