# README for Cursor AI

This document provides essential context about the codebase structure, conventions, and important implementation details to help Cursor AI assist with development.

## Project Overview

**非預期心臟驟停風險預測系統** (Unexpected Cardiac Arrest Risk Prediction System)

A Next.js 14 application using App Router and TypeScript for predicting in-hospital cardiac arrest (IHCA) risk using logistic regression. The system includes:
- Patient data input form
- Risk calculation API
- Results dashboard
- Ward electronic board for managing multiple patients

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18 with inline styles (no CSS framework)
- **Storage**: Browser localStorage and sessionStorage
- **Deployment**: Vercel-ready

## Project Structure

```
app/
  ├── api/
  │   └── predict/
  │       └── route.ts          # POST endpoint for risk calculation
  ├── dashboard/
  │   └── page.tsx              # Results display page
  ├── input/
  │   └── page.tsx              # Main input form (client component)
  ├── ward/
  │   └── page.tsx              # Ward electronic board
  ├── layout.tsx                # Root layout
  ├── page.tsx                  # Homepage with navigation
  └── globals.css               # Global styles
lib/
  └── patientStorage.ts         # Patient data management utilities
```

## Key Implementation Details

### 1. API Route (`/api/predict/route.ts`)

**Purpose**: Performs logistic regression calculation for IHCA risk prediction.

**Input Fields** (all required):
- `Age`: Patient age (years)
- `Sex`: Binary (1 = male, 0 = female)
- `pleuraleffusion`: Binary (1 = yes, 0 = no)
- `MI`: Myocardial infarction history (1 = yes, 0 = no)
- `HF`: Heart failure history (1 = yes, 0 = no)
- `Temp__01_1`: Body temperature (°C)
- `Sp_01_1`: Systolic blood pressure (mmHg)
- `Dp_01_1`: Diastolic blood pressure (mmHg)
- `Spo2_01_1`: Blood oxygen saturation (%)
- `Albumin`: Albumin (g/dL)
- `GlucoseAC`: Fasting glucose (mg/dL)
- `Hemoglobin`: Hemoglobin (g/dL)
- `WBC`: White blood cell count (10³/µL)
- `e_GFR`: Estimated GFR (mL/min/1.73m²)
- `Potassium`: Potassium (mEq/L)

**Calculation Formula**:
```
logit = 8.282
  - 0.146 * Temp
  - 0.012 * SBP
  + 0.008 * DBP
  - 0.037 * SpO2
  + 0.112 * (Age / 10)
  + 0.242 * Sex
  + 0.645 * PleuralEffusion
  + 0.292 * MI
  + 0.495 * HF
  - 0.506 * Albumin
  - 0.002 * Glucose
  - 0.220 * Hemoglobin
  + 0.095 * WBC
  + 0.010 * eGFR
  + 0.365 * Potassium

probability = 1 / (1 + exp(-logit))
```

**Risk Levels**:
- Low: probability < 0.3
- Medium: 0.3 ≤ probability < 0.7
- High: probability ≥ 0.7

**Response Format**:
```typescript
{
  logit: number,
  probability: number,
  riskLevel: '低風險' | '中風險' | '高風險',
  timestamp: string (ISO),
  inputData: { ... }
}
```

### 2. Input Form (`/input/page.tsx`)

**Key Features**:
- Client component (`'use client'`)
- Form validation (frontend + backend)
- Auto-save draft to sessionStorage (throttled 400ms)
- Field-level error messages
- Responsive design with mobile-friendly touch targets (min 44px)
- Sticky submit button at bottom
- Clear draft functionality

**Field Configuration**:
- Defined in `fieldConfigs` array
- Supports: `number`, `radio` (binary) types
- Each field has: key, label, unit, min/max, required flag, placeholder

**Form Sections**:
1. 基本資料 (Basic Info): Age, Sex
2. 病史 (Medical History): Pleural effusion, MI, HF
3. 生命徵象 (Vital Signs): Temp, SBP, DBP, SpO2
4. 檢驗 (Lab Tests): Albumin, Glucose, Hemoglobin, WBC, eGFR, Potassium

**Data Flow**:
1. User inputs → `formData` state
2. Auto-save to sessionStorage (draft)
3. On submit → validate → POST to `/api/predict`
4. On success → save to localStorage + sessionStorage → navigate to `/dashboard`

### 3. Patient Storage (`lib/patientStorage.ts`)

**Purpose**: Manages patient data persistence in localStorage.

**Key Functions**:
- `getAllPatients()`: Returns all stored patients
- `savePatient(patient)`: Saves/updates a patient
- `deletePatient(id)`: Removes a patient
- `getPatientById(id)`: Gets a specific patient
- `generatePatientId()`: Creates unique ID
- `createPatientFromResult(result, name?, bedNumber?)`: Creates patient from API result

**Storage Key**: `'ihca_patients'`

**Data Structure**:
```typescript
interface PatientData {
  id: string
  name?: string
  bedNumber?: string
  result: {
    logit?: number
    probability?: number
    riskLevel?: string
    timestamp?: string
    inputData?: any
  }
  createdAt: string
  updatedAt: string
}
```

**Important**: All functions check `typeof window === 'undefined'` for SSR safety.

### 4. Styling Approach

**No CSS Framework**: Uses inline styles with React.CSSProperties

**Color Scheme** (defined in each component):
- Clinical, neutral colors
- Header: Dark (#2c3e50)
- Primary button: Blue (#4a90e2)
- Error: Red (#d32f2f)
- Background: White (#ffffff)

**Design Principles**:
- Mobile-first responsive
- Minimum touch target: 44px
- Accessible (ARIA labels, roles)
- Clean, clinical aesthetic

### 5. Data Persistence Strategy

**sessionStorage**:
- Form draft: `'ihca_input_draft'` (auto-saved, cleared on submit)
- Result data: `'ihca_result'` (temporary, for dashboard display)

**localStorage**:
- Patient records: `'ihca_patients'` (persistent, for ward board)

## Development Guidelines

### When Adding New Features

1. **API Routes**: Place in `app/api/[route]/route.ts`, use Next.js 14 App Router conventions
2. **Client Components**: Must include `'use client'` directive
3. **Type Safety**: Use TypeScript interfaces for all data structures
4. **Validation**: Implement both frontend and backend validation
5. **Error Handling**: Provide user-friendly error messages in Chinese
6. **Storage**: Check `typeof window` before accessing browser APIs

### Code Style

- **Language**: Chinese for UI text, English for code
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Chinese comments for business logic
- **Formatting**: Follow existing code style (inline styles, functional components)

### Important Constraints

1. **No External Dependencies**: Currently only uses Next.js, React, TypeScript
2. **Browser Storage Only**: No backend database (localStorage/sessionStorage)
3. **SSR Safety**: All browser API calls must check for `window` object
4. **Form Validation**: Required on both client and server
5. **Medical Disclaimer**: Must be displayed on input form

## Common Tasks

### Adding a New Form Field

1. Add field config to `fieldConfigs` array in `app/input/page.tsx`
2. Add field to API validation in `app/api/predict/route.ts`
3. Include in calculation formula if needed
4. Update TypeScript interfaces if necessary

### Modifying Risk Calculation

1. Update formula in `app/api/predict/route.ts` (logit calculation)
2. Adjust risk level thresholds if needed
3. Test with known values to verify

### Adding a New Page

1. Create `app/[route]/page.tsx`
2. Add navigation link in `app/page.tsx` or `app/layout.tsx`
3. Follow existing styling patterns

## Testing Considerations

- Test form validation with edge cases (empty, out of range, invalid types)
- Verify localStorage persistence across page refreshes
- Test mobile responsiveness
- Verify API error handling
- Test draft auto-save functionality

## Deployment Notes

- **Vercel**: Auto-detects Next.js, no special config needed
- **Environment**: No environment variables currently required
- **Build**: Standard Next.js build process (`npm run build`)
- **Static Assets**: None currently (all inline styles)

## Known Limitations

1. **No Backend Database**: Data only persists in browser storage
2. **No Authentication**: No user management or access control
3. **No Data Export**: Cannot export patient records
4. **Single Device**: Data not synced across devices
5. **No History**: No audit trail or version history

## Future Enhancement Ideas

- Backend database integration
- User authentication
- Data export (CSV, PDF)
- Multi-device sync
- Audit logging
- Advanced analytics
- Print functionality
- Email/SMS notifications

---

**Last Updated**: Based on current codebase state
**Maintainer Notes**: This is a clinical research tool, not a medical device. All calculations are for reference only.

