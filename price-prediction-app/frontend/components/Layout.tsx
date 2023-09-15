import { LayoutProps } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isTradingMenuOpen, setIsTradingMenuOpen] = useState<boolean>(false);
  const [isSingleMenuOpen, setIsSingleMenuOpen] = useState<boolean>(false);

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-gray-800">
        <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
          <div className="relative flex grid items-center grid-cols-2 lg:grid-cols-3">
            <ul className="flex items-center hidden space-x-8 lg:flex">
              <li>
                <div
                  onMouseEnter={() => setIsTradingMenuOpen(true)}
                  onMouseLeave={() => setIsTradingMenuOpen(false)}
                >
                  <Link
                    suppressHydrationWarning={true}
                    href="/trading-chart-gold"
                    aria-label="Trading Chart"
                    title="Trading Chart"
                    className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-gray-400"
                  >
                    Trading Chart
                  </Link>
                  {isTradingMenuOpen && (
                    <div className="absolute">
                      {" "}
                      <div className="mt-2 -ml-2 bg-white rounded shadow-lg">
                        <ul>
                          <li>
                            <Link
                              suppressHydrationWarning={true}
                              href="/trading-chart-gold"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                              Gold
                            </Link>
                          </li>
                          <li>
                            <Link
                              suppressHydrationWarning={true}
                              href="/trading-chart-platinum"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                              Platinum
                            </Link>
                          </li>
                          <li>
                            <Link
                              suppressHydrationWarning={true}
                              href="/trading-chart-silver"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                              Silver
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </li>
              <li>
                <div
                  onMouseEnter={() => setIsSingleMenuOpen(true)}
                  onMouseLeave={() => setIsSingleMenuOpen(false)}
                >
                  <Link
                    suppressHydrationWarning={true}
                    href="/single-day-gold"
                    aria-label="Single Day"
                    title="Single Day"
                    className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-gray-400"
                  >
                    Single Day
                  </Link>
                  {isSingleMenuOpen && (
                    <div className="absolute">
                      <div className="mt-2 -ml-2 bg-white rounded shadow-lg">
                        <ul>
                          <li>
                            <Link
                              suppressHydrationWarning={true}
                              href="/single-day-gold"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                              Gold
                            </Link>
                          </li>
                          <li>
                            <Link
                              suppressHydrationWarning={true}
                              href="/single-day-platinum"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                              Platinum
                            </Link>
                          </li>
                          <li>
                            <Link
                              suppressHydrationWarning={true}
                              href="/single-day-silver"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                              Silver
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            </ul>
            <Link
              suppressHydrationWarning={true}
              href="/"
              aria-label="Company"
              title="Company"
              className="inline-flex items-center lg:mx-auto"
            >
              <svg
                className="w-8 text-deep-purple-accent-100"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.2791 0.00767984C8.54568 0.205914 6.07359 1.22412 4.07009 2.98419C1.82328 4.95452 0.411514 7.66672 0.0540676 10.7033C-0.0180225 11.322 -0.0180225 12.6886 0.0540676 13.2954C0.243304 14.8662 0.642803 16.1818 1.35169 17.5514C2.91665 20.582 5.78223 22.8436 9.09537 23.6576C10.1647 23.9189 10.8556 24 12 24C13.1444 24 13.8353 23.9189 14.9046 23.6576C18.2178 22.8436 21.0834 20.582 22.6483 17.5514C23.3572 16.1818 23.7567 14.8662 23.9459 13.2954C24.018 12.6886 24.018 11.319 23.9459 10.7123C23.6546 8.29746 22.7715 6.20099 21.2576 4.3448C20.9272 3.93932 20.0651 3.0773 19.6596 2.74691C17.8183 1.24814 15.6616 0.332063 13.3367 0.0647472C12.9342 0.019694 11.6305 -0.0163485 11.2791 0.00767984ZM12.3274 5.29092C12.8501 5.41706 13.2676 5.79551 13.4478 6.32113L13.5169 6.52237V11.9888C13.5169 17.251 13.5139 17.4613 13.4598 17.6205C13.2315 18.2903 12.6638 18.7108 11.985 18.7138C11.4053 18.7138 10.8946 18.4044 10.6183 17.8878C10.429 17.5304 10.438 17.8577 10.438 12.0008C10.438 8.51372 10.4501 6.60947 10.4681 6.50435C10.5191 6.23103 10.6874 5.92466 10.8976 5.71141C11.2851 5.32396 11.8108 5.17077 12.3274 5.29092ZM17.566 7.63368C17.8363 7.70276 18.0345 7.8199 18.2508 8.03616C18.4611 8.2464 18.5692 8.42361 18.6593 8.71496C18.7104 8.88316 18.7134 9.04535 18.7134 11.0878C18.7134 13.1302 18.7104 13.2924 18.6593 13.4606C18.5722 13.7399 18.4641 13.9231 18.2718 14.1243C17.9715 14.4367 17.62 14.5869 17.1815 14.5869C16.8931 14.5869 16.6949 14.5388 16.4516 14.4067C16.2353 14.2925 15.9439 13.9982 15.8358 13.7909C15.6586 13.4395 15.6646 13.5146 15.6646 11.0848C15.6646 8.94623 15.6676 8.85012 15.7247 8.6639C15.8748 8.17132 16.2924 7.76584 16.785 7.63368C16.9922 7.57962 17.3527 7.57661 17.566 7.63368ZM7.17297 13.3104C7.72265 13.4546 8.17322 13.9261 8.29036 14.4878C8.32641 14.647 8.33542 14.9834 8.33542 16.0166C8.33542 17.248 8.33242 17.3562 8.27534 17.5784C8.1582 18.035 7.88185 18.3714 7.44931 18.5846C7.20901 18.7047 7.16696 18.7138 6.90263 18.7258C6.73442 18.7348 6.54218 18.7228 6.44606 18.7017C5.86033 18.5726 5.36471 18.032 5.27159 17.4192C5.25056 17.2811 5.24155 16.7344 5.24756 15.8574L5.25657 14.5118L5.33467 14.3106C5.4398 14.0402 5.57497 13.836 5.77021 13.6558C5.94143 13.5026 6.22678 13.3464 6.43104 13.2984C6.61427 13.2563 6.98673 13.2623 7.17297 13.3104Z"
                  fill="white"
                />
              </svg>
              <span className="ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase">
                S.Trade Price Predict
              </span>
            </Link>
            <div className="ml-auto lg:hidden">
              <button
                suppressHydrationWarning={true}
                aria-label="Open Menu"
                title="Open Menu"
                className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"
                onClick={() => setIsMenuOpen(true)}
              >
                <svg className="w-5 text-gray-200" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
                  />
                  <path
                    fill="currentColor"
                    d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
                  />
                  <path
                    fill="currentColor"
                    d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
                  />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute top-0 left-0 w-full">
                  <div className="p-5 bg-gray-900 border rounded shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Link
                          suppressHydrationWarning={true}
                          href="/"
                          aria-label="Company"
                          title="Company"
                          className="inline-flex items-center"
                        >
                          <svg
                            className="w-8 text-deep-purple-accent-100"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M11.2791 0.00767984C8.54568 0.205914 6.07359 1.22412 4.07009 2.98419C1.82328 4.95452 0.411514 7.66672 0.0540676 10.7033C-0.0180225 11.322 -0.0180225 12.6886 0.0540676 13.2954C0.243304 14.8662 0.642803 16.1818 1.35169 17.5514C2.91665 20.582 5.78223 22.8436 9.09537 23.6576C10.1647 23.9189 10.8556 24 12 24C13.1444 24 13.8353 23.9189 14.9046 23.6576C18.2178 22.8436 21.0834 20.582 22.6483 17.5514C23.3572 16.1818 23.7567 14.8662 23.9459 13.2954C24.018 12.6886 24.018 11.319 23.9459 10.7123C23.6546 8.29746 22.7715 6.20099 21.2576 4.3448C20.9272 3.93932 20.0651 3.0773 19.6596 2.74691C17.8183 1.24814 15.6616 0.332063 13.3367 0.0647472C12.9342 0.019694 11.6305 -0.0163485 11.2791 0.00767984ZM12.3274 5.29092C12.8501 5.41706 13.2676 5.79551 13.4478 6.32113L13.5169 6.52237V11.9888C13.5169 17.251 13.5139 17.4613 13.4598 17.6205C13.2315 18.2903 12.6638 18.7108 11.985 18.7138C11.4053 18.7138 10.8946 18.4044 10.6183 17.8878C10.429 17.5304 10.438 17.8577 10.438 12.0008C10.438 8.51372 10.4501 6.60947 10.4681 6.50435C10.5191 6.23103 10.6874 5.92466 10.8976 5.71141C11.2851 5.32396 11.8108 5.17077 12.3274 5.29092ZM17.566 7.63368C17.8363 7.70276 18.0345 7.8199 18.2508 8.03616C18.4611 8.2464 18.5692 8.42361 18.6593 8.71496C18.7104 8.88316 18.7134 9.04535 18.7134 11.0878C18.7134 13.1302 18.7104 13.2924 18.6593 13.4606C18.5722 13.7399 18.4641 13.9231 18.2718 14.1243C17.9715 14.4367 17.62 14.5869 17.1815 14.5869C16.8931 14.5869 16.6949 14.5388 16.4516 14.4067C16.2353 14.2925 15.9439 13.9982 15.8358 13.7909C15.6586 13.4395 15.6646 13.5146 15.6646 11.0848C15.6646 8.94623 15.6676 8.85012 15.7247 8.6639C15.8748 8.17132 16.2924 7.76584 16.785 7.63368C16.9922 7.57962 17.3527 7.57661 17.566 7.63368ZM7.17297 13.3104C7.72265 13.4546 8.17322 13.9261 8.29036 14.4878C8.32641 14.647 8.33542 14.9834 8.33542 16.0166C8.33542 17.248 8.33242 17.3562 8.27534 17.5784C8.1582 18.035 7.88185 18.3714 7.44931 18.5846C7.20901 18.7047 7.16696 18.7138 6.90263 18.7258C6.73442 18.7348 6.54218 18.7228 6.44606 18.7017C5.86033 18.5726 5.36471 18.032 5.27159 17.4192C5.25056 17.2811 5.24155 16.7344 5.24756 15.8574L5.25657 14.5118L5.33467 14.3106C5.4398 14.0402 5.57497 13.836 5.77021 13.6558C5.94143 13.5026 6.22678 13.3464 6.43104 13.2984C6.61427 13.2563 6.98673 13.2623 7.17297 13.3104Z"
                              fill="white"
                            />
                          </svg>
                          <span className="ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase">
                            S.Trade Price Predict
                          </span>
                        </Link>
                      </div>
                      <div>
                        <button
                          suppressHydrationWarning={true}
                          aria-label="Close Menu"
                          title="Close Menu"
                          className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg
                            className="w-5 text-gray-600"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <nav>
                      <ul className="space-y-4">
                        <li>
                          <h1
                            title="Trading Chart"
                            className="font-medium tracking-wide text-gray-100"
                          >
                            Trading Chart
                          </h1>
                        </li>
                        <li>
                          <Link
                            suppressHydrationWarning={true}
                            href="/trading-chart-gold"
                            aria-label="Trading Chart Gold"
                            title="Trading Chart Gold"
                            className="font-normal ml-6 tracking-wide text-gray-200 transition-colors duration-200 hover:text-gray-400"
                          >
                            Gold
                          </Link>
                        </li>
                        <li>
                          <Link
                            suppressHydrationWarning={true}
                            href="/trading-chart-platinum"
                            aria-label="Trading Chart Platinum"
                            title="Trading Chart Platinum"
                            className="font-normal ml-6 tracking-wide text-gray-200 transition-colors duration-200 hover:text-gray-400"
                          >
                            Platinum
                          </Link>
                        </li>
                        <li>
                          <Link
                            suppressHydrationWarning={true}
                            href="/trading-chart-silver"
                            aria-label="Trading Chart Silver"
                            title="Trading Chart Silver"
                            className="font-normal ml-6 tracking-wide text-gray-200 transition-colors duration-200 hover:text-gray-400"
                          >
                            Silver
                          </Link>
                        </li>
                        <li>
                          <h1
                            title="Single Day"
                            className="font-medium tracking-wide text-gray-100"
                          >
                            Single Day
                          </h1>
                        </li>
                        <li>
                          <Link
                            suppressHydrationWarning={true}
                            href="/single-day-gold"
                            aria-label="Single Day Gold"
                            title="Single Day Gold"
                            className="font-medium ml-6 tracking-wide text-gray-100 transition-colors duration-200 hover:text-gray-400"
                          >
                            Gold
                          </Link>
                        </li>
                        <li>
                          <Link
                            suppressHydrationWarning={true}
                            href="/single-day-platinum"
                            aria-label="Single Day Platinum"
                            title="Single Day Platinum"
                            className="font-normal ml-6 tracking-wide text-gray-200 transition-colors duration-200 hover:text-gray-400"
                          >
                            Platinum
                          </Link>
                        </li>
                        <li>
                          <Link
                            suppressHydrationWarning={true}
                            href="/single-day-silver"
                            aria-label="Single Day Silver"
                            title="Single Day Silver"
                            className="font-normal ml-6 tracking-wide text-gray-200 transition-colors duration-200 hover:text-gray-400"
                          >
                            Silver
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
