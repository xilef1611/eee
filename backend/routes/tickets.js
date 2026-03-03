const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create ticket (public or authenticated)
router.post('/', async (req, res) => {
  try {
    const {
      customer_email,
      customer_name,
      subject,
      message,
      order_id
    } = req.body;

    if (!customer_email || !customer_name || !subject || !message) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    // Generate ticket number
    const ticketNumber = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create ticket
    const ticketResult = db.prepare(`
      INSERT INTO support_tickets (
        ticket_number, user_id, customer_email, customer_name, subject, order_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      ticketNumber,
      req.user?.id || null,
      customer_email,
      customer_name,
      subject,
      order_id || null
    );

    // Add first message
    db.prepare(`
      INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, message)
      VALUES (?, 'customer', ?, ?)
    `).run(ticketResult.lastInsertRowid, customer_name, message);

    res.json({
      ticketId: ticketResult.lastInsertRowid,
      ticketNumber,
      message: 'Support-Ticket erstellt'
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Tickets' });
  }
});

// Get tickets for customer (by email or user_id)
router.get('/my-tickets', (req, res) => {
  try {
    const { email } = req.query;
    const userId = req.user?.id;

    if (!email && !userId) {
      return res.status(400).json({ error: 'Email oder Authentifizierung erforderlich' });
    }

    let tickets;
    if (userId) {
      tickets = db.prepare(`
        SELECT * FROM support_tickets
        WHERE user_id = ?
        ORDER BY created_at DESC
      `).all(userId);
    } else {
      tickets = db.prepare(`
        SELECT * FROM support_tickets
        WHERE customer_email = ?
        ORDER BY created_at DESC
      `).all(email);
    }

    res.json(tickets);
  } catch (error) {
    console.error('Get my tickets error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Tickets' });
  }
});

// Get ticket by number (with messages)
router.get('/:ticketNumber', (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticket = db.prepare(`
      SELECT * FROM support_tickets WHERE ticket_number = ?
    `).get(ticketNumber);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }

    const messages = db.prepare(`
      SELECT * FROM ticket_messages
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `).all(ticket.id);

    res.json({
      ...ticket,
      messages
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Tickets' });
  }
});

// Add message to ticket
router.post('/:ticketNumber/messages', (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { message, sender_name } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Nachricht erforderlich' });
    }

    const ticket = db.prepare('SELECT id FROM support_tickets WHERE ticket_number = ?').get(ticketNumber);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }

    const senderType = req.user?.role === 'admin' ? 'admin' : 'customer';

    db.prepare(`
      INSERT INTO ticket_messages (ticket_id, sender_type, sender_name, message)
      VALUES (?, ?, ?, ?)
    `).run(ticket.id, senderType, sender_name, message);

    // Update ticket timestamp
    db.prepare('UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(ticket.id);

    res.json({ message: 'Nachricht hinzugefügt' });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Fehler beim Hinzufügen der Nachricht' });
  }
});

// Admin: Get all tickets
router.get('/admin/all', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM support_tickets';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY updated_at DESC';

    const tickets = db.prepare(query).all(...params);
    res.json(tickets);
  } catch (error) {
    console.error('Get admin tickets error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Tickets' });
  }
});

// Admin: Update ticket status
router.put('/:ticketNumber/status', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { status } = req.body;

    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Ungültiger Status' });
    }

    db.prepare(`
      UPDATE support_tickets
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_number = ?
    `).run(status, ticketNumber);

    res.json({ message: 'Ticket-Status aktualisiert' });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Status' });
  }
});

module.exports = router;
