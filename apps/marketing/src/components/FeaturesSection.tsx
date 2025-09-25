import { Card, CardContent } from "@/components/ui/card";
import { Code, Zap, Settings, Shield, TrendingUp, Smartphone } from "lucide-react";
import openSourceImage from "@/assets/open-source-feature.jpg";
import realtimeImage from "@/assets/realtime-feature.jpg";
import qrCodeImage from "@/assets/qr-code-feature.jpg";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "100% Open Source",
      description: "Complete freedom to customize and modify. No vendor lock-in, no hidden costs. Fork it, improve it, make it yours.",
      image: openSourceImage,
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Updates",
      description: "Instant queue status updates keep everyone informed. Live dashboard shows current position and estimated wait times.",
      image: realtimeImage,
      color: "from-secondary to-secondary-muted"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "QR Code Integration",
      description: "Customers can join queues remotely using QR codes. No app downloads required - works directly in any web browser.",
      image: qrCodeImage,
      color: "from-success to-success/80"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Intuitive Admin Panel",
      description: "Manage your entire queue system from one central dashboard. Configure settings, monitor performance, and analyze trends.",
      image: null,
      color: "from-primary-dark to-secondary"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Highly Scalable",
      description: "From small businesses to enterprise-level operations. Our system grows with your needs without compromising performance.",
      image: null,
      color: "from-secondary-muted to-primary"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Built with security best practices. Protect your customer data with enterprise-grade security measures.",
      image: null,
      color: "from-success to-primary"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="gradient-text block mt-2">Modern Queue Management</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to transform your customer experience and streamline operations. 
            Built by developers, for businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover-lift border-0 shadow-soft hover:shadow-strong bg-card overflow-hidden"
            >
              <CardContent className="p-0">
                {feature.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-80`}></div>
                  </div>
                )}
                
                <div className={`p-6 ${!feature.image ? `bg-gradient-to-br ${feature.color} text-white` : ''}`}>
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.image ? 'bg-gradient-to-br ' + feature.color + ' text-white' : 'bg-white/20'}`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${!feature.image ? 'text-white' : 'text-foreground'}`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`leading-relaxed ${!feature.image ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;