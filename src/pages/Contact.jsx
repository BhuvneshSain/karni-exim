const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 text-center">Get in Touch</h2>

      <div className="text-gray-700 space-y-2 text-md">
        <p><strong>📍 Address:</strong> Plot No. 5, Suraj Colony, Near Udasar Army Gate, Bikaner-334001, Rajasthan, India</p>
        <p><strong>📧 Email:</strong> <a className="text-blue-600 underline" href="mailto:info@karniExim.com">info@karniExim.com</a></p>
        <p><strong>📞 Phone:</strong> <a className="text-blue-600" href="tel:+918209987858">+91 82099 87858</a></p>
      </div>

      <iframe
        title="Karni Exim Location"
        className="w-full h-64 rounded shadow"
        src="https://maps.google.com/maps?q=karni%20exim%20bikaner&t=&z=13&ie=UTF8&iwloc=&output=embed"
        allowFullScreen=""
        loading="lazy"
      ></iframe>

      <div className="text-center">
        <a
          href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20your%20products"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow transition"
        >
          💬 Chat with Us on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Contact;
