import { useState, useCallback } from "react";

interface UseDateRangeResult {
  startTime: number | null;
  endTime: number | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleDateChange: (start: number, end: number) => void;
}

export function useDateRange(
  onDateChange?: (start: number | null, end: number | null) => void
): UseDateRangeResult {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleDateChange = useCallback(
    (start: number, end: number) => {
      setStartTime(start);
      setEndTime(end);
      if (onDateChange) {
        onDateChange(start, end);
      }
    },
    [onDateChange]
  );

  return {
    startTime,
    endTime,
    isModalOpen,
    openModal,
    closeModal,
    handleDateChange,
  };
}
