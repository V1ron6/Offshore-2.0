/**
 * Complaint Controller
 * Handles complaint/concern submissions and management
 */

const nodemailer = require('nodemailer');
const {
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
} = require('../Models/complaint.model.js');
const defaultUser = require('../Models/user.model.js');

// Email transporter configuration
const createTransporter = () => {
	return nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE || 'gmail',
		host: process.env.EMAIL_HOST || 'smtp.gmail.com',
		port: process.env.EMAIL_PORT || 587,
		secure: false,
		auth: {
			user: process.env.ADMIN_EMAIL,
			pass: process.env.ADMIN_EMAIL_PASSWORD
		}
	});
};

/**
 * Send email notification to admin
 */
const sendEmailNotification = async (complaint) => {
	// Skip if email credentials not configured
	if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASSWORD) {
		console.log('Email notification skipped - credentials not configured');
		return { success: false, message: 'Email credentials not configured' };
	}

	try {
		const transporter = createTransporter();
		
		const mailOptions = {
			from: process.env.ADMIN_EMAIL,
			to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL,
			subject: `🚨 New Complaint: ${complaint.subject} [${complaint.priority.toUpperCase()}]`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; border-radius: 10px 10px 0 0;">
						<h1 style="color: white; margin: 0;">🚢 Offshore E-Commerce</h1>
						<p style="color: #fecaca; margin: 5px 0 0 0;">New Customer Complaint Received</p>
					</div>
					
					<div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
						<h2 style="color: #1f2937; margin-top: 0;">Complaint Details</h2>
						
						<table style="width: 100%; border-collapse: collapse;">
							<tr>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Complaint ID:</td>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${complaint.id}</td>
							</tr>
							<tr>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">From:</td>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${complaint.username} (${complaint.userEmail})</td>
							</tr>
							<tr>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Category:</td>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${complaint.category}</td>
							</tr>
							<tr>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Priority:</td>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
									<span style="background: ${complaint.priority === 'urgent' ? '#dc2626' : complaint.priority === 'high' ? '#f97316' : complaint.priority === 'medium' ? '#eab308' : '#22c55e'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
										${complaint.priority.toUpperCase()}
									</span>
								</td>
							</tr>
							<tr>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Subject:</td>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: bold;">${complaint.subject}</td>
							</tr>
							<tr>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Date:</td>
								<td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${new Date(complaint.createdAt).toLocaleString()}</td>
							</tr>
						</table>
						
						<div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #dc2626;">
							<h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
							<p style="color: #4b5563; line-height: 1.6;">${complaint.message}</p>
						</div>
					</div>
					
					<div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
						<p style="color: #9ca3af; margin: 0; font-size: 12px;">
							Please login to the admin dashboard to respond to this complaint.
						</p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		console.log('Email notification sent successfully');
		return { success: true, message: 'Email sent successfully' };
	} catch (error) {
		console.error('Error sending email:', error);
		return { success: false, message: error.message };
	}
};

/**
 * Submit a new complaint (User)
 */
const submitComplaint = async (req, res) => {
	try {
		const { subject, category, message, priority } = req.body;
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'User not authenticated'
			});
		}

		// Get user details from model
		const user = defaultUser.find(u => u.id === userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Validate required fields
		if (!subject || !message) {
			return res.status(400).json({
				success: false,
				message: 'Subject and message are required'
			});
		}

		// Create complaint
		const complaint = createComplaint({
			userId: user.id,
			userEmail: user.email || `${user.username}@example.com`,
			username: user.username,
			subject,
			category,
			message,
			priority
		});

		// Send email notification to admin (async, don't wait)
		sendEmailNotification(complaint).catch(err => {
			console.error('Failed to send email notification:', err);
		});

		return res.status(201).json({
			success: true,
			message: 'Complaint submitted successfully. Our team will review it shortly.',
			data: complaint
		});

	} catch (error) {
		console.error('Error submitting complaint:', error);
		return res.status(500).json({
			success: false,
			message: 'Error submitting complaint',
			error: error.message
		});
	}
};

/**
 * Get user's own complaints
 */
const getUserComplaints = (req, res) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'User not authenticated'
			});
		}

		const complaints = getComplaintsByUserId(userId);

		return res.status(200).json({
			success: true,
			data: complaints,
			count: complaints.length
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching complaints',
			error: error.message
		});
	}
};

/**
 * Get all complaints (Admin only)
 */
const getAllComplaintsAdmin = (req, res) => {
	try {
		const complaints = getAllComplaints();

		return res.status(200).json({
			success: true,
			data: complaints,
			count: complaints.length,
			unreadCount: getUnreadCount(),
			pendingCount: getPendingCount()
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching complaints',
			error: error.message
		});
	}
};

/**
 * Get complaint statistics (Admin only)
 */
const getComplaintStats = (req, res) => {
	try {
		const complaints = getAllComplaints();
		
		const stats = {
			total: complaints.length,
			unread: getUnreadCount(),
			pending: getPendingCount(),
			inProgress: complaints.filter(c => c.status === 'in-progress').length,
			resolved: complaints.filter(c => c.status === 'resolved').length,
			closed: complaints.filter(c => c.status === 'closed').length,
			byPriority: {
				urgent: complaints.filter(c => c.priority === 'urgent').length,
				high: complaints.filter(c => c.priority === 'high').length,
				medium: complaints.filter(c => c.priority === 'medium').length,
				low: complaints.filter(c => c.priority === 'low').length
			},
			byCategory: complaints.reduce((acc, c) => {
				acc[c.category] = (acc[c.category] || 0) + 1;
				return acc;
			}, {})
		};

		return res.status(200).json({
			success: true,
			stats
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching complaint stats',
			error: error.message
		});
	}
};

/**
 * Get single complaint (Admin only)
 */
const getComplaintByIdAdmin = (req, res) => {
	try {
		const { id } = req.params;
		const complaint = getComplaintById(id);

		if (!complaint) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found'
			});
		}

		// Mark as read when admin views it
		markAsRead(id);

		return res.status(200).json({
			success: true,
			data: complaint
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error fetching complaint',
			error: error.message
		});
	}
};

/**
 * Update complaint status (Admin only)
 */
const updateComplaintStatus = (req, res) => {
	try {
		const { id } = req.params;
		const { status, adminNotes, priority } = req.body;

		const complaint = getComplaintById(id);
		if (!complaint) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found'
			});
		}

		const updates = {};
		if (status) updates.status = status;
		if (adminNotes !== undefined) updates.adminNotes = adminNotes;
		if (priority) updates.priority = priority;

		const updatedComplaint = updateComplaint(id, updates);

		return res.status(200).json({
			success: true,
			message: 'Complaint updated successfully',
			data: updatedComplaint
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error updating complaint',
			error: error.message
		});
	}
};

/**
 * Mark all complaints as read (Admin only)
 */
const markAllComplaintsAsRead = (req, res) => {
	try {
		markAllAsRead();

		return res.status(200).json({
			success: true,
			message: 'All complaints marked as read'
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error marking complaints as read',
			error: error.message
		});
	}
};

/**
 * Delete complaint (Admin only)
 */
const deleteComplaintAdmin = (req, res) => {
	try {
		const { id } = req.params;

		const deleted = deleteComplaint(id);
		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found'
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Complaint deleted successfully'
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Error deleting complaint',
			error: error.message
		});
	}
};

module.exports = {
	submitComplaint,
	getUserComplaints,
	getAllComplaintsAdmin,
	getComplaintStats,
	getComplaintByIdAdmin,
	updateComplaintStatus,
	markAllComplaintsAsRead,
	deleteComplaintAdmin
};
