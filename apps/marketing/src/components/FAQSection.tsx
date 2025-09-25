import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Is the system difficult to set up?",
      answer: "Not at all! HyQueue is designed for easy deployment. Simply clone the repository, configure your basic settings, and deploy to your preferred platform. The entire setup process takes less than 5 minutes with our detailed documentation."
    },
    {
      question: "Can I customize the system for my specific business needs?",
      answer: "Absolutely! Being 100% open-source, you have complete freedom to modify and customize HyQueue. You can change the UI, add custom features, integrate with existing systems, or adapt the workflow to match your business processes."
    },
    {
      question: "What platforms does HyQueue support?",
      answer: "HyQueue is a web-based application that works on any modern web browser. Customers can access it from smartphones, tablets, or desktop computers without downloading any apps. For deployment, it supports popular platforms like Netlify, Vercel, AWS, and any standard web hosting service."
    },
    {
      question: "How does the QR code feature work?",
      answer: "Each queue generates a unique QR code that customers can scan with their phone's camera. This instantly takes them to the queue interface where they can join the line and receive a ticket number. They'll get real-time updates on their position and estimated wait time."
    },
    {
      question: "Is there a mobile app required?",
      answer: "No mobile app is required! HyQueue works entirely in web browsers, making it accessible to all customers regardless of their device or technical expertise. This eliminates the barrier of app downloads and provides universal compatibility."
    },
    {
      question: "How secure is the customer data?",
      answer: "Security is built into HyQueue from the ground up. We follow industry best practices for data protection, use secure connections (HTTPS), and implement proper data handling procedures. Since it's open-source, you can also audit the code and add additional security measures as needed."
    },
    {
      question: "Can multiple staff members access the admin panel?",
      answer: "Yes! HyQueue supports multiple admin accounts with different permission levels. You can have managers with full access and staff members with limited permissions to call customers and manage day-to-day queue operations."
    },
    {
      question: "What happens if there's an internet outage?",
      answer: "While HyQueue requires internet connectivity for real-time updates, the system is designed to be resilient. You can implement local caching and offline fallback modes. The queue state is preserved in your backend of choice, and operations can resume seamlessly once connectivity is restored."
    },
    {
      question: "Is there ongoing support and updates?",
      answer: "As an open-source project, HyQueue benefits from community contributions and regular updates. The codebase is actively maintained, and you can find support through our GitHub repository, documentation, and community forums. Being open-source also means you're never locked into dependency on a single vendor."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked
            <span className="gradient-text block mt-2">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about HyQueue. 
            Can't find the answer you're looking for? Reach out to our community on GitHub.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-0 bg-card rounded-lg shadow-soft hover:shadow-medium transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline [&[data-state=open]]:text-primary">
                  <span className="text-lg font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;