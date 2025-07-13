import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
function DateSelector({
  dateType,
  historyDate,
  enabledDates,
  setEnabledDates,
  cameraIndex,
  handleDataSelectorChange,
  helperBackend,
}) {
  const [resetValue, setResetValue] = useState(dayjs(historyDate[dateType]));
  // Arabic localization for DatePicker
  const arabicLocaleText = {
    cancelButtonLabel: "إلغاء",
    clearButtonLabel: "مسح",
    okButtonLabel: "موافق",
    todayButtonLabel: "اليوم",
    start: "البداية",
    end: "النهاية",
    previousMonth: "الشهر السابق",
    nextMonth: "الشهر القادم",
    openPreviousView: "عرض سابق",
    openNextView: "عرض قادم",
    calendarViewSwitchingButtonAriaLabel: (currentView) =>
      currentView === 'year'
        ? "عرض تقويم السنة"
        : "عرض تقويم الشهر",
    inputModeToggleButtonAriaLabel: (isKeyboardInputOpen) =>
      isKeyboardInputOpen
        ? "التبديل إلى إدخال التقويم"
        : "التبديل إلى إدخال لوحة المفاتيح",
    clockLabelText: (view, time, adapter) =>
      `اختيار ${view}. ${time === null ? 'لا وقت محدد' : `الوقت المختار هو ${adapter.format(time, 'fullTime')}`}`,
    yearSelectionError: "لا يمكن تحديد هذا العام",
    switchToMonthView: "التبديل إلى عرض الشهر",
    switchToYearView: "التبديل إلى عرض السنة",
  };
  const getDatesForAvailableData = async () => {
    try {
      const fetchRequest = fetch(`${helperBackend}/stream/get_dates`);
      const response = await Promise.race([fetchRequest]);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEnabledDates(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDatesForAvailableData();
  }, []);

  const shouldDisableDate = (date) => {
    return !enabledDates.includes(date.format("DD-MM-YYYY"));
  };

  const handleReset = () => {
    setResetValue(dayjs(historyDate[dateType])); // Reset to default value
    // getDatesForAvailableData(); // Re-fetch the enabled dates
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}
    // adapterLocale={'ar'}
    // localeText={arabicLocaleText}
    >
      <DemoContainer
        components={["DatePicker", "MobileDatePicker", "DesktopDatePicker", "StaticDatePicker"]}
      >
        <DatePicker
          defaultValue={dayjs(historyDate.startDate)}
          value={resetValue}
          onChange={(newValue) => {
            handleDataSelectorChange(newValue);
            setResetValue(newValue); // Keep the state in sync with the selected value
          }}
          shouldDisableDate={shouldDisableDate}
          disableFuture={true}
          onOpen={handleReset}
        />
      </DemoContainer>
    </LocalizationProvider >
  );
}

export default DateSelector;
