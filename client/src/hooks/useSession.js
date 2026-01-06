import { useContext } from 'react';
import { SessionContext } from '../context/sessionContextDef';

/**
 * Custom hook to access session context
 * @returns {Object} Session context value
 */
export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error('useSession must be used within SessionProvider');
	}
	return context;
};

export default useSession;
