# NavalSight - Maritime AI Command Center

## Overview

NavalSight is a web-based maritime AI command center designed for threat detection and image analysis. The application provides a role-based access control system where users can monitor maritime activities, process images, detect threats, and manage AI models. The system supports three user roles (Admin, Operator, Viewer) with different permission levels and features a comprehensive dashboard for real-time monitoring and analytics.

## Recent Changes

**October 15, 2025 - Demo Enhancement & Analytics Expansion**
- ✅ **Sample Image Integration**: Added clickable sample image cards to Upload & Enhancement section (3 maritime images) and Threat Detection section (3 images) for easy demo workflow
- ✅ **Reports Image Display**: Enhanced Reports & Downloads page with side-by-side display of original, enhanced, and detected images with proper styling
- ✅ **Analytics Page Overhaul**: Completely redesigned Analytics page to differentiate from Dashboard:
  - Added comprehensive detection history table with Date/Time, Object Type, Confidence, AUV Coordinates, Depth, UIQM scores, and Status
  - Implemented 6 realistic detection records with proper maritime data (coordinates: 23°N, 58°E region, depths: 8-342m)
  - Added Enhancement Metrics Overview section with averaged PSNR (31.84 dB), SSIM (0.921), UIQM (3.42), and Processing Time (2.3s)
  - Updated chart titles for clarity (Weekly Detection Trend, Object Type Distribution, Confidence Levels by Object Type)
- ✅ **Realistic Metric Values**: Updated UIQM and quality metrics to research-based ranges (PSNR: 29.5-33.5 dB, SSIM: 0.88-0.96, UIQM: 3.1-4.0)
- ✅ **CSS Enhancements**: Added comprehensive styling for detection history tables, analytics sections, metric overview cards, status badges (high/medium/low risk), and responsive table containers
- ✅ **Data Differentiation**: Dashboard focuses on real-time overview (Images Processed, Threats, Active Model, Edge Devices), while Analytics provides deep-dive historical data and metrics analysis

**October 12, 2025 - Advanced Features & UI Enhancement**
- ✅ **Reports & Downloads Page**: Complete report system with side-by-side image comparison (original/enhanced/detected), detailed metrics display (PSNR, SSIM, UIQM), threat analysis, and download options for PDF, Raw Images, JSON Data, and Model Outputs
- ✅ **Alert Configuration System**: Confidence and severity threshold sliders, alert method selection (Email/SMS/In-App), test alert functionality, and auto-save configuration
- ✅ **Enhanced Settings Page**: Model deployment options (Full/Quantized/Docker/TensorRT), comprehensive retention policy (7 days to 1 year), auto-delete controls, security settings (encryption, access logging, 2FA)
- ✅ **Enhanced CSS**: Modern UI with gradients, animations, glassmorphism effects, custom range sliders, download cards, alert configuration styling, and professional transitions
- ✅ **Automatic Report Updates**: Detection results automatically populate report preview with images, metrics, and threat analysis
- ✅ **Model Deployment Tools**: Download buttons for Full/Quantized/TensorRT models, Docker pull command integration, deployment card UI

**October 12, 2025 - Enhanced Features Update**
- ✅ **Image Enhancement Workflow**: Complete 4-step process with sample maritime images, model selection cards, animated processing status, and side-by-side comparison with metrics
- ✅ **Threat Detection Workflow**: Enhanced 3-step detection system with sample images, AI model selection, canvas-based bounding boxes, color-coded severity, and threat analysis table
- ✅ **Stock Images**: Added 7 high-quality maritime images (underwater scenes, naval ships, submarines) for demonstration
- ✅ **Canvas Processing**: Real-time image enhancement with contrast/brightness/saturation adjustments and threat visualization with color-coded bounding boxes
- ✅ **Professional UI**: Step numbers, progress indicators, model cards with accuracy ratings, enhancement badges, and detection legends
- ✅ **Seamless Flow**: Transfer enhanced images directly to threat detection, reset functionality, download options

**October 12, 2025 - Initial Implementation**
- ✅ Created full HTML structure with 11 functional pages (Login, Dashboard, Upload & Enhancement, Threat Detection, Analytics, System Health, Notifications, Model Management, Settings)
- ✅ Implemented comprehensive CSS styling with dark navy/teal theme, responsive design, and smooth animations
- ✅ Built all JavaScript functionality: navigation, role-based access control, real-time clock, Chart.js integration
- ✅ Integrated Chart.js for dashboard and analytics visualizations (line, pie, doughnut, bar charts)
- ✅ Implemented proper role-based authorization with permission guards on all navigation paths
- ✅ Added modal system for user feedback and alerts
- ✅ Server running on port 5000 via Python HTTP server

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- Pure HTML/CSS/JavaScript (Vanilla JS) - No frontend framework
- Font Awesome for icons
- Chart visualization library (implementation pending)

**Design Decisions:**
- Single Page Application (SPA) pattern with client-side navigation
- Role-based UI rendering - menu items and features are conditionally displayed based on user permissions
- Responsive design with sidebar navigation and top navbar
- Dark theme optimized for command center environments

**Component Structure:**
- Login screen with authentication form
- Main application container with navbar and sidebar
- Multiple page modules: Dashboard, Upload, Threat Detection, Analytics, System Health, Notifications, Model Management, Settings
- Modal system for dialogs and detailed views

### Authentication & Authorization

**Access Control Model:**
- Role-based permissions system with three tiers:
  - **Admin**: Full access to all features including settings
  - **Operator**: Access to operational features (no settings)
  - **Viewer**: Read-only access to dashboards and notifications
- Client-side permission checking via `rolePermissions` object
- Page-level access control through `hasAccess()` function

**Security Considerations:**
- Current implementation uses client-side authentication (suitable for prototype)
- Production deployment would require backend authentication service
- Session management handled in browser state

### Data Visualization

**Dashboard Analytics:**
- Real-time metrics display (Total Images Processed, Threats Detected, Active Model status, Edge Devices Online)
- Time-series line chart for 7-day image processing trends
- Pie chart for threat type distribution
- System health monitoring with status indicators

**Chart Library Integration:**
- Charts object structure prepared for library initialization
- Supports dynamic data updates for real-time monitoring

### State Management

**Client-Side State:**
- `currentUser` object stores active user session and role
- `charts` object maintains references to visualization instances
- DOM-based state for UI interactions (sidebar toggle, modal display)

**Data Flow:**
- Event-driven architecture using native DOM events
- Page navigation managed through `navigateToPage()` function
- Form submissions handled with preventDefault pattern

### UI/UX Patterns

**Navigation:**
- Collapsible sidebar with hamburger menu toggle
- Active page highlighting in navigation
- Responsive layout adapting to screen sizes

**Theme System:**
- CSS custom properties for consistent theming
- Dark color scheme optimized for prolonged use
- Maritime/military aesthetic with blue/teal accent colors

**User Feedback:**
- Real-time clock display in navbar
- Notification system with bell icon
- Status indicators using color coding (success: green, warning: yellow, danger: red, info: blue)

## External Dependencies

### Frontend Libraries

**Font Awesome 6.4.0** (CDN)
- Purpose: Icon library for UI elements
- Usage: Navigation icons, status indicators, user interface controls
- Integration: CDN link in HTML head

**Chart.js 4.x** (CDN - Integrated)
- Purpose: Data visualization for dashboard and analytics
- Implementation: Line charts, pie charts, doughnut charts, bar charts
- Features: Real-time updates, responsive design, dark theme compatible
- Usage: Dashboard metrics, analytics trends, threat distribution visualization

### Planned Integrations

**Backend API** (Not yet implemented)
- Authentication service for user login
- Image processing and enhancement endpoints
- Threat detection model API
- Analytics data aggregation
- Model management and deployment
- System health monitoring
- Notification service

**AI/ML Services** (Architecture prepared)
- Image enhancement models (Full and Quantized versions)
- Threat detection algorithms
- Edge device model deployment
- Real-time inference capabilities

**Database Requirements** (To be implemented)
- User authentication and role management
- Image metadata and processing history
- Threat detection logs and analytics
- System health metrics and logs
- Notification storage and delivery status
- Model version and configuration management

### Development Tools

**No build tools currently required**
- Pure HTML/CSS/JS implementation
- Direct browser execution
- Static file serving sufficient for current architecture

**Future Considerations:**
- Module bundler may be needed for scaling (Webpack, Vite)
- TypeScript for type safety in larger codebase
- Testing framework integration (Jest, Cypress)
- API client library for backend communication (Axios, Fetch API wrapper)