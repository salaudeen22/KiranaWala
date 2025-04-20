import React, { useState } from 'react';
import { FiSearch, FiChevronDown, FiChevronUp, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

function HelpCenter() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by going to Account Settings > Security > Reset Password. You'll receive an email with a link to create a new password."
    },
    {
      question: "How to contact customer support?",
      answer: "You can reach our support team 24/7 through:\n- Email: support@quickcart.com\n- Phone: +1 (800) 123-4567\n- Live chat (available in the app)"
    },
    {
      question: "How do I update my profile information?",
      answer: "Navigate to your Profile page and click the 'Edit Profile' button. You can update your name, email, profile picture, and other personal details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and select cryptocurrencies."
    },
    {
      question: "How can I track my order?",
      answer: "Go to 'My Orders' in the app and select the order you want to track. You'll see real-time updates including estimated delivery time and delivery partner details."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Some products like perishables and personal care items may have different policies. Visit our Returns Center for details."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contactMethods = [
    {
      icon: <FiMail className="text-blue-500 text-2xl" />,
      title: "Email Us",
      description: "Get help via email with our support team",
      action: "support@Kiranawalla.com"
    },
    {
      icon: <FiPhone className="text-green-500 text-2xl" />,
      title: "Call Us",
      description: "Speak directly with a support agent",
      action: "+91 9535443020"
    },
    {
      icon: <FiMessageSquare className="text-purple-500 text-2xl" />,
      title: "Live Chat",
      description: "Instant messaging with our team",
      action: "Available in app"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-3">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <button
                    className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-semibold text-gray-800 text-lg">{faq.question}</span>
                    {activeIndex === index ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {activeIndex === index && (
                    <div className="px-6 pb-4 pt-0 text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No results found for "{searchTerm}"</p>
                <p className="text-gray-400 mt-2">Try different keywords or contact support</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {method.icon}
                  <h3 className="ml-3 font-semibold text-gray-800">{method.title}</h3>
                </div>
                <p className="text-gray-600 mb-3 text-sm">{method.description}</p>
                <p className="font-medium text-blue-600">{method.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Popular Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Order Tracking",
              "Returns & Refunds",
              "Payment Issues",
              "Account Security",
              "Delivery Options",
              "Product Availability"
            ].map((topic, index) => (
              <button
                key={index}
                className="px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setSearchTerm(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;