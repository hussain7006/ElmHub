import { colors, themeColors } from "../../config/colors";
import useAuthStore from "../../store/authStore";

export default function PageTitle({ title, subTitle }) {
    const { theme } = useAuthStore();
    return (
        <>
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${subTitle ? "mb-2" : "mb-2"}`}>
                <h1 className="text-2xl sm:text-3xl font-bold"
                    style={{ color: themeColors[theme].primary }}
                >
                    {title}
                </h1>
            </div>
            {
                subTitle && (
                    <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-6 ${theme === "dark" ? "text-white" : colors.text.light}`}>
                        {subTitle}
                    </h3>
                )
            }

        </>
    );
}



