import { useState } from "react";
import { motion } from "framer-motion";
import { colors, themeColors } from "../../config/colors";
import useAuthStore from "../../store/authStore";
import {
  getActivitesList,
  createActivity,
  createService,
  getServicesList,
} from "../../services/specialist/services";
import SuccessModal from "../../components/modals/SuccessModal";
import useSWR, { useSWRConfig } from "swr";
import PageTitle from "../../Componentss/_component/PageTitle";
import ErrorBox from "../../Componentss/_component/ErrorBox";
import ServicesList from "../../Componentss/Specialist/CreateService/ServicesList";
import CreateService from "../../Componentss/Specialist/CreateService/CreateService";
const CreateServicePage = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { theme } = useAuthStore();

  return (
    <>

      <PageTitle title="Services Overview" />

      <div
        className="mb-8 border-b overflow-x-auto scrollbar-hide"
        style={
          theme === "light"
            ? { borderColor: colors.gray[200] }
            : { borderColor: colors.gray[800] }
        }
      >
        <div className="flex space-x-1 md:space-x-4 min-w-max">
          {[
            {
              id: "services",
              label: "Services",
              icon: (
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/officel/24/List-of-parts.png"
                  alt="List-of-parts"
                />
              ),
            },
            {
              id: "create_Service",
              label: "Create",
              icon: (
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/fluency/24/add-item.png"
                  alt="add-item"
                />
              ),
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 flex items-center space-x-2 font-medium relative transition-colors duration-200 cursor-pointer
                        ${activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {activeTab == "services" && <ServicesList />}

      {activeTab !== "services" && <CreateService />}
    </>
  );
};

export default CreateServicePage;

// const ServicesList = () => {
//   const { theme, user } = useAuthStore();
//   const { data: services, isLoading: isLoading } = useSWR(
//     "getServicesList",
//     getServicesList,
//     {
//       dedupingInterval: 60000,
//       revalidateIfStale: true,
//       keepPreviousData: true,
//     }
//   );
//   return (
//     <div className="overflow-y-auto max-h-[calc(100vh-240px)] px-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {isLoading && (
//         <div className="w-full h-20 flex items-center justify-center">
//           <img src="/loading_gif.gif" />
//         </div>
//       )}
//       {!isLoading &&
//         services &&
//         services.map((service) => (
//           <motion.div
//             key={service.service_id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 w-100"
//             style={
//               theme === "light"
//                 ? {
//                   border: `1px solid ${colors.gray[200]}`,
//                 }
//                 : {
//                   border: `1px solid ${colors.gray[700]}`,
//                 }
//             }
//           >
//             <div className="p-5">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3
//                     className="text-lg font-semibold mb-1"
//                     style={
//                       theme === "light" ? { color: colors.primary.DEFAULT } : {}
//                     }
//                   >
//                     {service.title}
//                   </h3>
//                 </div>
//               </div>

//               <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
//                 {service.description}
//               </p>

//               <div
//                 className="flex items-center justify-between mt-4 pt-4 border-t"
//                 style={
//                   theme === "light"
//                     ? { borderColor: colors.gray[200] }
//                     : { borderColor: colors.gray[700] }
//                 }
//               >
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-500 dark:text-gray-400">
//                     Default Activities: {service.activities?.length || 0}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center flex-wrap gap-2 mt-2">
//                 {service.activities &&
//                   service.activities.length > 0 &&
//                   service.activities.map((avt) => (
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === "upcoming"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : service.status === "ongoing"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                         }`}
//                     >
//                       {avt.title}
//                     </span>
//                   ))}
//               </div>
//             </div>
//           </motion.div>
//         ))}
//     </div>
//   );
// };
// const CreateServices = () => {
//   const { theme, user } = useAuthStore();
//   const { mutate } = useSWRConfig();
//   const {
//     data: activities,
//     isLoading: isDataLoading,
//     mutate: mutateActivity,
//   } = useSWR("activitiesLst", getActivitesList, {
//     dedupingInterval: 60000,
//     revalidateIfStale: true,
//     keepPreviousData: true,
//   });
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     activity: [],
//   });
//   const [isAddNewActivity, setIsAddNewActivity] = useState(false);

//   const [activityData, setActivityData] = useState({
//     title: "",
//     description: "",
//   });
//   const [activityErrors, setActivityErrors] = useState(null);
//   const [isActivitySubmitting, setIsActivitySubmitting] = useState(false);

//   const handleActivitySubmit = async (e) => {
//     setActivityErrors(null);
//     setIsActivitySubmitting(true);
//     try {
//       if (activityData.title == "" || activityData.description == "") {
//         throw new Error("Title or description cannot be empty");
//       }
//       await createActivity(activityData);
//       mutateActivity();
//       setActivityData({
//         title: "",
//         description: "",
//       });
//       setIsAddNewActivity(false);
//     } catch (err) {
//       setActivityErrors(
//         err.message || "Failed to create service. Please try again."
//       );
//     } finally {
//       setIsActivitySubmitting(false);
//     }
//   };

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const handleDayToggle = (day) => {
//     setFormData((prev) => ({
//       ...prev,
//       activity: prev.activity.includes(day.id)
//         ? prev.activity.filter((d) => d !== day.id)
//         : [...prev.activity, day.id],
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       if (formData.title == "" || formData.description == "") {
//         throw new Error("Title or description cannot be empty");
//       }

//       if (formData.activity.length == 0) {
//         throw new Error("Select some activities");
//       }
//       await createService(formData);
//       mutate("getServicesList");
//       setFormData({
//         title: "",
//         description: "",
//         activity: [],
//       });
//       setIsAddNewActivity(false);
//     } catch (err) {
//       setError(err.message || "Failed to create service. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const inputStyles = `w-full p-3 rounded-lg border ${theme === "dark"
//     ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
//     : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
//     }`;

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full mx-auto overflow-y-auto max-h-[calc(100vh-240px)] px-2 "
//       >
//         <div
//           className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
//             }`}
//         >
//           <h1 className="text-2xl font-bold mb-6">Create New Service</h1>

//           {error && (
//             <ErrorBox error={error} />
//           )}

//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium mb-2">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className={inputStyles}
//                 placeholder="Enter service title"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className={inputStyles}
//                 rows="3"
//                 placeholder="Enter service description"
//                 required
//               />
//             </div>
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="space-y-6"
//             >
//               <div>
//                 <div className="flex flex-row items-center gap-2 mb-3">
//                   <label
//                     className="block text-sm font-medium"
//                     style={{
//                       color:
//                         theme === "dark" ? colors.gray[300] : colors.gray[700],
//                     }}
//                   >
//                     Select Default Activities:
//                   </label>
//                   <motion.button
//                     whileHover={{ scale: 1.04 }}
//                     whileTap={{ scale: 0.97 }}
//                     onClick={() => setIsAddNewActivity(true)}
//                     className=" cursor-pointer"
//                     type="button"
//                   >
//                     <img
//                       width="24"
//                       height="24"
//                       src="https://img.icons8.com/20C997/ios-filled/24/add--v1.png"
//                       alt="add--v1"
//                     />
//                   </motion.button>
//                 </div>
//                 {isDataLoading ? (
//                   <div className="w-full h-20 flex items-center justify-center">
//                     <img src="/loading_gif.gif" />
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                     {activities.map((day) => (
//                       <motion.button
//                         key={day.id}
//                         type="button"
//                         onClick={() => handleDayToggle(day)}
//                         className="px-4 py-2 rounded-lg border transition-colors duration-200 cursor-pointer"
//                         style={{
//                           backgroundColor: formData.activity.includes(day.id)
//                             ? colors.primary.DEFAULT
//                             : theme === "dark"
//                               ? colors.gray[700]
//                               : "white",
//                           borderColor: formData.activity.includes(day.id)
//                             ? colors.primary.dark
//                             : colors.gray[300],
//                           color: formData.activity.includes(day.id)
//                             ? "white"
//                             : theme === "dark"
//                               ? colors.gray[300]
//                               : colors.gray[700],
//                         }}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         {day.title}
//                       </motion.button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//             {isAddNewActivity && (
//               <motion.div
//                 initial={{ height: 0 }}
//                 animate={{ height: "max-content" }}
//                 className="w-full lg:w-full"
//               >
//                 <div
//                   className={`p-4 md:p-6 rounded-lg  ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
//                     }`}
//                 >
//                   <div className=" flex flex-row justify-between mb-3">
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium mb-1">
//                         Activity Title
//                       </label>
//                       <input
//                         type="text"
//                         name="activity"
//                         value={activityData.title}
//                         onChange={(e) =>
//                           setActivityData((prev) => ({
//                             ...prev,
//                             title: e.target.value,
//                           }))
//                         }
//                         className={inputStyles}
//                         placeholder="Title for the activity"
//                         required
//                       />
//                     </div>
//                     <div className="flex-2 ms-2">
//                       <label className="block text-sm font-medium mb-1">
//                         Activity Description
//                       </label>
//                       <input
//                         type="text"
//                         name="activity"
//                         value={activityData.description}
//                         onChange={(e) =>
//                           setActivityData((prev) => ({
//                             ...prev,
//                             description: e.target.value,
//                           }))
//                         }
//                         className={inputStyles}
//                         placeholder="Short description of the activity"
//                         required
//                       />
//                     </div>
//                   </div>
//                   {activityErrors && (
//                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//                       {activityErrors}
//                     </div>
//                   )}
//                   <div className="flex flex-row justify-end gap-2">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={handleActivitySubmit}
//                       type="button"
//                       className="mt-4 md:mt-0 px-6 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
//                       style={{
//                         background: true
//                           ? themeColors[theme].primary
//                           : "transparent",
//                         color: true
//                           ? colors.text.light
//                           : themeColors[theme].primary,
//                         border: `2px solid ${themeColors[theme].primary}`,
//                       }}
//                       disabled={isActivitySubmitting}
//                     >
//                       {isActivitySubmitting ? (
//                         <span>Submitting</span>
//                       ) : (
//                         <>
//                           <img
//                             width="24"
//                             height="24"
//                             src="https://img.icons8.com/ffffff/ios/24/add--v1.png"
//                             alt="add--v1"
//                           />
//                           <span>Add Activity</span>
//                         </>
//                       )}
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => setIsAddNewActivity(false)}
//                       type="button"
//                       className="mt-4 md:mt-0 px-6 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
//                       style={{
//                         background: "transparent",
//                         color: themeColors[theme].primary,
//                         border: `2px solid ${themeColors[theme].primary}`,
//                       }}
//                       disabled={isActivitySubmitting}
//                     >
//                       <span>Cancel</span>
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors duration-200 ${isSubmitting
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-blue-700"
//                   }`}
//               >
//                 {isSubmitting ? "Creating..." : "Create Service"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//       <SuccessModal
//         isOpen={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         title="Service Created Successfully!"
//         message="Your new service has been created and is now available for use."
//       />
//     </>
//   );
// };
