import React from 'react';

const ScannerHero = () => {
  return (
    <section className="mb-12">
      <h3 className="font-headline text-4xl md:text-6xl font-extrabold text-on-surface mb-6 tracking-tighter leading-tight italic">
        Transform your ink <br/>
        <span className="text-primary underline decoration-primary/20 underline-offset-8">into insights.</span>
      </h3>
      <p className="text-on-surface-variant max-w-2xl text-lg font-body leading-relaxed opacity-70">
        Upload photos of your handwritten notebooks or loose pages. Our Gemini-powered AI will transcribe text, 
        identify key concepts, and organize them into your neural library.
      </p>
    </section>
  );
};

export default ScannerHero;
