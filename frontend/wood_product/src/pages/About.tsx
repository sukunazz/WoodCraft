import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64">
            <img
              src="/images/bg.jpg"
              alt="Our store"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white">Our Story</h2>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Founded in 2010, our eCommerce store started with a simple
              mission: to provide high-quality products at affordable prices
              with exceptional customer service. What began as a small online
              shop operating from a garage has grown into a trusted marketplace
              serving customers worldwide.
            </p>
            <p className="text-gray-700 mb-4">
              Our team of dedicated professionals works tirelessly to curate the
              best selection of products across multiple categories. We believe
              in sustainable business practices and work only with suppliers who
              share our values of quality, integrity, and responsibility.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Our Mission
            </h2>
            <p className="text-gray-700">
              To create a seamless and enjoyable shopping experience that
              connects people with products they love. We strive to build
              lasting relationships with our customers through transparency,
              reliability, and personalized service.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Our Vision
            </h2>
            <p className="text-gray-700">
              To become the most trusted online marketplace by consistently
              exceeding customer expectations and setting new standards for
              eCommerce excellence. We aim to innovate and evolve while staying
              true to our core values.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Team</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: "Sarah Johnson",
              role: "CEO & Founder",
              bio: "With over 15 years of experience in retail and eCommerce, Sarah leads our company with passion and vision.",
            },
            {
              name: "Michael Chen",
              role: "CTO",
              bio: "Michael oversees our technology infrastructure and is constantly improving our platform for better user experience.",
            },
            {
              name: "Jessica Rodriguez",
              role: "Customer Experience Director",
              bio: "Jessica ensures that every customer interaction with our company exceeds expectations.",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48">
                <img
                  // src={`/api/placeholder/300/300?text=${member.name}`}
                  src="/images/bg.jpg"
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-700 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Quality",
                description:
                  "We never compromise on the quality of our products. Each item is carefully selected and verified.",
              },
              {
                title: "Integrity",
                description:
                  "Honest business practices and transparent communication are at the core of everything we do.",
              },
              {
                title: "Innovation",
                description:
                  "We embrace new technologies and ideas to continually improve our services and offerings.",
              },
              {
                title: "Customer Focus",
                description:
                  "Our customers are our top priority, and their satisfaction drives all our decisions.",
              },
            ].map((value, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pb-8">
          <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We're grateful for each customer who chooses to shop with us. Your
            support enables us to continue growing and improving our services.
            We look forward to being your trusted shopping destination for years
            to come.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
