import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // You can implement form submission logic here (e.g., send email or API request)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-pink-600 text-white py-6">
        <h1 className="text-3xl text-center">Contact Us</h1>
      </header>
      
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-pink-600">We'd Love to Hear from You!</h2>
        <p className="mt-4 text-gray-700">
          Whether you have questions, feedback, or just want to reach out, feel free to contact us using the form below.
        </p>
        
        {isSubmitted ? (
          <div className="mt-8 text-center text-green-600">
            <h3 className="text-xl font-bold">Thank you for reaching out!</h3>
            <p>Your message has been sent successfully. We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="message">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
            >
              Send Message
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Contact;
