/**
 * ========================================
 * Logging Middleware
 * ========================================
 * 
 * Handles HTTP request logging with date-based log files.
 * Automatically creates log files named by date (DDMMYYYY format)
 * 
 * Usage:
 * app.use(require('./middleware/logging'));
 */

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

/**
 * Generate log filename based on current date
 * Format: access-DDMMYYYY.log
 */
const generateLogFilename = () => {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = now.getFullYear();
	return `access-${day}${month}${year}.log`;
};

/**
 * Initialize logging middleware
 * Creates logs directory and sets up morgan with date-based log files
 */
const initializeLogging = () => {
	const logsDir = path.join(__dirname, '..', 'logs');
	
	// Create logs directory if it doesn't exist
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
		console.log(`📁 Created logs directory: ${logsDir}`);
	}
	
	// Create write stream for today's log file
	const logFilePath = path.join(logsDir, generateLogFilename());
	const accessLog = fs.createWriteStream(logFilePath, { flag: 'a' });
	
	console.log(`📝 Logging to: ${generateLogFilename()}`);
	
	// Return morgan middleware with combined format
	return morgan('combined', { stream: accessLog });
};

module.exports = initializeLogging();
