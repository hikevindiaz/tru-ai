"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/Divider";

export default function CalendarPage() {
  // State to control dropdown visibility
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="relative bg-stone-50">
      {/* Background decoration elements */}
      <div className="bg-sky-400 w-full sm:w-40 h-40 rounded-full absolute top-1 opacity-20 max-sm:right-0 sm:left-56 z-0" />
      <div className="bg-emerald-500 w-full sm:w-40 h-24 absolute top-0 left-0 opacity-20 z-0" />
      <div className="bg-purple-600 w-full sm:w-40 h-24 absolute top-40 left-0 opacity-20 z-0" />

      <div className="w-full py-24 relative z-10 backdrop-blur-3xl">
        <div className="w-full max-w-7xl mx-auto px-2 lg:px-8">
          <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">
            {/* Left Section: Upcoming Events */}
            <div className="col-span-12 xl:col-span-5">
              <h2 className="font-manrope text-3xl leading-tight text-gray-900 mb-1.5">
                Upcoming Events
              </h2>
              <p className="text-lg font-normal text-gray-600 mb-8">
                Don't miss schedule
              </p>
              <div className="flex flex-col gap-5">
                {/* Event Card 1 */}
                <div className="p-6 rounded-xl bg-white shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <p className="text-base font-medium text-gray-900">
                        Jan 10, 2020 - 10:00 - 11:00
                      </p>
                    </div>
                    <div className="relative inline-flex">
                      <button
                        type="button"
                        onClick={() => toggleDropdown("dropdown-default")}
                        className="inline-flex justify-center py-2.5 px-1 items-center gap-2 text-sm text-black rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:text-purple-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="4"
                          viewBox="0 0 12 4"
                          fill="none"
                        >
                          <path
                            d="M1.85624 2.00085H1.81458M6.0343 2.00085H5.99263M10.2124 2.00085H10.1707"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      {openDropdown["dropdown-default"] && (
                        <div className="dropdown-menu rounded-xl shadow-lg bg-white absolute top-full -left-10 w-max mt-2">
                          <ul className="py-2">
                            <li>
                              <a
                                className="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                href="javascript:void(0);"
                              >
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                href="javascript:void(0);"
                              >
                                Remove
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <h6 className="text-xl leading-8 font-semibold text-black mb-1">
                    Meeting with friends
                  </h6>
                  <p className="text-base font-normal text-gray-600">
                    Meet-Up for Travel Destination Discussion
                  </p>
                </div>
                {/* Event Card 2 */}
                <div className="p-6 rounded-xl bg-white shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      <p className="text-base font-medium text-gray-900">
                        Jan 10, 2020 - 05:40 - 13:00
                      </p>
                    </div>
                    <div className="relative inline-flex">
                      <button
                        type="button"
                        onClick={() => toggleDropdown("dropdown-a")}
                        className="inline-flex justify-center py-2.5 px-1 items-center gap-2 text-sm text-black rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:text-sky-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="4"
                          viewBox="0 0 12 4"
                          fill="none"
                        >
                          <path
                            d="M1.85624 2.00085H1.81458M6.0343 2.00085H5.99263M10.2124 2.00085H10.1707"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      {openDropdown["dropdown-a"] && (
                        <div className="dropdown-menu rounded-xl shadow-lg bg-white absolute -left-10 top-full w-max mt-2">
                          <ul className="py-2">
                            <li>
                              <a
                                className="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                href="javascript:void(0);"
                              >
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                href="javascript:void(0);"
                              >
                                Remove
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <h6 className="text-xl leading-8 font-semibold text-black mb-1">
                    Visiting online course
                  </h6>
                  <p className="text-base font-normal text-gray-600">
                    Checks updates for design course
                  </p>
                </div>
                {/* Event Card 3 */}
                <div className="p-6 rounded-xl bg-white shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <p className="text-base font-medium text-gray-900">
                        Jan 14, 2020 10:00 - 11:00
                      </p>
                    </div>
                    <div className="relative inline-flex">
                      <button
                        type="button"
                        onClick={() => toggleDropdown("dropdown-b")}
                        className="inline-flex justify-center py-2.5 px-1 items-center gap-2 text-sm text-black rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:text-emerald-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="4"
                          viewBox="0 0 12 4"
                          fill="none"
                        >
                          <path
                            d="M1.85624 2.00085H1.81458M6.0343 2.00085H5.99263M10.2124 2.00085H10.1707"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      {openDropdown["dropdown-b"] && (
                        <div className="dropdown-menu rounded-xl shadow-lg bg-white absolute -left-10 top-full w-max mt-2">
                          <ul className="py-2">
                            <li>
                              <a
                                className="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                href="javascript:void(0);"
                              >
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="block px-6 py-2 text-xs hover:bg-gray-100 text-gray-600 font-medium"
                                href="javascript:void(0);"
                              >
                                Remove
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <h6 className="text-xl leading-8 font-semibold text-black mb-1">
                    Development meet
                  </h6>
                  <p className="text-base font-normal text-gray-600">
                    Discussion with developer for upcoming project
                  </p>
                </div>
              </div>
              {/* Right Section: Calendar */}
              <div className="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-gradient-to-b from-white/25 to-white xl:bg-white rounded-2xl max-xl:row-start-1">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <h5 className="text-xl leading-8 font-semibold text-gray-900">
                      January 2024
                    </h5>
                    <div className="flex items-center">
                      <button className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M6.00236 3.99707L10.0025 7.99723L6 11.9998"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center rounded-md p-1 bg-indigo-50 gap-px">
                    <button className="py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                      Day
                    </button>
                    <button className="py-2.5 px-5 rounded-lg bg-indigo-600 text-white text-sm font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                      Week
                    </button>
                    <button className="py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                      Month
                    </button>
                  </div>
                </div>
                <div className="border border-indigo-200 rounded-xl">
                  <div className="grid grid-cols-7 rounded-t-3xl border-b border-indigo-200">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="py-3.5 border-r border-indigo-200 bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600"
                      >
                        {day}
                      </div>
                    ))}
                    <div className="py-3.5 rounded-tr-xl bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600">
                      Sat
                    </div>
                  </div>
                  <div className="grid grid-cols-7 rounded-b-xl">
                    {/* Render 31 day cells; adjust as needed */}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      // Simple logic: days 1-26 as current month (white cell), 27-31 as out-of-month (gray)
                      const isCurrentMonth = day <= 26;
                      return (
                        <div
                          key={day}
                          className={`flex xl:aspect-square max-xl:min-h-[60px] p-3.5 transition-all duration-300 hover:bg-indigo-50 cursor-pointer border-b border-indigo-200 ${
                            isCurrentMonth ? "bg-white text-gray-900" : "bg-gray-50 text-gray-400"
                          } ${day === 31 ? "rounded-bl-xl" : ""}`}
                        >
                          <span className="text-xs font-semibold">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* End Calendar Section */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
