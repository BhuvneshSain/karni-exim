const Contact = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Contact Karni Exim</h2>
      <p><strong>Address:</strong> Plot No. 5, Suraj Colony, Near Udasar Army Gate, Bikaner-334001, Rajasthan, India</p>
      <p><strong>Email:</strong> <a className="text-blue-600 underline" href="mailto:info@karniExim.com">info@karniExim.com</a></p>
      <p><strong>Phone:</strong> <a className="text-blue-600" href="tel:+918209987858">+91 82099 87858</a></p>

      <iframe
        title="Google Maps"
        className="w-full h-64 rounded"
        src="https://maps.google.com/maps?q=karni%20exim%20bikaner&t=&z=13&ie=UTF8&iwloc=&output=embed"
        allowFullScreen=""
        loading="lazy"
      ></iframe>

      <a
        href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20your%20products"
        className="inline-block bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        target="_blank" rel="noopener noreferrer"
      >
        💬 Chat with Us on WhatsApp
      </a>
    </div>
  );
};

export default Contact;
