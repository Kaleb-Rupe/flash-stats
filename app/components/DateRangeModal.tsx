import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateChange: (start: number, end: number) => void;
  position?: "center" | "top" | "bottom";
}

const timeOptions = [
  { label: "Last 1hr", value: "1h" },
  { label: "Last 12 Hrs", value: "12h" },
  { label: "Today", value: "24h" },
  { label: "This Week", value: "7d" },
  { label: "This Month", value: "30d" },
  { label: "This Year", value: "1y" },
  { label: "Custom Range", value: "custom" },
];

export default function DateRangeModal({
  isOpen,
  onClose,
  onDateChange,
  position = "center",
}: DateRangeModalProps) {
  const [rangeType, setRangeType] = useState("1h");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setError(null);
      if (rangeType !== "custom") {
        setStartDate(null);
        setEndDate(null);
        setStartTime(null);
        setEndTime(null);
      }
    }
  }, [isOpen]);

  const handleQuickSelect = (value: string) => {
    setRangeType(value);
    const now = DateTime.utc();
    let startPeriod: DateTime;

    switch (value) {
      case "1h":
        startPeriod = now.minus({ hours: 1 });
        break;
      case "12h":
        startPeriod = now.minus({ hours: 12 });
        break;
      case "24h":
        startPeriod = now.minus({ days: 1 });
        break;
      case "7d":
        startPeriod = now.minus({ days: 7 });
        break;
      case "30d":
        startPeriod = now.minus({ months: 1 });
        break;
      case "1y":
        startPeriod = now.minus({ years: 1 });
        break;
      case "custom":
        return;
      default:
        return;
    }

    onDateChange(startPeriod.toSeconds(), now.toSeconds());
    onClose();
  };

  const handleCustomRange = () => {
    if (!startDate || !endDate || !startTime || !endTime) {
      setError("Please select both start and end date/time");
      return;
    }

    const startDateTime = DateTime.fromJSDate(startDate).set({
      hour: startTime.getHours(),
      minute: startTime.getMinutes(),
      second: 0,
    });

    const endDateTime = DateTime.fromJSDate(endDate).set({
      hour: endTime.getHours(),
      minute: endTime.getMinutes(),
      second: 59,
    });

    if (endDateTime <= startDateTime) {
      setError("End date must be after start date");
      return;
    }

    onDateChange(startDateTime.toSeconds(), endDateTime.toSeconds());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center">
            <Dialog.Overlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md mx-4"
            >
              <Dialog.Title className="text-xl font-bold text-white mb-6">
                Select Date Range
              </Dialog.Title>

              <div className="space-y-6">
                {/* Quick Select Options */}
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuickSelect(option.value)}
                      className={`
                        p-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          rangeType === option.value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Range Picker */}
                {rangeType === "custom" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Start Date
                        </label>
                        <DatePicker
                          selected={startDate}
                          onChange={setStartDate}
                          className="w-full p-2 bg-gray-800 rounded-lg text-white"
                          dateFormat="yyyy/MM/dd"
                        />
                        <DatePicker
                          selected={startTime}
                          onChange={setStartTime}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm"
                          dateFormat="HH:mm"
                          className="w-full mt-2 p-2 bg-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          End Date
                        </label>
                        <DatePicker
                          selected={endDate}
                          onChange={setEndDate}
                          className="w-full p-2 bg-gray-800 rounded-lg text-white"
                          dateFormat="yyyy/MM/dd"
                        />
                        <DatePicker
                          selected={endTime}
                          onChange={setEndTime}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm"
                          dateFormat="HH:mm"
                          className="w-full mt-2 p-2 bg-gray-800 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                      onClick={handleCustomRange}
                      className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Apply Custom Range
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
