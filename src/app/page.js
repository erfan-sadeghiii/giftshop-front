import LazyHomeSections from "./components/home/lazySection";


export const metadata = {
  title: "TixoGame",
  description: "Discover our latest products, amazing deals, and top articles.",
};

export default function Home() {
  return (
    <main className="relative">
      <LazyHomeSections />
    </main>
  );
}
