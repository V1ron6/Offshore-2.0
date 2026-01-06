import { useSession } from '../context';
import SessionWarning from './SessionWarning';

/**
 * AppLayout Component
 * Wraps the entire application and manages session UI
 */
const AppLayout = ({ children }) => {
	const { showSessionWarning, timeRemaining, continueSession, performLogout } = useSession();

	return (
		<>
			{children}
			<SessionWarning 
				isVisible={showSessionWarning}
				timeRemaining={timeRemaining}
				onContinueSession={continueSession}
				onLogout={performLogout}
			/>
		</>
	);
};

export default AppLayout;
