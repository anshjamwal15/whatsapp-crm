import {
  useAppDispatch,
  useAppSelector,
  selectActiveWorkspace,
  selectActiveWorkspaceId,
  selectActiveWorkspaceName,
  setActiveWorkspace,
  clearActiveWorkspace,
  updateActiveWorkspaceName,
} from '@/store';
import type { ActiveWorkspace } from '@/store';

/**
 * Hook to read and update the active workspace from anywhere in the app.
 *
 * Usage:
 *   const { activeWorkspace, setWorkspace, clearWorkspace } = useWorkspace();
 */
export const useWorkspace = () => {
  const dispatch = useAppDispatch();
  const activeWorkspace = useAppSelector(selectActiveWorkspace);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const activeWorkspaceName = useAppSelector(selectActiveWorkspaceName);

  return {
    activeWorkspace,
    activeWorkspaceId,
    activeWorkspaceName,
    setWorkspace: (workspace: ActiveWorkspace) => dispatch(setActiveWorkspace(workspace)),
    clearWorkspace: () => dispatch(clearActiveWorkspace()),
    updateWorkspaceName: (name: string) => dispatch(updateActiveWorkspaceName(name)),
  };
};
