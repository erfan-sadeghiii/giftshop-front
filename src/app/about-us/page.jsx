import BreadCrumb from "../components/Products/BreadCrumb";

const AboutUsSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 pb-24 relative overflow-hidden">
           <div className="pb-8  flex justify-center">
      <BreadCrumb/>

      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 relative ">
        {/* Image Half */}
        <div className="lg:w-6/12 w-full relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="/images/articles/2.webp"
              alt="About Us"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Content Half */}
        <div className="lg:w-6/12 w-full flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white animate-fadeInUp">
            About Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl animate-fadeInUp delay-100">
            We are a team of passionate individuals dedicated to delivering top-notch 
            solutions and creating amazing experiences for our clients. Our mission is 
            to innovate, inspire, and make a positive impact in the industry.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl animate-fadeInUp delay-200">
            With years of experience and a focus on quality, we ensure every project we 
            take on exceeds expectations and brings value to our partners.
          </p>
          {/* <button className="self-start bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition transform">
            Learn More
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
