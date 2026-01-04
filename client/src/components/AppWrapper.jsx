/**
 * AppWrapper Component - Global app wrapper with keyboard shortcuts
 */

import { useKeyboardShortcuts, KeyboardShortcutsHelp, CommandPalette } from './KeyboardShortcuts.jsx';
import ScrollToTop from './ScrollToTop.jsx';

const AppWrapper = ({ children }) => {
  const { showHelp, setShowHelp, showSearch, setShowSearch } = useKeyboardShortcuts();

  return (
    <>
      {children}
      <ScrollToTop />
      <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <CommandPalette isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default AppWrapper;
