import React from "react";
import { useAuth } from "../hooks/Auth";
import Card from "../components/Card";
import Button from "../components/Button";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { user, userProfile, loading } = useAuth();

  const handleGoToDashboard = () => {
    if (userProfile?.role === "volunteer") setCurrentPage("volunteerDashboard");
    if (userProfile?.role === "recipient") setCurrentPage("recipientDashboard");
    if (userProfile?.role === "storeAssociate")
      setCurrentPage("storeAssociateDashboard");
  };

  const features = [
    {
      icon: "🚚",
      title: "Smart Delivery Routes",
      description: "AI-powered routing optimization reduces delivery time and carbon footprint by up to 40%."
    },
    {
      icon: "🌱",
      title: "Carbon Neutral",
      description: "Every delivery is offset through our partnership with verified carbon reduction projects."
    },
    {
      icon: "👥",
      title: "Community Driven",
      description: "Local volunteers earn rewards while helping neighbors receive their packages efficiently."
    },
    {
      icon: "📱",
      title: "Real-time Tracking",
      description: "Track your deliveries with live updates and communicate directly with your delivery volunteer."
    },
    {
      icon: "🏪",
      title: "Local Store Network",
      description: "Partner with local businesses to create convenient pickup and drop-off points."
    },
    {
      icon: "🎯",
      title: "Flexible Scheduling",
      description: "Choose delivery windows that work for you, from same-day to scheduled weekly deliveries."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Deliveries Completed" },
    { number: "2,500+", label: "Active Volunteers" },
    { number: "40%", label: "Carbon Reduction" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Community Recipient",
      content: "The volunteers in my area are amazing! My packages always arrive on time and I love knowing I'm supporting local community members.",
      avatar: "👩‍💼"
    },
    {
      name: "Mike Rodriguez",
      role: "Delivery Volunteer",
      content: "I've earned over $500 this month just by delivering packages in my neighborhood during my evening walks. It's perfect!",
      avatar: "👨‍🚀"
    },
    {
      name: "Green Grocers Co.",
      role: "Store Partner",
      content: "Our partnership has increased foot traffic by 35% and helped us serve our community better than ever before.",
      avatar: "🏪"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Join as a recipient, volunteer, or store partner in just 2 minutes"
    },
    {
      step: "2",
      title: "Get Matched",
      description: "Our smart algorithm connects you with the best delivery options in your area"
    },
    {
      step: "3",
      title: "Track & Deliver",
      description: "Follow your package in real-time and enjoy seamless, sustainable delivery"
    }
  ];

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-300 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-300 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
            Sustainable Last-Mile Delivery
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing delivery through community power, cutting-edge technology, and environmental responsibility
          </p>
          
          {loading ? (
            <div className="inline-flex items-center space-x-2 text-blue-200">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-lg">Loading your personalized experience...</span>
            </div>
          ) : user && !user.isAnonymous ? (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <p className="text-2xl font-semibold text-blue-100 mb-4">
                  Welcome back, {userProfile?.role}! 🎉
                </p>
                <Button 
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Access Your Dashboard →
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setCurrentPage("login")}
                className="bg-blue text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Sign In to Continue
              </Button>
              <Button
                onClick={() => setCurrentPage("register")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Join Our Community 🚀
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 transform group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of delivery with features designed for sustainability, efficiency, and community impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0">
                <div className="text-center">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                    {item.step}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-green-200 transform -translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-green-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-blue-100">
              Real stories from real people making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-blue-100 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-blue-200 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Delivery?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of community members already making a positive impact
          </p>
          
          {!user || user.isAnonymous ? (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentPage("register")}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                Start Your Journey Today 🌟
              </Button>
              <Button
                onClick={() => setCurrentPage("login")}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                Already Have an Account?
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGoToDashboard}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Continue to Your Dashboard 🚀
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;