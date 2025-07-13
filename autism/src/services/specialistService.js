import { createServiceApiUrl } from "./apiUrl";


export const specialistService = {
  createService: async (serviceData) => {
    try {
      const response = await fetch(`${createServiceApiUrl}/service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service');
      }

      return await response.json();
    } catch (error) {
      throw error.message || 'An error occurred while creating the service';
    }
  },

  // Add other specialist-related API calls here
  // For example:
  // getServices: async () => { ... },
  // updateService: async (id, data) => { ... },
  // deleteService: async (id) => { ... },
};
