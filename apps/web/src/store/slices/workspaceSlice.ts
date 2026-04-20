import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActiveWorkspace {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
}

export interface WorkspaceState {
  activeWorkspace: ActiveWorkspace | null;
}

const initialState: WorkspaceState = {
  activeWorkspace: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<ActiveWorkspace>) => {
      state.activeWorkspace = action.payload;
    },
    clearActiveWorkspace: (state) => {
      state.activeWorkspace = null;
    },
    updateActiveWorkspaceName: (state, action: PayloadAction<string>) => {
      if (state.activeWorkspace) {
        state.activeWorkspace.name = action.payload;
      }
    },
  },
});

export const { setActiveWorkspace, clearActiveWorkspace, updateActiveWorkspaceName } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;
