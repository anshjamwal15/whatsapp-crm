import { RootState } from '../store.js';

export const selectActiveWorkspace = (state: RootState) => state.workspace.activeWorkspace;
export const selectActiveWorkspaceId = (state: RootState) => state.workspace.activeWorkspace?.id ?? null;
export const selectActiveWorkspaceName = (state: RootState) => state.workspace.activeWorkspace?.name ?? null;
