import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Header */}
      <div className="bg-brand-brown text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <h1 className="font-serif text-5xl font-bold mb-4 relative z-10">Our Story</h1>
        <p className="text-xl opacity-90 relative z-10 max-w-2xl mx-auto font-light">From a humble beginning to a Hyderabad heritage.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
        
        {/* Origin Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg text-gray-600">
                <h2 className="font-serif text-3xl font-bold text-brand-brown mb-6">Established 1978</h2>
                <p>
                    The story of Cafe Niloufer begins with the vision of <strong>Sri A. Babu Rao</strong>. 
                    In 1978, what started as a small, unassuming outlet in the Red Hills area of Lakdikapul 
                    has today transformed into one of the most iconic landmarks of Hyderabad.
                </p>
                <p>
                    For decades, the cafe has been a melting pot of cultures. Students, politicians, businessmen, 
                    and artists—everyone finds a common ground here over a cup of our signature chai.
                </p>
            </div>
            <div className="bg-white p-2 shadow-lg rotate-2">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" alt="Vintage Cafe" className="w-full h-auto grayscale hover:grayscale-0 transition duration-700" />
                <p className="text-center text-xs text-gray-400 mt-2 font-serif italic">Early days at Lakdikapul</p>
            </div>
        </section>

        {/* The Secret */}
        <section className="bg-white p-10 rounded-2xl shadow-xl border-l-4 border-brand-gold">
            <h2 className="font-serif text-3xl font-bold text-brand-brown mb-6">The Secret Brew</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                People often ask us, "What makes your chai so special?" The answer lies in the process. 
                We don't just boil tea; we craft it. Our tea leaves are sourced from the finest gardens 
                in Assam and blended with a specific ratio of creamy buffalo milk.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
                But the true magic is in the <strong>Osmania Biscuits</strong>. These buttery, sweet-and-salty 
                delights were traditionally baked for the Royal courts. Today, we bake thousands every hour, 
                ensuring every customer gets them fresh, warm, and melting in the mouth.
            </p>
        </section>

        {/* Modern Era */}
        <section className="text-center">
            <h2 className="font-serif text-3xl font-bold text-brand-brown mb-8">Niloufer Today</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold text-xl text-brand-red mb-2">Expansion</h3>
                    <p className="text-gray-600 text-sm">From Red Hills to Banjara Hills and Hitech City, we are spreading the aroma of Irani Chai across Telangana.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold text-xl text-brand-red mb-2">Innovation</h3>
                    <p className="text-gray-600 text-sm">While we cherish tradition, we innovate with items like Pumpkin Bread, Multi-grain biscuits, and premium coffee blends.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold text-xl text-brand-red mb-2">Community</h3>
                    <p className="text-gray-600 text-sm">We are more than a business; we are an emotion. "Chalo Niloufer" is a phrase that connects millions.</p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default About;