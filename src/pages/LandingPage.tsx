import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Download,
  Filter,
  Clock,
  Database,
  Phone,
  // Play,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: Database,
      title: "Bulk Data Extraction",
      description:
        "Extract thousands of business listings in minutes with our powerful bulk processing engine.",
    },
    {
      icon: Clock,
      title: "Real-time Results",
      description:
        "Get instant access to fresh data with real-time extraction and processing capabilities.",
    },
    {
      icon: Download,
      title: "CSV/Excel Export",
      description:
        "Export your data in multiple formats including CSV, Excel, and JSON for easy integration.",
    },
    {
      icon: Filter,
      title: "Location Filtering",
      description:
        "Target specific areas, radius, and demographics with advanced location-based filtering.",
    },
    {
      icon: MapPin,
      title: "Business Details",
      description:
        "Get comprehensive business information including hours, ratings, and complete profiles.",
    },
    {
      icon: Phone,
      title: "Contact Information",
      description:
        "Extract verified contact details including phone numbers, emails, and websites.",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Search Location",
      description:
        "Enter your target location and business category to start extracting data.",
    },
    {
      number: 2,
      title: "Extract Data",
      description:
        "Our AI-powered engine extracts comprehensive business information automatically.",
    },
    {
      number: 3,
      title: "Download Results",
      description:
        "Get your data in your preferred format - CSV, Excel, or JSON.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for small businesses and freelancers",
      features: [
        "Limited extractions",
        // "1,000 extractions/month",
        "Basic business info",
        "CSV export",
        "Email support",
        "Basic filtering",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$20",
      oldPrice: "$50",
      period: "/month",
      description: "Best for growing businesses and agencies",
      features: [
        "Unlimited extractions",
        // "10,000 extractions/month",
        "Complete business profiles",
        "All export formats",
        "Priority support",
        "Advanced filtering",
        // "API access",
        "Bulk processing",
      ],
      popular: true,
    },
    // {
    //   name: "Enterprise",
    //   price: "$49",
    //   period: "/month",
    //   description: "For large organizations and teams",
    //   features: [
    //     "Unlimited extractions",
    //     "Custom data fields",
    //     "White-label solution",
    //     "Dedicated account manager",
    //     "Custom integrations",
    //     "Advanced analytics",
    //     "SLA guarantee",
    //   ],
    //   popular: false,
    // },
  ];

  const testimonials = [
    {
      name: "Mahesh Surve",
      company: "Manifest Solutions Pvt Ltd",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "CazaLead helped us generate 300% more leads in our target market. The data quality is exceptional!",
    },
    {
      name: "Siddharth Jaiswal",
      company: "Infosys Pvt Ltd",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "We've saved countless hours on research. This tool is a game-changer for our lead generation campaigns.",
    },
    {
      name: "Priya Uttam",
      company: "Shail Infotech",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The accuracy and speed of data extraction is incredible. Our ROI improved by 250% in just 3 months.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="hero-gradient pt-16 pb-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="text-white">Google Maps </span>
              <span className="text-yellow-300">Lead Finder</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Access complete business profiles with contacts and verified
              emails, organized for sales, marketing, and research
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary cursor-pointer hover:bg-white/90 px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto sm:min-w-[200px]"
                onClick={handleStartTrial}
              >
                Start Extracting Leads
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button> */}
            </div>
            <p className="text-sm text-white/80 mt-4 flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              No credit card required!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Data Extraction
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to extract, process, and export Google Maps
              business data efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your business needs
            </p>
          </div>
          {/* <div className="grid md:grid-cols-3 gap-8"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? "border-primary shadow-xl scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Limited Time Offer
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    {plan.oldPrice ? (
                      <span className="text-xl text-muted-foreground line-through">
                        {plan.oldPrice}
                      </span>
                    ) : null}
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 cursor-pointer ${
                      plan.popular ? "bg-primary" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleStartTrial}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of businesses growing with CazaLead
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient py-20 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Supercharge Your Lead Generation?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of businesses using CazaLead to grow their customer
            base
          </p>
          <Button
            size="lg"
            className="bg-white text-primary cursor-pointer hover:bg-white/90 px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto sm:min-w-[250px]"
            onClick={handleStartTrial}
          >
            Start Your Free Trial Today{" "}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <p className="text-sm text-white/80 mt-4 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            No credit card required!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div> */}
                <div
                  onClick={() => navigate("/")}
                  className="w-10 h-10 cursor-pointer bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center"
                >
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span
                  onClick={() => navigate("/")}
                  className="text-xl cursor-pointer font-bold gradient-text"
                >
                  CazaLead
                </span>
              </div>
              <p className="text-muted-foreground">
                The most powerful Google Maps data extraction tool for
                businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Get the latest updates and features.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 border border-border rounded-md bg-background w-full sm:flex-1"
                />
                <Button className="w-full sm:w-auto sm:flex-shrink-0 cursor-pointer">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CazaLead. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
