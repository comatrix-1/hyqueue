import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Restaurant Manager",
      company: "Downtown Bistro",
      content: "This queue management system has completely transformed how we handle customer flow. The ticketing system is intuitive, and the QR code feature makes it super convenient for our customers.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Clinic Administrator", 
      company: "HealthFirst Medical",
      content: "The TV view feature keeps our waiting patients informed. It's a game changer for our practice! The admin panel is user-friendly, giving us full control over the backend.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Lisa Thompson",
      role: "Branch Manager",
      company: "Community Bank",
      content: "Our customers are thrilled with the QR code feature. They can join the queue remotely, saving them so much time. The analytics help us optimize our staffing.",
      rating: 5,
      avatar: "LT"
    },
    {
      name: "David Park",
      role: "Service Manager",
      company: "Auto Service Pro",
      content: "Being open-source was crucial for us. We customized it to fit our specific workflow, and the real-time updates keep our customers happy and informed.",
      rating: 5,
      avatar: "DP"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by Businesses
            <span className="gradient-text block mt-2">Across Industries</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how HyQueue is transforming customer experiences in restaurants, 
            clinics, banks, and service centers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover-lift border-0 shadow-soft hover:shadow-medium bg-card relative overflow-hidden"
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-12 h-12 text-primary" />
                </div>
                
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Active Deployments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">50k+</div>
            <div className="text-sm text-muted-foreground">Customers Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;