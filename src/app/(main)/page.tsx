import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to Waving Test
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover our amazing products and start shopping today.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/products"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Browse Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            View Categories <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Featured Categories
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* TODO: Add category cards */}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Featured Products
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* TODO: Add product cards */}
        </div>
      </section>
    </div>
  );
}
