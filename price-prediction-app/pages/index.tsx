import Link from "next/link";

export default function Home() {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
        <div className="flex flex-col mb-16 sm:text-center sm:mb-0">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-semibold leading-none tracking-tight text-gray-800 sm:text-4xl md:mx-auto">
              A simple app to predict price of{" "}
              <span className="font-bold text-gray-400">Gold</span>,{" "}
              <span className="font-bold text-gray-400">Platinum</span>, and{" "}
              <span className="font-bold text-gray-400">Silver</span>.
            </h2>
          </div>
          <div>
            <Link
              suppressHydrationWarning={true}
              href="/trading-chart-gold"
              className="inline-flex items-center justify-center h-12 px-6 font-medium 
              tracking-wide text-white transition duration-200 rounded 
              shadow-md bg-gray-800 hover:bg-gray-400 focus:shadow-outline focus:outline-none"
            >
              Trading Chart (Gold)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
