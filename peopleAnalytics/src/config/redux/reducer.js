const INITIAL_STATE = {
    headerHeight: 62,
    isLoggedIn: false,
    arabicFont: "Readex Pro, sans-serif",
    englishFont: "Roboto, sans-serif",
    lang: "en",
    themeMode: "light",
    showHeader: true, // Default to showing header
    colors: {
        primary: "#0070c7",
        accent: "#f16845",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        textPrimary: "#0c1d46",
        textSecondary: "#64748B",
        buttonBackground: "#0070c7",
        inputBackground: "#FFFFFF",
        borderColor: "#D1D5DB",
        placeholderColor: "#9CA3AF"
    },
    theme: {
        mode: "light",
        primaryColor: "#0070c7",
        backgroundColor: "#F9FAFB",
        textColor: "#0c1d46",
        surfaceColor: "#FFFFFF",
        borderColor: "#D1D5DB",
        textSecondaryColor: "#64748B"
    },
    user: {
        id: null,
        isLoggedIn: false,
        username: null,
        email: null,
        mapImage: "",
        isMapUploadModal: false
    },
    isDownloadPdfTriggered: false
};


export default (state = INITIAL_STATE, action) => {

    if (action.type === "MINIMIZEHEADER") {
        return { ...state, headerHeight: action.value }
    }
    else if (action.type === "MAXIMIZEHEADER") {
        return { ...state, headerHeight: action.value }
    }
    else if (action.type === "USERAUTH") {
        return { ...state, user: { ...action.value } }
    }
    else if (action.type === "UPDATEMAPIMAGE") {

        return { ...state, user: { ...state.user, mapImage: action.value } }
    }
    else if (action.type === "DOWNLOADPDFTRIGGERED") {
        return { ...state, isDownloadPdfTriggered: !state.isDownloadPdfTriggered }
    }
    else if (action.type === "SETLANGUAGE") {
        const { lang } = action.payload;
        return { ...state, lang: lang };
    }
    else if (action.type === "SETSHOWHEADER") {
        return { ...state, showHeader: action.payload };
    }
    else if (action.type === "SETTHEME") {
        return { ...state, theme: action.payload };
    }
    else if (action.type === "SETCOLORS") {
        return { ...state, colors: action.payload };
    }
    else if (action.type === "SETTHEMEMODE") {
        return { ...state, themeMode: action.payload };
    }


    return state;
}