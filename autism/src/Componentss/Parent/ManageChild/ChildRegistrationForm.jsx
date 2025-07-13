import { colors, themeColors } from "../../../config/colors";
import useAuthStore from "../../../store/authStore";
import useChildProfileStore from "../../../store/childProfileStore";
import Button from "../../_component/Button";

export default function ChildRegistrationForm({ handleSubmit, isLoading }) {
    const { theme, showHeader } = useAuthStore();
    const {
        formData,
        updateFormData,
    } = useChildProfileStore();
    const fields = [
        { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter username' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
        { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
        { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
        { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter child\'s age' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number' },
        { name: 'language', label: 'Language', type: 'select', options: ['English', 'Spanish', 'French', 'Arabic'] },
        { name: 'diagnosis', label: 'Diagnosis', type: 'textarea', placeholder: 'Enter diagnosis details' },
        { name: 'interests', label: 'Special Interests', type: 'textarea', placeholder: 'Enter child\'s special interests' },
    ];

    return (
        <form onSubmit={handleSubmit} className={`overflow-y-auto ${showHeader ? 'max-h-[calc(100vh-180px)]' : 'max-h-[calc(100vh-100px)]'} space-y-8 bg-white dark:bg-gray-800 p-6 m-2 rounded-xl`}>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                    <div
                        key={field.name}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                    >
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: themeColors[theme].text }}
                        >
                            {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                value={formData.basicInfo[field.name] || ''}
                                onChange={(e) =>
                                    updateFormData('basicInfo', {
                                        [field.name]: e.target.value,
                                    })
                                }
                                placeholder={field.placeholder}
                                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                                rows={3}
                                style={{
                                    borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                                    background: theme === 'dark' ? colors.gray[800] : colors.gray[50],
                                    color: theme === 'dark' ? colors.gray[100] : colors.gray[900],
                                }}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                value={formData.basicInfo[field.name] || ''}
                                onChange={(e) =>
                                    updateFormData('basicInfo', {
                                        [field.name]: e.target.value,
                                    })
                                }
                                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                                style={{
                                    borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                                    background: theme === 'dark' ? colors.gray[800] : colors.gray[50],
                                    color: theme === 'dark' ? colors.gray[100] : colors.gray[900],
                                }}
                            >
                                <option value="" className="text-gray-400 dark:text-gray-500">Select {field.label}</option>
                                {field.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                value={formData.basicInfo[field.name] || ''}
                                onChange={(e) =>
                                    updateFormData('basicInfo', {
                                        [field.name]: e.target.value,
                                    })
                                }
                                placeholder={field.placeholder}
                                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                                style={{
                                    borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                                    background: theme === 'dark' ? colors.gray[800] : colors.gray[50],
                                    color: theme === 'dark' ? colors.gray[100] : colors.gray[900],
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Child'}
                </Button>
            </div>
        </form>
    )
}
