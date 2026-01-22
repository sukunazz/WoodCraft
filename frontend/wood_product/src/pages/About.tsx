import React from "react";

const About: React.FC = () => {
  return (
    <div className="mt-20 bg-gradient-to-b from-amber-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Crafted with care
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mt-3">
              About Woodcraft
            </h1>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              A modern marketplace built around timeless materials, thoughtful
              design, and a service experience that feels genuinely human.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden mb-10 ring-1 ring-slate-200/70">
            <div className="relative h-64 md:h-80">
              <img
                src="/images/bg.jpg"
                alt="Our store"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex items-end">
                <div className="p-8">
                  <h2 className="text-3xl md:text-4xl font-semibold text-white">
                    Our Story
                  </h2>
                  <p className="text-white/80 mt-3 max-w-xl">
                    From a small workshop to a trusted destination for curated
                    wood products, our journey is built on craftsmanship,
                    trust, and warm customer care.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 grid gap-4 text-slate-700 leading-relaxed">
              <p>
                Founded in 2010, our store began with a simple mission: deliver
                beautiful, durable products at fair prices with the kind of
                service that keeps customers coming back.
              </p>
              <p>
                Today our team curates collections that blend modern utility
                with handcrafted warmth. We partner with responsible suppliers
                who share our standards for quality, integrity, and care.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Years of craft", value: "14+" },
              { label: "Products curated", value: "2.4k" },
              { label: "Happy customers", value: "18k" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 text-center shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/70"
              >
                <p className="text-3xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Mission
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 mt-3">
                Make every space feel personal.
              </h2>
              <p className="text-slate-600 mt-4">
                We create a seamless shopping experience that connects people
                with pieces they love, backed by transparency, reliability, and
                thoughtful service at every step.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Vision
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 mt-3">
                Lead with craft, build with trust.
              </h2>
              <p className="text-slate-600 mt-4">
                We aim to be the most trusted destination for wood products by
                setting a higher bar for quality, storytelling, and care.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-slate-900 mb-6 text-center">
            Meet Our Team
          </h2>

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
                className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 overflow-hidden ring-1 ring-slate-200/70"
              >
              <div className="h-52 relative">
                <img
                  src="/images/bg.jpg"
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-amber-700 text-sm uppercase tracking-[0.2em] mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/40 mb-12 ring-1 ring-slate-200/70">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4 text-center">
            Our Values
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-8">
            The principles that guide every collection, conversation, and
            delivery we make.
          </p>
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
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl p-5 bg-slate-50"
              >
                <div className="bg-amber-100 text-amber-700 rounded-full p-2 mt-1">
                  <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pb-4">
          <h3 className="text-2xl font-semibold text-slate-900 mb-3">
            Join Our Journey
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            We're grateful for each customer who chooses to shop with us. Your
            support enables us to continue growing and improving our service for
            years to come.
          </p>
          <button className="bg-amber-600 text-white px-7 py-3 rounded-full hover:bg-amber-700 transition duration-300 shadow-lg shadow-amber-200/60">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default About;
