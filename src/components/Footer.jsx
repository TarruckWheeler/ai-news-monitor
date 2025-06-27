import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 pt-4 border-t text-center text-sm opacity-70">
      <p className="font-bold mb-2">AI Risk News Monitor</p>
      <p>Created by <strong>Tarruck Wheeler</strong></p>
      <p>Stanford University | <a href="mailto:tarruck@stanford.edu" className="underline">tarruck@stanford.edu</a></p>
      <p className="mt-2">
        <a href="https://github.com/TarruckWheeler/ai-news-monitor" className="underline">
          View on GitHub
        </a>
      </p>
      <p className="mt-2 text-xs">© 2025 Tarruck Wheeler. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
