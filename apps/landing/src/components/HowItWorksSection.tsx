import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Monitor, Users, BarChart3 } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: <QrCode className="w-8 h-8" />,
      title: "Deploy & Setup",
      description: "Clone the repository, configure your settings, and deploy to your preferred platform. Setup takes less than 5 minutes."
    },
    {
      step: "02",
      icon: <Users className="w-8 h-8" />,
      title: "Customers Join Queue",
      description: "Customers scan QR codes or visit your queue page to join the line. They receive a ticket number and real-time updates."
    },
    {
      step: "03",
      icon: <Monitor className="w-8 h-8" />,
      title: "Manage from Dashboard",
      description: "Use the admin panel to call next customers, manage queue status, and monitor wait times in real-time."
    },
    {
      step: "04",
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analyze & Optimize",
      description: "Review queue analytics, peak times, and customer satisfaction metrics to continuously improve your service."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple Setup,
            <span className="gradient-text block mt-2">Powerful Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your queue management system up and running in minutes, not hours. 
            No complex configurations or technical expertise required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-secondary opacity-30 z-0"></div>
              )}
              
              <Card className="relative z-10 text-center hover-lift border-0 shadow-soft bg-card">
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="text-6xl font-bold gradient-text mb-4 opacity-20">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white mb-6">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Ready in under 5 minutes
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;