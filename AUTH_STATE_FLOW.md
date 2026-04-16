================================================================================
                    AUTHENTICATION STATE FLOW DOCUMENTATION
                    From Unauthenticated to Authenticated User
================================================================================

OVERVIEW:
This document explains the complete authentication flow in the application,
detailing how a user transitions from an unauthenticated state to an 
authenticated state, including all files involved in the process.

================================================================================
                              INITIAL STATE
================================================================================

STATE: UNAUTHENTICATED USER
Location: Redux Store (apps/web/src/store/slices/authSlice.ts)

Initial Auth State:
{
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
}

This state is loaded from:
1. localStorage (if previously persisted) via persistMiddleware
2. Otherwise, the initialState from authSlice is used

Files Involved:
- apps/web/src/store/slices/authSlice.ts (defines initial state)
- apps/web/src/store/middleware/persistMiddleware.ts (loads persisted state)
- apps/web/src/store/store.ts (configures store with preloaded state)

================================================================================
                          STEP 1: USER VISITS APP
================================================================================

Flow:
1. User opens the application
2. App.tsx renders and initializes Redux store
3. Store loads persisted auth state from localStorage (if exists)
4. Root route "/" redirects to "/dashboard"

Files Involved:
- apps/web/src/App.tsx (main app component with routing)
- apps/web/src/store/store.ts (store initialization)
- apps/web/src/store/middleware/persistMiddleware.ts (loads persisted auth)

State at this point:
- If no persisted auth: isAuthenticated = false, user = null
- If persisted auth exists: isAuthenticated = true, user = {...}

================================================================================
                    STEP 2: ROUTE PROTECTION CHECK
================================================================================

Flow:
1. User tries to access "/dashboard" route
2. ProtectedRoute component checks auth state
3. If NOT authenticated: redirects to "/auth" (login page)
4. If authenticated: renders Dashboard component
5. If loading: shows "Loading..." message

Files Involved:
- apps/web/src/App.tsx (defines protected route)
- apps/web/src/components/ProtectedRoute.tsx (checks auth state)
- apps/web/src/store/selectors/authSelectors.ts (selects user and loading state)

Selectors Used:
- selectUser: returns state.auth.user
- selectIsLoading: returns state.auth.isLoading

State Check:
if (!user) → Navigate to "/login"
if (isLoading) → Show loading spinner
if (user) → Render protected content

================================================================================
                    STEP 3: USER NAVIGATES TO LOGIN
================================================================================

Flow:
1. Unauthenticated user is redirected to "/auth" route
2. AuthLayout component renders
3. AuthLayout checks if user is already authenticated
4. If authenticated: redirects to "/dashboard"
5. If not authenticated: shows Login form (default) or Signup form

Files Involved:
- apps/web/src/features/auth/pages/AuthLayout.tsx (auth page container)
- apps/web/src/features/auth/pages/Login.tsx (login form)
- apps/web/src/features/auth/pages/Signup.tsx (signup form)
- apps/web/src/hooks/useAuth.ts (provides auth methods)

State at this point:
{
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
}

================================================================================
                    STEP 4A: USER SUBMITS LOGIN FORM
================================================================================

Flow:
1. User enters email and password in Login component
2. User clicks "Sign in" button
3. handleSubmit function is triggered
4. useAuth hook's login() method is called with email and password
5. login() dispatches the login async thunk

Files Involved:
- apps/web/src/features/auth/pages/Login.tsx (login form UI)
- apps/web/src/hooks/useAuth.ts (login method)
- apps/web/src/store/slices/authSlice.ts (login async thunk)

Code Flow:
Login.tsx:
  → handleSubmit(email, password)
    → useAuth().login(email, password)
      → dispatch(login({ email, password }))

================================================================================
                    STEP 5: LOGIN ASYNC THUNK EXECUTION
================================================================================

Flow:
1. login async thunk is dispatched
2. Thunk goes through three phases: pending → fulfilled/rejected

PHASE 1: PENDING (login.pending)
- State Update:
  {
    isLoading: true,
    error: null
  }
- UI Effect: Login button shows "Signing in..." and is disabled

Files Involved:
- apps/web/src/store/slices/authSlice.ts (pending reducer)
- apps/web/src/features/auth/pages/Login.tsx (UI reflects loading state)

PHASE 2: FULFILLED (login.fulfilled) - SUCCESS CASE
- API Call: Calls login API with email and password
  (Currently mocked, TODO: Replace with actual API call)
- Returns: User object { id, email, name }
- State Update:
  {
    isLoading: false,
    user: { id: '1', email: 'user@example.com', name: 'User' },
    isAuthenticated: true,
    error: null
  }
- Side Effects:
  1. persistMiddleware persists auth state to localStorage
  2. Login.tsx navigates to "/dashboard"

Files Involved:
- apps/web/src/store/slices/authSlice.ts (fulfilled reducer)
- apps/web/src/store/middleware/persistMiddleware.ts (persists state)
- apps/web/src/features/auth/pages/Login.tsx (navigation)

PHASE 3: REJECTED (login.rejected) - ERROR CASE
- Error: API call fails or throws error
- State Update:
  {
    isLoading: false,
    error: 'Login failed' (or specific error message),
    user: null,
    isAuthenticated: false
  }
- UI Effect: Error message displayed in red box

Files Involved:
- apps/web/src/store/slices/authSlice.ts (rejected reducer)
- apps/web/src/features/auth/pages/Login.tsx (displays error)

================================================================================
                    STEP 4B: USER SUBMITS SIGNUP FORM
================================================================================

Flow:
1. User enters name, email, password in Signup component
2. User clicks "Sign up" button
3. handleSubmit function validates passwords match
4. useAuth hook's signup() method is called
5. signup() dispatches the signup async thunk

Files Involved:
- apps/web/src/features/auth/pages/Signup.tsx (signup form UI)
- apps/web/src/hooks/useAuth.ts (signup method)
- apps/web/src/store/slices/authSlice.ts (signup async thunk)

Code Flow:
Signup.tsx:
  → handleSubmit(name, email, password)
    → useAuth().signup(name, email, password)
      → dispatch(signup({ name, email, password }))

SIGNUP THUNK PHASES:
Same as login thunk (pending → fulfilled/rejected)

On Success:
- User object is created and stored in state
- isAuthenticated is set to true
- User is navigated to "/login" (to login with new credentials)

On Error:
- Error message is displayed
- User remains on signup page

================================================================================
                    STEP 6: PERSISTENCE TO LOCALSTORAGE
================================================================================

Flow:
1. After successful login/signup, auth state is updated
2. persistMiddleware intercepts the action
3. Middleware checks if action type starts with 'auth/'
4. If yes, entire auth state is serialized and saved to localStorage

Files Involved:
- apps/web/src/store/middleware/persistMiddleware.ts (persistence logic)
- Browser localStorage (storage mechanism)

Storage Key: 'whatsapp-crm-auth'

Stored Data:
{
  user: { id: '1', email: 'user@example.com', name: 'User' },
  isLoading: false,
  error: null,
  isAuthenticated: true
}

This allows users to remain logged in after page refresh.

================================================================================
                    STEP 7: NAVIGATION TO DASHBOARD
================================================================================

Flow:
1. After successful login, Login.tsx navigates to "/dashboard"
2. App.tsx routes to ProtectedRoute component
3. ProtectedRoute checks auth state:
   - selectUser returns the logged-in user
   - selectIsLoading returns false
4. ProtectedRoute renders Dashboard component

Files Involved:
- apps/web/src/features/auth/pages/Login.tsx (navigation)
- apps/web/src/App.tsx (routing)
- apps/web/src/components/ProtectedRoute.tsx (protection check)
- apps/web/src/features/home/pages/Dashboard.tsx (protected content)
- apps/web/src/store/selectors/authSelectors.ts (state selectors)

Final State:
{
  user: { id: '1', email: 'user@example.com', name: 'User' },
  isLoading: false,
  error: null,
  isAuthenticated: true
}

================================================================================
                    STEP 8: AUTHENTICATED USER EXPERIENCE
================================================================================

Flow:
1. User is now on Dashboard page
2. Dashboard can access user info via useAuth hook
3. User can perform authenticated actions
4. Auth state is persisted in localStorage

Files Involved:
- apps/web/src/features/home/pages/Dashboard.tsx (protected page)
- apps/web/src/hooks/useAuth.ts (access auth state)
- apps/web/src/store/selectors/authSelectors.ts (select auth data)

Available Actions:
- logout(): Clears user state and localStorage
- resetPassword(email): Initiates password reset flow

================================================================================
                          STATE FLOW DIAGRAM
================================================================================

UNAUTHENTICATED STATE
        ↓
    [User visits app]
        ↓
    [Check localStorage for persisted auth]
        ↓
    [Try to access /dashboard]
        ↓
    [ProtectedRoute checks auth]
        ↓
    [No user found → Redirect to /auth]
        ↓
    [AuthLayout shows Login/Signup]
        ↓
    [User submits credentials]
        ↓
    [Dispatch login/signup async thunk]
        ↓
    [PENDING: isLoading = true]
        ↓
    [API Call to backend]
        ↓
    ┌─────────────────────────────────┐
    │   SUCCESS          │   FAILURE   │
    ├─────────────────────────────────┤
    │ FULFILLED          │  REJECTED   │
    │ isLoading = false  │ isLoading = │
    │ user = {...}       │ false       │
    │ isAuthenticated =  │ error =     │
    │ true               │ 'message'   │
    │ error = null       │ user = null │
    └─────────────────────────────────┘
        ↓ (SUCCESS)
    [Persist to localStorage]
        ↓
    [Navigate to /dashboard]
        ↓
    [ProtectedRoute allows access]
        ↓
    [Dashboard renders with user data]
        ↓
AUTHENTICATED STATE

================================================================================
                        KEY FILES SUMMARY
================================================================================

1. STORE CONFIGURATION:
   - apps/web/src/store/store.ts
     Purpose: Configures Redux store with auth reducer and middleware
     Key: Loads persisted auth state on initialization

2. AUTH STATE MANAGEMENT:
   - apps/web/src/store/slices/authSlice.ts
     Purpose: Defines auth state, reducers, and async thunks
     Key: login, signup, logout, resetPassword actions

3. PERSISTENCE:
   - apps/web/src/store/middleware/persistMiddleware.ts
     Purpose: Persists auth state to localStorage
     Key: Survives page refresh

4. SELECTORS:
   - apps/web/src/store/selectors/authSelectors.ts
     Purpose: Provides typed access to auth state
     Key: selectUser, selectIsAuthenticated, selectIsLoading, selectError

5. HOOKS:
   - apps/web/src/hooks/useAuth.ts
     Purpose: Custom hook for auth operations
     Key: Provides login, signup, logout, resetPassword methods

6. ROUTE PROTECTION:
   - apps/web/src/components/ProtectedRoute.tsx
     Purpose: Guards routes from unauthenticated access
     Key: Redirects to /auth if not authenticated

7. AUTH PAGES:
   - apps/web/src/features/auth/pages/AuthLayout.tsx
     Purpose: Container for login/signup pages
   - apps/web/src/features/auth/pages/Login.tsx
     Purpose: Login form UI
   - apps/web/src/features/auth/pages/Signup.tsx
     Purpose: Signup form UI

8. PROTECTED PAGES:
   - apps/web/src/features/home/pages/Dashboard.tsx
     Purpose: Protected dashboard page

9. TYPES:
   - packages/shared/src/types/user.ts
     Purpose: Shared User interface definition

10. MAIN APP:
    - apps/web/src/App.tsx
        Purpose: Root component with routing setup

================================================================================
                        STATE TRANSITIONS
================================================================================

TRANSITION 1: UNAUTHENTICATED → LOADING
Trigger: User submits login/signup form
Action: login.pending or signup.pending
State Change:
  isLoading: false → true
  error: any → null

TRANSITION 2: LOADING → AUTHENTICATED
Trigger: API call succeeds
Action: login.fulfilled or signup.fulfilled
State Change:
  isLoading: true → false
  user: null → { id, email, name }
  isAuthenticated: false → true
  error: any → null

TRANSITION 3: LOADING → UNAUTHENTICATED (with error)
Trigger: API call fails
Action: login.rejected or signup.rejected
State Change:
  isLoading: true → false
  user: any → null
  isAuthenticated: any → false
  error: null → 'error message'

TRANSITION 4: AUTHENTICATED → UNAUTHENTICATED
Trigger: User clicks logout
Action: logout reducer
State Change:
  user: {...} → null
  isAuthenticated: true → false
  error: any → null

================================================================================
                        ERROR HANDLING FLOW
================================================================================

1. LOGIN ERROR:
   - User submits invalid credentials
   - login async thunk rejects
   - login.rejected reducer updates state with error message
   - Login.tsx displays error in red box
   - User remains on login page

2. SIGNUP ERROR:
   - User submits invalid data
   - signup async thunk rejects
   - signup.rejected reducer updates state with error message
   - Signup.tsx displays error in red box
   - User remains on signup page

3. CLEAR ERROR:
   - clearError action can be dispatched to clear error state
   - Useful for dismissing error messages

Files Involved:
- apps/web/src/store/slices/authSlice.ts (error handling in reducers)
- apps/web/src/features/auth/pages/Login.tsx (displays error)
- apps/web/src/features/auth/pages/Signup.tsx (displays error)

================================================================================
                        PAGE REFRESH SCENARIO
================================================================================

Scenario: User is logged in, then refreshes the page

Flow:
1. Page refresh triggers app reload
2. App.tsx initializes Redux store
3. store.ts calls loadPersistedAuth()
4. loadPersistedAuth() retrieves auth state from localStorage
5. Store is initialized with preloadedState containing persisted auth
6. User is still authenticated without re-logging in
7. ProtectedRoute allows access to /dashboard

Files Involved:
- apps/web/src/store/middleware/persistMiddleware.ts (loadPersistedAuth)
- apps/web/src/store/store.ts (preloadedState)
- apps/web/src/components/ProtectedRoute.tsx (checks persisted state)

================================================================================
                        LOGOUT FLOW
================================================================================

Flow:
1. User clicks logout button (typically on Dashboard)
2. useAuth().logout() is called
3. logout reducer is dispatched
4. State is updated:
   {
     user: null,
     isAuthenticated: false,
     error: null,
     isLoading: false
   }
5. persistMiddleware persists empty auth state to localStorage
6. User is redirected to /auth
7. ProtectedRoute prevents access to /dashboard

Files Involved:
- apps/web/src/hooks/useAuth.ts (logout method)
- apps/web/src/store/slices/authSlice.ts (logout reducer)
- apps/web/src/store/middleware/persistMiddleware.ts (clears localStorage)

================================================================================
                        RESET PASSWORD FLOW
================================================================================

Flow:
1. User clicks "Forgot your password?" on login page
2. User is redirected to /reset-password
3. User enters email address
4. useAuth().resetPassword(email) is called
5. resetPassword async thunk is dispatched
6. Similar to login/signup: pending → fulfilled/rejected
7. On success: User receives password reset email
8. User can then login with new password

Files Involved:
- apps/web/src/features/auth/pages/ResetPassword.tsx (reset form)
- apps/web/src/hooks/useAuth.ts (resetPassword method)
- apps/web/src/store/slices/authSlice.ts (resetPassword async thunk)

================================================================================
                        SUMMARY
================================================================================

The authentication flow follows a Redux-based state management pattern:

1. Initial State: User is unauthenticated (user: null, isAuthenticated: false)

2. User Action: Submits login/signup form

3. Async Operation: Dispatches async thunk (login/signup)

4. State Updates: 
   - Pending: Shows loading state
   - Fulfilled: Updates user and isAuthenticated
   - Rejected: Shows error message

5. Persistence: Auth state is saved to localStorage

6. Route Protection: ProtectedRoute checks auth state before rendering

7. Navigation: User is redirected to dashboard on success

8. Authenticated State: User can access protected routes and perform actions

All state changes flow through Redux, ensuring predictable and traceable
state management throughout the authentication lifecycle.

================================================================================
