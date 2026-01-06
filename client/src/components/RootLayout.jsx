import { Outlet } from 'react-router-dom';
import { SessionProvider, useSession } from '../context';
import SessionWarning from './SessionWarning';

/**
 * Inner component that uses session context
 */
const RootLayoutInner = () => {
	const { showSessionWarning, timeRemaining, continueSession, performLogout } = useSession();

	return (
		<>
			<Outlet />
			<SessionWarning 
				isVisible={showSessionWarning}
				timeRemaining={timeRemaining}
				onContinueSession={continueSession}
				onLogout={performLogout}
			/>
		</>
	);
};

/**
 * RootLayout Component
 * Main layout wrapper for the entire application
 * Handles session management UI
 */
const RootLayout = () => {
	return (
		<SessionProvider>
			<RootLayoutInner />
		</SessionProvider>
	);
};

export default RootLayout;
