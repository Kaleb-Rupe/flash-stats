"use client";

import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

// DateRangePicker Component
export const DateRangePicker = ({
  onDateChange,
}: {
  onDateChange: (start: number, end: number) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatDateTime = (date: Date, time: Date) => {
    if (!date || !time) return "";
    return DateTime.fromJSDate(date)
      .set({
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds(),
      })
      .toUTC()
      .toFormat("yyyy/MM/dd - HH:mm");
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg bg-[#131a2b] transition duration-300"
      >
        Filter by Dates
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50 m-4">
          <div className="relative bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg mx-auto text-white">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Select Date and Time Range (UTC+00)
            </h2>

            <div className="flex flex-col gap-4 items-center justify-center">
              {/* Start Date/Time Section */}
              <div className="w-full text-center">
                <label className="block text-xl font-medium text-white mb-2">
                  Start Date and Time
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="yyyy/MM/dd"
                  className="mt-2 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg bg-white text-blue-800 text-center"
                  placeholderText="Select start date"
                  popperClassName="z-50"
                />
                <DatePicker
                  selected={startTime}
                  onChange={(time: Date | null) => setStartTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  className="mt-2 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg bg-white text-blue-800 text-center"
                  placeholderText="Select start time (UTC)"
                  popperClassName="z-50"
                />
                {startTime && startDate && (
                  <div className="text-white mt-2">
                    Selected Start Time (UTC):{" "}
                    {formatDateTime(startDate, startTime)}
                  </div>
                )}
              </div>

              {/* End Date/Time Section */}
              <div className="w-full text-center">
                <label className="block text-xl font-medium text-white mb-2">
                  End Date and Time
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy/MM/dd"
                  className="mt-2 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg bg-white text-blue-800 text-center"
                  placeholderText="Select end date"
                  popperClassName="z-50"
                />
                <DatePicker
                  selected={endTime}
                  onChange={(time) => setEndTime(time || null)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  className="mt-2 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg bg-white text-blue-800 text-center"
                  placeholderText="Select end time (UTC)"
                  popperClassName="z-50"
                />
                {endTime && endDate && (
                  <div className="text-white mt-2">
                    Selected End Time (UTC): {formatDateTime(endDate, endTime)}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500 text-center">{error}</div>}

              {/* Submit Button */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => {
                    if (startDate && endDate && startTime && endTime) {
                      const startDateTime = DateTime.fromJSDate(startDate)
                        .set({
                          hour: startTime.getHours(),
                          minute: startTime.getMinutes(),
                          second: startTime.getSeconds(),
                        })
                        .toUTC();

                      const endDateTime = DateTime.fromJSDate(endDate)
                        .set({
                          hour: endTime.getHours(),
                          minute: endTime.getMinutes(),
                          second: endTime.getSeconds(),
                        })
                        .toUTC();

                      if (startDateTime >= endDateTime) {
                        setError(
                          "Start date and time should be earlier than end date and time."
                        );
                        return;
                      }

                      setError(null);
                      onDateChange(
                        startDateTime.toSeconds(),
                        endDateTime.toSeconds()
                      );
                      setIsOpen(false);
                    } else {
                      setError("Please select both dates and times.");
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Get Trading History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
