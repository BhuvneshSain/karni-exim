const Contact = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">Get in Touch</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-gray-700 space-y-4 text-lg">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 text-2xl">📍</span> 
              <span><strong className="text-gray-800">Address:</strong> Plot No. 5, Suraj Colony, Near Udasar Army Gate, Bikaner-334001, Rajasthan, India</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 text-2xl">📧</span> 
              <span><strong className="text-gray-800">Email:</strong> <a className="text-blue-600 underline" href="mailto:info@karniExim.com">info@karniExim.com</a></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 text-2xl">📞</span> 
              <span><strong className="text-gray-800">Phone:</strong> <a className="text-blue-600" href="tel:+918209987858">+91 82099 87858</a></span>
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <a
              href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition text-lg"
            >
              💬 Chat with Us on WhatsApp
            </a>
          </div>
        </div>
        
        <div>
          <iframe
            title="Karni Exim Location"
            className="w-full h-full min-h-[300px] rounded-lg shadow-md"
            src="https://maps.google.com/maps?q=karni%20exim%20bikaner&t=&z=13&ie=UTF8&iwloc=&output=embed"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
