/**
 * Complaint Model
 * Stores user complaints/concerns
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage for complaints
const complaints = [];

/**
 * Create a new complaint
 */
const createComplaint = (complaintData) => {
	const newComplaint = {
		id: uuidv4(),
		userId: complaintData.userId,
		userEmail: complaintData.userEmail,
		username: complaintData.username,
		subject: complaintData.subject,
		category: complaintData.category || 'general',
		message: complaintData.message,
		status: 'pending', // pending, in-progress, resolved, closed
		priority: complaintData.priority || 'medium', // low, medium, high, urgent
		isRead: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		adminNotes: '',
		resolvedAt: null
	};
	
	complaints.unshift(newComplaint); // Add to beginning (newest first)
	return newComplaint;
};

/**
 * Get all complaints
 */
const getAllComplaints = () => {
	return complaints;
};

/**
 * Get complaints by user ID
 */
const getComplaintsByUserId = (userId) => {
	return complaints.filter(c => c.userId === userId);
};

/**
 * Get complaint by ID
 */
const getComplaintById = (id) => {
	return complaints.find(c => c.id === id);
};

/**
 * Get unread complaints count
 */
const getUnreadCount = () => {
	return complaints.filter(c => !c.isRead).length;
};

/**
 * Get pending complaints count
 */
const getPendingCount = () => {
	return complaints.filter(c => c.status === 'pending').length;
};

/**
 * Update complaint
 */
const updateComplaint = (id, updates) => {
	const index = complaints.findIndex(c => c.id === id);
	if (index === -1) return null;
	
	complaints[index] = {
		...complaints[index],
		...updates,
		updatedAt: new Date().toISOString()
	};
	
	if (updates.status === 'resolved') {
		complaints[index].resolvedAt = new Date().toISOString();
	}
	
	return complaints[index];
};

/**
 * Mark complaint as read
 */
const markAsRead = (id) => {
	return updateComplaint(id, { isRead: true });
};

/**
 * Mark all complaints as read
 */
const markAllAsRead = () => {
	complaints.forEach(c => {
		c.isRead = true;
		c.updatedAt = new Date().toISOString();
	});
	return complaints;
};

/**
 * Delete complaint
 */
const deleteComplaint = (id) => {
	const index = complaints.findIndex(c => c.id === id);
	if (index === -1) return false;
	
	complaints.splice(index, 1);
	return true;
};

module.exports = {
	complaints,
	createComplaint,
	getAllComplaints,
	getComplaintsByUserId,
	getComplaintById,
	getUnreadCount,
	getPendingCount,
	updateComplaint,
	markAsRead,
	markAllAsRead,
	deleteComplaint
};
