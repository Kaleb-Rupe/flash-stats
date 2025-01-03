"use client";

import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { useState, useRef, useEffect } from "react";
import Modal from "@/app/components/Modal";
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
  const [isByDateTime, setIsByDateTime] = useState(false); // Toggle state
  const [selectedPeriod, setSelectedPeriod] = useState("Last 1hr"); // Default period

  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    if (isByDateTime) {
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
        onDateChange(startDateTime.toSeconds(), endDateTime.toSeconds());
        setIsOpen(false);
      } else {
        setError("Please select both dates and times.");
      }
    } else {
      // Handle time period selection
      const now = DateTime.utc();
      let startPeriod: DateTime;
      let endPeriod: DateTime = now;

      switch (selectedPeriod) {
        case "Last 1hr":
          startPeriod = now.minus({ hours: 1 });
          endPeriod = now;
          break;
        case "Last 12 Hrs":
          startPeriod = now.minus({ hours: 12 });
          endPeriod = now;
          break;
        case "Today":
          startPeriod = now.minus({ days: 1 });
          endPeriod = now;
          break;
        case "Yesterday":
          startPeriod = now.minus({ days: 1 });
          endPeriod = now;
          break;
        case "This Week":
          startPeriod = now.minus({ days: 7 });
          endPeriod = now;
          break;
        case "This Month":
          startPeriod = now.minus({ days: 30 });
          endPeriod = now;
          break;
        case "This Year":
          startPeriod = now.minus({ days: 365 });
          endPeriod = now;
          break;
        default:
          return;
      }

      setError(null);
      onDateChange(startPeriod.toSeconds(), endPeriod.toSeconds());
      setIsOpen(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="z-50">
      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg bg-[#131a2b] transition duration-300"
      >
        Filter by Dates
      </button>

      <Modal ref={modalRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Select Date and Time Range (UTC+00)
        </h2>

        <div className="flex flex-col gap-4 items-center justify-center">
          {/* Toggle between By Time Period and By Date/Time */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setIsByDateTime(false)}
              className={`py-2 px-4 rounded-lg ${
                !isByDateTime ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              By Time Period
            </button>
            <button
              onClick={() => setIsByDateTime(true)}
              className={`py-2 px-4 rounded-lg ${
                isByDateTime ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              By Date/Time
            </button>
          </div>

          {isByDateTime ? (
            <>
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
                />
                {endTime && endDate && (
                  <div className="text-white mt-2">
                    Selected End Time (UTC): {formatDateTime(endDate, endTime)}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Time Period Selection
            <div className="w-full text-center">
              <label className="block text-xl font-medium text-white mb-2">
                Select Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="mt-2 block w-full h-12 rounded-md border-blue-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg bg-white text-blue-800 text-center"
              >
                <option value="Last 1hr">Last 1hr</option>
                <option value="Last 12 Hrs">Last 12 Hrs</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-red-500 text-center">{error}</div>}

          {/* Submit Button */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Get Trading History
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
