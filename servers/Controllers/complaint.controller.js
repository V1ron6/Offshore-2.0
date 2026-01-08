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
		host: process.env.EMAIL_HOST || 'smtp.gmail.com',
		port: parseInt(process.env.EMAIL_PORT) || 587,
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
		
		const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		const mailOptions = {
			from: process.env.ADMIN_EMAIL,
			to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL,
			subject: `Customer Complaint - ${complaint.subject} [${complaint.priority.toUpperCase()} Priority]`,
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0;">
					<!-- Header -->
					<div style="background-color: #1a1a2e; padding: 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">OFFSHORE E-COMMERCE</h1>
						<p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 13px;">Customer Support Notification</p>
					</div>
					
					<!-- Reference Banner -->
					<div style="background-color: #f8f9fa; padding: 15px 30px; border-bottom: 1px solid #e0e0e0;">
						<table style="width: 100%;">
							<tr>
								<td style="color: #666; font-size: 13px;">Reference No: <strong style="color: #1a1a2e;">${complaint.id}</strong></td>
								<td style="text-align: right; color: #666; font-size: 13px;">${formattedDate}</td>
							</tr>
						</table>
					</div>

					<!-- Main Content -->
					<div style="padding: 30px;">
						<p style="color: #333; font-size: 14px; margin: 0 0 20px 0;">Dear Administrator,</p>
						
						<p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0 0 25px 0;">
							A new customer complaint has been submitted and requires your attention. Please review the details below and take appropriate action.
						</p>

						<!-- Complaint Details Table -->
						<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
							<tr style="background-color: #1a1a2e;">
								<th colspan="2" style="padding: 12px 15px; text-align: left; color: #ffffff; font-size: 14px; font-weight: 600;">Complaint Information</th>
							</tr>
							<tr>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px; width: 35%;">Customer Name</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${complaint.username}</td>
							</tr>
							<tr style="background-color: #fafafa;">
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Email Address</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${complaint.userEmail}</td>
							</tr>
							<tr>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Category</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${complaint.category}</td>
							</tr>
							<tr style="background-color: #fafafa;">
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Priority Level</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">
									<span style="background-color: ${complaint.priority === 'urgent' ? '#dc3545' : complaint.priority === 'high' ? '#fd7e14' : complaint.priority === 'medium' ? '#ffc107' : '#28a745'}; color: ${complaint.priority === 'medium' ? '#333' : '#fff'}; padding: 4px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
										${complaint.priority}
									</span>
								</td>
							</tr>
							<tr>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Subject</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px; font-weight: 600;">${complaint.subject}</td>
							</tr>
						</table>

						<!-- Message Section -->
						<div style="margin-bottom: 25px;">
							<p style="color: #1a1a2e; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px;">Customer Message</p>
							<div style="background-color: #f8f9fa; padding: 20px; border-left: 3px solid #1a1a2e;">
								<p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${complaint.message}</p>
							</div>
						</div>

						<!-- Action Required -->
						<div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin-bottom: 25px;">
							<p style="color: #856404; font-size: 13px; margin: 0;">
								<strong>Action Required:</strong> Please log in to the administration dashboard to review and respond to this complaint at your earliest convenience.
							</p>
						</div>

						<p style="color: #333; font-size: 14px; margin: 0;">
							Best regards,<br>
							<strong>Offshore E-Commerce System</strong>
						</p>
					</div>

					<!-- Footer -->
					<div style="background-color: #1a1a2e; padding: 20px 30px; text-align: center;">
						<p style="color: #a0a0a0; font-size: 11px; margin: 0; line-height: 1.6;">
							This is an automated notification from Offshore E-Commerce.<br>
							Please do not reply directly to this email.
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
 * Send resolution email to user when complaint is resolved
 */
const sendResolutionEmail = async (complaint) => {
	// Skip if email credentials not configured
	if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASSWORD) {
		console.log('Resolution email skipped - credentials not configured');
		return { success: false, message: 'Email credentials not configured' };
	}

	try {
		const transporter = createTransporter();
		
		const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		const resolvedDate = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		const mailOptions = {
			from: process.env.ADMIN_EMAIL,
			to: complaint.userEmail,
			subject: `Your Complaint Has Been Resolved - Reference: ${complaint.id.slice(0, 8).toUpperCase()}`,
			html: `
				<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0;">
					<!-- Header -->
					<div style="background-color: #1a1a2e; padding: 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">OFFSHORE E-COMMERCE</h1>
						<p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 13px;">Customer Support</p>
					</div>
					
					<!-- Status Banner -->
					<div style="background-color: #d4edda; padding: 20px 30px; border-bottom: 1px solid #c3e6cb; text-align: center;">
						<span style="background-color: #28a745; color: #fff; padding: 8px 20px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">RESOLVED</span>
					</div>

					<!-- Main Content -->
					<div style="padding: 30px;">
						<p style="color: #333; font-size: 14px; margin: 0 0 20px 0;">Dear ${complaint.username},</p>
						
						<p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0 0 25px 0;">
							We are pleased to inform you that your complaint has been reviewed and resolved by our support team. Thank you for bringing this matter to our attention.
						</p>

						<!-- Complaint Summary Table -->
						<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
							<tr style="background-color: #1a1a2e;">
								<th colspan="2" style="padding: 12px 15px; text-align: left; color: #ffffff; font-size: 14px; font-weight: 600;">Complaint Summary</th>
							</tr>
							<tr>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px; width: 35%;">Reference Number</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px; font-weight: 600;">${complaint.id.slice(0, 8).toUpperCase()}</td>
							</tr>
							<tr style="background-color: #fafafa;">
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Subject</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${complaint.subject}</td>
							</tr>
							<tr>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Category</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${complaint.category}</td>
							</tr>
							<tr style="background-color: #fafafa;">
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Date Submitted</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${formattedDate}</td>
							</tr>
							<tr>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 13px;">Date Resolved</td>
								<td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 13px;">${resolvedDate}</td>
							</tr>
						</table>

						${complaint.adminNotes ? `
						<!-- Admin Response Section -->
						<div style="margin-bottom: 25px;">
							<p style="color: #1a1a2e; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px;">Resolution Notes</p>
							<div style="background-color: #f8f9fa; padding: 20px; border-left: 3px solid #28a745;">
								<p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${complaint.adminNotes}</p>
							</div>
						</div>
						` : ''}

						<!-- Feedback Notice -->
						<div style="background-color: #e7f3ff; border: 1px solid #b6d4fe; padding: 15px; margin-bottom: 25px;">
							<p style="color: #084298; font-size: 13px; margin: 0;">
								<strong>We Value Your Feedback:</strong> If you have any further questions or concerns regarding this matter, please do not hesitate to contact us again through our support portal.
							</p>
						</div>

						<p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0 0 20px 0;">
							Thank you for choosing Offshore E-Commerce. We appreciate your patience and understanding.
						</p>

						<p style="color: #333; font-size: 14px; margin: 0;">
							Best regards,<br>
							<strong>Offshore E-Commerce Support Team</strong>
						</p>
					</div>

					<!-- Footer -->
					<div style="background-color: #1a1a2e; padding: 20px 30px; text-align: center;">
						<p style="color: #a0a0a0; font-size: 11px; margin: 0; line-height: 1.6;">
							This is an automated notification from Offshore E-Commerce.<br>
							Please do not reply directly to this email.
						</p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		console.log('Resolution email sent to user successfully');
		return { success: true, message: 'Resolution email sent successfully' };
	} catch (error) {
		console.error('Error sending resolution email:', error);
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

		const previousStatus = complaint.status;
		
		const updates = {};
		if (status) updates.status = status;
		if (adminNotes !== undefined) updates.adminNotes = adminNotes;
		if (priority) updates.priority = priority;

		const updatedComplaint = updateComplaint(id, updates);

		// Send resolution email to user if status changed to resolved
		if (status === 'resolved' && previousStatus !== 'resolved') {
			sendResolutionEmail(updatedComplaint).catch(err => {
				console.error('Failed to send resolution email:', err);
			});
		}

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
