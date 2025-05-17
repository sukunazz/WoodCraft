import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { sendDiscordMessage } from "../api/discord";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Format a message for Discord that includes all form data
      const formattedMessage = `
**New Contact Form Submission**
**Name:** ${formData.name}
**Email:** ${formData.email}
**Subject:** ${formData.subject}
**Message:** ${formData.message}
      `;

      // Use the function from our Discord API utility instead of fetch
      const result = await sendDiscordMessage(formattedMessage);

      if (!result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      // Success - clear form and show success message
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again later."
      );
      console.error("Discord API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Have questions, feedback, or need assistance? We're here to help!
          Choose the method that works best for you, and our team will be happy
          to assist.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Call Us</h3>
            <p className="text-gray-700 mb-2">Mon-Fri: 9AM - 6PM</p>
            <p className="text-blue-600 font-medium">(555) 123-4567</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Email Us</h3>
            <p className="text-gray-700 mb-2">24/7 Support</p>
            <p className="text-blue-600 font-medium">support@yourstore.com</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Visit Us</h3>
            <p className="text-gray-700 mb-2">Corporate Headquarters</p>
            <p className="text-blue-600 font-medium">
              123 Commerce St, Suite 500
              <br />
              San Francisco, CA 94103
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-blue-600 text-white p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="mb-6">
                We value your feedback and are committed to providing you with
                the best possible service. Fill out the form, and one of our
                representatives will get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-sm text-blue-100">
                      Monday - Friday: 9AM - 6PM
                      <br />
                      Saturday: 10AM - 4PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Store Locations</h4>
                    <p className="text-sm text-blue-100">
                      San Francisco, CA
                      <br />
                      New York, NY
                      <br />
                      Austin, TX
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Phone Support</h4>
                    <p className="text-sm text-blue-100">
                      Customer Service: (555) 123-4567
                      <br />
                      Technical Support: (555) 765-4321
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-green-100 rounded-full p-4 mb-4">
                    <Send className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Thank you for reaching out. We've received your message and
                    will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="subject"
                      className="block text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Using public image placeholder instead of Google Maps to avoid errors */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96">
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Map Location
                </h3>
                <p className="text-gray-600">
                  123 Commerce St, Suite 500
                  <br />
                  San Francisco, CA 94103
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
