import ArticlesSection from "../components/blog/ArticleSection";
import FeaturedSlider from "../components/blog/FeatureProductsSlider";
import BreadCrumb from "../components/Products/BreadCrumb";

const Page = () => {
  return (
    <main className="container mx-auto px-4 pt-0 pb-10">
      {/* Hero Section */}
      <section className="mb-16 text-center">
       <div className="pb-8  flex justify-center">
      <BreadCrumb/>

      </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">به وبلاگ ما خوش آمدید</h1>
        <p className="text-gray-900 dark:text-gray-300">
          جدیدترین به‌روزرسانی‌ها، داستان‌ها و بینش‌ها از تیم ما.
        </p>
      </section>

      {/* Featured Posts */}
      <FeaturedSlider />

      {/* All Articles */}
      <ArticlesSection />
    </main>
  );
};

export default Page;
