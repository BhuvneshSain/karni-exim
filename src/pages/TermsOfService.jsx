import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I%20have%20a%20question%20about%20your%20Terms%20of%20Service.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">      <h1 className="text-3xl md:text-5xl font-bold text-charcoal-dark mb-6 md:mb-8 text-center animate__animated animate__fadeInDown">
        Terms of Service
      </h1>
      
      <div className="bg-cornsilk rounded-lg shadow-lg p-6 md:p-8 space-y-6 animate__animated animate__fadeIn animate__delay-1s">
        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-1s">          <h2 className="text-xl md:text-2xl font-semibold text-charcoal-dark mb-3">Welcome to Karni Exim</h2>
          <p className="text-gray">
            These Terms of Service ("Terms") govern your access to and use of the Karni Exim website located at karniexim.com (the "Site"). 
            By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms, 
            please do not access or use the Site.
          </p>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-2s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Use of Our Site</h2>
          <p className="text-gray-700 mb-3">
            You may use our Site only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Use the Site in any way that violates applicable laws or regulations</li>
            <li>Use the Site to send or upload any material containing viruses or other harmful programs</li>
            <li>Attempt to gain unauthorized access to any portion of the Site</li>
            <li>Interfere with the proper working of the Site</li>
            <li>Use the Site in any manner that could disable, overburden, or impair the Site</li>
          </ul>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-3s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Products and Services</h2>
          <p className="text-gray-700 mb-3">
            All products displayed on our Site are subject to availability. We reserve the right to discontinue any 
            product at any time. Prices for our products are subject to change without notice.
          </p>
          <p className="text-gray-700">
            We do not warrant that the quality of any products purchased or obtained through our Site will meet your 
            expectations or that any errors in the service will be corrected.
          </p>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-4s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Accuracy of Information</h2>
          <p className="text-gray-700">
            We strive to ensure that the information on our Site is accurate and complete. However, we do not warrant 
            that product descriptions or other content on the Site are accurate, complete, reliable, current, or error-free. 
            If a product offered on our Site is not as described, your sole remedy is to return it in unused condition.
          </p>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-5s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Intellectual Property Rights</h2>
          <p className="text-gray-700">
            The Site and its entire contents, features, and functionality (including but not limited to all information, 
            text, displays, images, and the design, selection, and arrangement thereof) are owned by Karni Exim or its 
            licensors and are protected by Indian and international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-5s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Limitation of Liability</h2>
          <p className="text-gray-700">
            To the fullest extent permitted by law, Karni Exim shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
            other intangible losses, resulting from your access to or use of or inability to access or use the Site.
          </p>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-5s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Indemnification</h2>
          <p className="text-gray-700">
            You agree to indemnify and hold harmless Karni Exim and its officers, directors, employees, and agents 
            from and against any and all claims, liabilities, damages, losses, or expenses, including reasonable attorneys' fees 
            and costs, arising out of or in any way connected with your access to or use of the Site or your violation of these Terms.
          </p>
        </section>

        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-5s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its 
            conflict of law principles. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction 
            of the courts in Rajasthan, India.
          </p>
        </section>        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-5s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Changes to Terms</h2>
          <p className="text-gray-700">
            We may revise these Terms from time to time. The most current version will always be posted on our Site. 
            By continuing to access or use our Site after revisions become effective, you agree to be bound by the revised Terms.
          </p>
        </section>
        
        <section className="transition-all duration-300 hover:translate-x-1 animate__animated animate__fadeInLeft animate__delay-5s">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, please contact us at:
          </p>
          <address className="text-gray-700 mt-2 not-italic">
            <p>Karni Exim</p>
            <p>Plot No. 5, Suraj Colony, Near Udasar Army Gate</p> 
            <p>Bikaner-334001, Rajasthan, India</p>
            <p>Email: <a href="mailto:info@karniexim.com" className="text-blue-600 hover:underline">info@karniexim.com</a></p>
            <p>Phone: <a href="tel:+918209987858" className="text-blue-600 hover:underline">+91 82099 87858</a></p>
          </address>
          
          <button 
            onClick={handleWhatsAppContact}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 18.129A9.937 9.937 0 0112 22a9.937 9.937 0 01-6-2.3 10.029 10.029 0 01-4-11.82A9.978 9.978 0 017.5 2.6 9.936 9.936 0 0112 2a9.937 9.937 0 016 2.3 10.029 10.029 0 014 11.829z"></path>
            </svg>
            Chat with Us on WhatsApp
          </button>
        </section><div className="text-gray-500 text-sm text-center pt-4 border-t border-gray-200 mt-6">
          Last Updated: June 8, 2025
        </div>
        
        {/* Related Links */}
        <div className="mt-8 pt-4 border-t border-gray-200 animate__animated animate__fadeIn animate__delay-5s">
          <h3 className="text-lg font-semibold text-blue-700 mb-3 text-center">Related Information</h3>
          <div className="flex flex-wrap justify-center gap-4">            <button onClick={() => navigate('/privacy-policy')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/products')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Browse Products
            </button>
            <button onClick={() => navigate('/contact')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Contact Us
            </button>
            <button onClick={() => navigate('/')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
        {/* Back to Top Button */}
      
    </div>
  );
};

export default TermsOfService;
