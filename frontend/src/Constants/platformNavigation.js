// Platform navigation configuration
// This makes the Platform tab navigation scalable and configurable

export const PLATFORM_NAVIGATION_CONFIG = {
  // Main navigation items in the Platform dropdown
  columns: [
    {
      title: "Applications",
      items: [
        {
          name: "Applications",
          action: "navigateToApplicationTab",
          description: "Access your applications",
          enabled: true
        },
        // {
        //   name: "Assistant",
        //   action: "navigateToAssistant",
        //   description: "AI Assistant tools",
        //   enabled: false // Disabled for future implementation
        // },
        // {
        //   name: "Explore",
        //   action: "navigateToExplore",
        //   description: "Explore new features",
        //   enabled: false // Disabled for future implementation
        // },
        // {
        //   name: "Scribe",
        //   action: "navigateToScribe",
        //   description: "Writing and documentation tools",
        //   enabled: false // Disabled for future implementation
        // },
        // {
        //   name: "Docs",
        //   action: "navigateToDocs",
        //   description: "Document management",
        //   enabled: false // Disabled for future implementation
        // },
        // {
        //   name: "Recap",
        //   action: "navigateToRecap",
        //   description: "Meeting notes and summaries",
        //   enabled: false // Disabled for future implementation
        // },
        // {
        //   name: "Trad",
        //   action: "navigateToTrad",
        //   description: "Translation services",
        //   enabled: false // Disabled for future implementation
        // },
        // {
        //   name: "Actu",
        //   action: "navigateToActu",
        //   description: "Automated newsletters",
        //   enabled: false // Disabled for future implementation
        // }
      ]
    },
    // {
    //   title: "Extension",
    //   items: [
    //     {
    //       name: "Extension",
    //       action: "navigateToExtension",
    //       description: "Browser extensions",
    //       enabled: false // Disabled for future implementation
    //     },
    //     {
    //       name: "Companion",
    //       action: "navigateToCompanion",
    //       description: "Delos companion app",
    //       enabled: false // Disabled for future implementation
    //     }
    //   ]
    // },
    // {
    //   title: "COLLABORATION",
    //   items: [
    //     {
    //       name: "Organizations",
    //       action: "navigateToOrganizations",
    //       description: "Organization management",
    //       enabled: false // Disabled for future implementation
    //     },
    //     {
    //       name: "Teams",
    //       action: "navigateToTeams",
    //       description: "Team collaboration tools",
    //       enabled: false // Disabled for future implementation
    //     }
    //   ]
    // }
  ]
};

// Helper function to get enabled items
export const getEnabledPlatformItems = () => {
  const enabledItems = [];
  
  PLATFORM_NAVIGATION_CONFIG.columns.forEach(column => {
    column.items.forEach(item => {
      if (item.enabled) {
        enabledItems.push({
          ...item,
          category: column.title
        });
      }
    });
  });
  
  return enabledItems;
};

// Helper function to get items by category
export const getPlatformItemsByCategory = (category) => {
  const column = PLATFORM_NAVIGATION_CONFIG.columns.find(col => col.title === category);
  return column ? column.items.filter(item => item.enabled) : [];
};

// Helper function to check if an item is enabled
export const isPlatformItemEnabled = (itemName) => {
  for (const column of PLATFORM_NAVIGATION_CONFIG.columns) {
    const item = column.items.find(item => item.name === itemName);
    if (item) {
      return item.enabled;
    }
  }
  return false;
};

// Helper function to get item configuration
export const getPlatformItemConfig = (itemName) => {
  for (const column of PLATFORM_NAVIGATION_CONFIG.columns) {
    const item = column.items.find(item => item.name === itemName);
    if (item) {
      return {
        ...item,
        category: column.title
      };
    }
  }
  return null;
}; 