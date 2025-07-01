# Platform Navigation System

This document explains how the Platform navigation system works and how to extend it for future features.

## Overview

The Platform navigation system is designed to be scalable and configurable. It allows you to:
- Add new navigation items without modifying component code
- Enable/disable features easily
- Handle different actions for different navigation items
- Maintain a clean separation of concerns

## Architecture

### 1. Configuration (`platformNavigation.js`)
- Defines all navigation items and their properties
- Controls which items are enabled/disabled
- Maps items to specific actions

### 2. State Management (`applicationHubStore.js`)
- Centralized state management for application hub
- Handles navigation actions
- Manages iframe states and application launches

### 3. UI Components (`DelosTopNav.jsx`)
- Renders the navigation dropdown
- Handles user interactions
- Uses configuration to determine behavior

## How to Add a New Navigation Item

### Step 1: Update Configuration
In `src/Constants/platformNavigation.js`, add your new item to the appropriate column:

```javascript
{
  name: "YourNewFeature",
  action: "navigateToYourNewFeature",
  description: "Description of your feature",
  enabled: true // Set to false to disable
}
```

### Step 2: Add Action Handler
In `src/store/applicationHubStore.js`, add a new navigation action:

```javascript
navigateToYourNewFeature: () => {
  set({
    activeTab: 'your-new-tab',
    showIframe: false,
    activeApp: null,
    isLoading: false,
    error: null,
    launchingApp: null
  });
},
```

### Step 3: Update Switch Statement
In `src/Components/App/Layout/TopNav/DelosTopNav.jsx`, add your case:

```javascript
case "navigateToYourNewFeature":
  navigateToYourNewFeature();
  break;
```

## How to Enable/Disable Features

Simply change the `enabled` property in the configuration:

```javascript
{
  name: "Assistant",
  action: "navigateToAssistant",
  description: "AI Assistant tools",
  enabled: false // Change to true to enable
}
```

## Current Features

### Enabled Features
- **Applications**: Navigates to the Applications tab in ApplicationHub

### Disabled Features (Ready for Future Implementation)
- Assistant
- Explore
- Scribe
- Docs
- Recap
- Trad
- Actu
- Extension
- Companion
- Organizations
- Teams

## Benefits of This System

1. **Scalability**: Easy to add new features without touching component code
2. **Maintainability**: All configuration is centralized
3. **Flexibility**: Features can be enabled/disabled without code changes
4. **Consistency**: All navigation items follow the same pattern
5. **Future-Proof**: Ready for new features and requirements

## Best Practices

1. Always add new items to the configuration first
2. Use descriptive action names
3. Keep disabled items in the configuration for future use
4. Add proper error handling for unimplemented features
5. Document new features in this README

## Troubleshooting

### Item Not Appearing
- Check if the item is enabled in the configuration
- Verify the item is in the correct column

### Action Not Working
- Ensure the action is defined in the store
- Check if the case is added to the switch statement
- Verify the action name matches between config and handler

### Styling Issues
- Check if the item has the correct CSS classes
- Verify disabled items have proper styling 