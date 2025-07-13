import i18next from "i18next";

export const formatNumberForLocale = (number) => {
    const currentLocale = i18next.language;
    if (currentLocale === 'ar') {
        // Format as Arabic numbers
        return new Intl.NumberFormat('ar-EG').format(number);
    }
    // For other locales, use default Western numbering
    return new Intl.NumberFormat(currentLocale).format(number);
};

export const formatTimeForLocale = (time) => {
    const currentLocale = i18next.language;

    // Format the time components (hours, minutes, seconds)
    // const hours = formatNumberForLocale(time.getHours());
    // const minutes = formatNumberForLocale(time.getMinutes());
    // const seconds = formatNumberForLocale(time.getSeconds());
    const hours = formatNumberForLocale(time.getHours()).padStart(2, '0');
    const minutes = formatNumberForLocale(time.getMinutes()).padStart(2, '0');
    const seconds = formatNumberForLocale(time.getSeconds()).padStart(2, '0');

    // if (currentLocale === 'ar') {
    //     // Reverse the order for Arabic (RTL)
    //     return `${seconds}:${minutes}:${hours}`;
    // }

    // Default order for LTR languages
    return `${hours}:${minutes}:${seconds}`;
};


export const convertTimestampToDatetime = (timestamp) => {
    // ٹائم اسٹیمپ کو مِلّی سیکنڈز میں تبدیل کریں
    const date = new Date(timestamp * 1000);

    // فارمیٹ شدہ تاریخ اور وقت حاصل کریں
    const formattedDate = date.toLocaleString();

    return formattedDate;
}