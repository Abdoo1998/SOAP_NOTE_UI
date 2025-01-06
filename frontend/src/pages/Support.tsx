import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export function Support() {
  const faqs = [
    {
      question: "How do I create a new SOAP note?",
      answer: "Navigate to 'New SOAP Note' in the sidebar, enter patient details, then either record your voice or type directly into the editor."
    },
    {
      question: "Can I export my notes?",
      answer: "Yes! You can export notes to Word, PDF, or CSV format using the export button in the note viewer."
    },
    {
      question: "How does voice recognition work?",
      answer: "Our AI-powered system converts your voice to text in real-time, automatically formatting it into SOAP note sections."
    }
  ];

  const resources = [
    {
      title: "User Guide",
      description: "Comprehensive guide to using all features",
      icon: Book,
      link: "#"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step visual instructions",
      icon: FileText,
      link: "#"
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Help & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers and get assistance
          </p>
        </div>
      </motion.div>

      {/* Quick Contact */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 rounded-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Live Chat Support</h2>
          </div>
          <p className="mb-4 text-blue-100">Get instant help from our support team</p>
          <button className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Start Chat
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Mail className="h-5 w-5" />
              <span>support@omnicore.ai</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Phone className="h-5 w-5" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <a
              key={index}
              href={resource.link}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </a>
          );
        })}
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="text-sm">Still need help? Our support team is here for you 24/7</span>
        </div>
      </div>
    </div>
  );
}