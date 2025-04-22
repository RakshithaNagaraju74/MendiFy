import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-pink-600 text-white py-6">
        <h1 className="text-3xl text-center">About Us</h1>
      </header>
      
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-pink-600">Our Mission</h2>
        <p className="mt-4 text-gray-700">
          We are a community-driven platform dedicated to supporting teens on their mental wellness journey. Our mission is to provide accessible, safe, and effective resources for emotional support and personal growth.
        </p>
        
        <h2 className="text-2xl font-bold text-pink-600 mt-8">What We Do</h2>
        <p className="mt-4 text-gray-700">
          We offer a variety of tools to help teens track their mental health, engage in mindful activities, and connect with a supportive community. Our platform includes mood tracking, journaling, and AI-powered wellness guidance.
        </p>
        
        <h2 className="text-2xl font-bold text-pink-600 mt-8">Our Values</h2>
        <ul className="mt-4 text-gray-700 list-disc pl-5">
          <li>Support: We provide a non-judgmental space for everyone.</li>
          <li>Empowerment: We empower teens to take charge of their mental wellness.</li>
          <li>Privacy: Your data is always protected. We value your privacy.</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
