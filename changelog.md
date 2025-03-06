# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Created reusable UserForm component for create and edit operations
- Added role selection dropdown using Shadcn UI Select component
- Improved form validation feedback
- Added TypeScript types for User interface
- User management system with data table implementation
    - Added TanStack React Table integration
    - Implemented search functionality with debouncing
    - Added pagination controls
    - Added Indonesian localization for UI elements
- Database seeding for users
    - Created admin user (admin@example.com)
    - Added 49 dummy users with Indonesian names
    - Implemented UserFactory with Indonesian locale
- User Create and Edit Forms
    - Added form validation using Zod
    - Implemented password hashing
    - Added success messages
    - Added Indonesian form labels and validation messages
    - Optional password field for user updates
- Added Action Buttons to User Management
    - Create new user button with plus icon
    - Edit button for each user row
    - Improved UI/UX with proper button spacing and icons
- User Delete Functionality
    - Added delete confirmation dialog
    - Added delete button with icon
    - Added safety check to prevent self-deletion
    - Added success/error messages
    - Added Indonesian translations for confirmation dialogs
- User role system with Superadmin, Admin, Dosen, and Mahasiswa roles
- Role-based authorization middleware
- Role selection in user creation and editing
- Role validation and filtering
- Toast notifications system with Indonesian language support using Sonner
  - Integrated Sonner toast library
  - Created ToasterProvider component with theme support
  - Added utility functions for showing success, error, warning, and info toasts
  - Integrated toast provider in the root application layout
  - Added FlashMessage component to handle backend flash messages
  - Integrated toast notifications with Inertia.js flash messages
  - Standardized flash message format across all CRUD operations

### Technical

- Added new components:
    - DataTable component with sorting and pagination
    - SearchInput component with debounced search
- Added useDebounce hook for search optimization
- Added form components from shadcn/ui
- Added Zod for form validation
- Added Lucide React icons for action buttons
- Added AlertDialog component from shadcn/ui
- Added delete route handling

### Dependencies

- Added @tanstack/react-table
- Added lucide-react for icons

## [0.0.1] - 2025-02-01

- Initial project setup
