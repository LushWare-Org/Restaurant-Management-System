const express = require('express');
const router = express.Router();
const Walkin = require('../models/Walkin');
const Table = require('../models/Table');
const Notification = require('../models/Notification');

// GET /api/walkins - Get all walk-in guests
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { guestName: new RegExp(search, 'i') },
        { walkinId: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const walkins = await Walkin.find(query).sort({ arrivalTime: -1 });

    const formattedWalkins = walkins.map((walkin) => ({
      id: walkin.walkinId,
      guestName: walkin.guestName,
      phone: walkin.phone,
      email: walkin.email,
      partySize: walkin.partySize,
      arrivalTime: walkin.arrivalTime.toISOString(),
      estimatedWait: walkin.estimatedWait,
      status: walkin.status,
      priority: walkin.priority,
      specialRequests: walkin.specialRequests,
      preferredSeating: walkin.preferredSeating,
      notificationsSent: walkin.notificationsSent,
      lastNotified: walkin.lastNotified ? walkin.lastNotified.toISOString() : null,
      assignedTable: walkin.assignedTable,
      seatedAt: walkin.seatedAt ? walkin.seatedAt.toISOString() : null,
      leftAt: walkin.leftAt ? walkin.leftAt.toISOString() : null,
      notes: walkin.notes,
      source: walkin.source,
      allergies: walkin.allergies,
      loyaltyMember: walkin.loyaltyMember,
      previousVisits: walkin.previousVisits,
      createdAt: walkin.createdAt.toISOString(),
      updatedAt: walkin.updatedAt.toISOString()
    }));

    res.json(formattedWalkins);
  } catch (error) {
    console.error('Error fetching walk-ins:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/walkins - Add new walk-in guest
router.post('/', async (req, res) => {
  try {
    const { 
      guestName, 
      phone, 
      email, 
      partySize, 
      specialRequests, 
      preferredSeating, 
      priority = 'normal',
      allergies = [],
      notes = ''
    } = req.body;

    // Validate required fields
    if (!guestName || !phone || !partySize) {
      return res.status(400).json({ 
        error: 'Guest name, phone, and party size are required' 
      });
    }

    // Generate unique walk-in ID
    const walkinCount = await Walkin.countDocuments();
    const walkinId = `WI${String(walkinCount + 1).padStart(3, '0')}`;

    // Calculate estimated wait time based on current queue
    const currentQueue = await Walkin.countDocuments({ 
      status: { $in: ['waiting', 'called'] } 
    });
    const estimatedWait = Math.max(10, currentQueue * 8 + Math.floor(Math.random() * 10));

    const walkin = new Walkin({
      walkinId,
      guestName,
      phone,
      email,
      partySize,
      specialRequests: specialRequests || '',
      preferredSeating: preferredSeating || 'any',
      priority: priority || 'normal',
      estimatedWait,
      allergies: allergies || [],
      notes: notes || '',
      source: 'walk-in'
    });

    // Save the walk-in first
    const savedWalkin = await walkin.save();
    console.log('Walk-in saved successfully:', savedWalkin.walkinId);

    // Create notification (don't let this fail the whole operation)
    try {
      const notification = new Notification({
        type: 'walkin',
        message: `New walk-in guest added: ${guestName}`,
        details: `${guestName} - Party of ${partySize}, Estimated wait: ${estimatedWait} minutes`,
        relatedId: savedWalkin._id,
        relatedCollection: 'Walkins',
      });
      await notification.save();
    } catch (notificationError) {
      console.warn('Failed to save notification:', notificationError.message);
    }

    // Prepare response data
    const responseData = {
      id: savedWalkin.walkinId,
      guestName: savedWalkin.guestName,
      phone: savedWalkin.phone,
      email: savedWalkin.email,
      partySize: savedWalkin.partySize,
      arrivalTime: savedWalkin.arrivalTime.toISOString(),
      estimatedWait: savedWalkin.estimatedWait,
      status: savedWalkin.status,
      priority: savedWalkin.priority,
      specialRequests: savedWalkin.specialRequests,
      preferredSeating: savedWalkin.preferredSeating,
      notificationsSent: savedWalkin.notificationsSent,
      lastNotified: savedWalkin.lastNotified,
      assignedTable: savedWalkin.assignedTable,
      seatedAt: savedWalkin.seatedAt,
      leftAt: savedWalkin.leftAt,
      notes: savedWalkin.notes,
      source: savedWalkin.source,
      allergies: savedWalkin.allergies,
      loyaltyMember: savedWalkin.loyaltyMember,
      previousVisits: savedWalkin.previousVisits,
      createdAt: savedWalkin.createdAt.toISOString(),
      updatedAt: savedWalkin.updatedAt.toISOString()
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating walk-in:', error);
    
    // Provide specific error messages based on error type
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    } else if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate entry: Walk-in ID already exists'
      });
    } else if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
      return res.status(503).json({ 
        error: 'Database connection issue. Please try again in a moment.'
      });
    }
    
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

// PUT /api/walkins/:id/status - Update walk-in guest status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating walk-in status: ID=${id}, Status=${status}`);

    const walkin = await Walkin.findOne({ walkinId: id });
    if (!walkin) {
      console.log(`Walk-in guest not found: ${id}`);
      return res.status(404).json({ error: 'Walk-in guest not found' });
    }

    console.log(`Found walk-in: ${walkin.guestName} (${walkin.walkinId})`);

    // Update status and related timestamps
    walkin.status = status;
    
    if (status === 'seated') {
      walkin.seatedAt = new Date();
    } else if (status === 'left' || status === 'no-show') {
      walkin.leftAt = new Date();
    }

    await walkin.save();

    // Create notification for status updates
    if (['called', 'seated', 'left', 'no-show'].includes(status)) {
      const notification = new Notification({
        type: 'walkin',
        message: `Walk-in guest ${status}: ${walkin.guestName}`,
        details: `${walkin.guestName} - Party of ${walkin.partySize}`,
        relatedId: walkin._id,
        relatedCollection: 'Walkins',
      });
      await notification.save();
    }

    res.json({
      id: walkin.walkinId,
      guestName: walkin.guestName,
      phone: walkin.phone,
      email: walkin.email,
      partySize: walkin.partySize,
      arrivalTime: walkin.arrivalTime.toISOString(),
      estimatedWait: walkin.estimatedWait,
      status: walkin.status,
      priority: walkin.priority,
      specialRequests: walkin.specialRequests,
      preferredSeating: walkin.preferredSeating,
      notificationsSent: walkin.notificationsSent,
      lastNotified: walkin.lastNotified ? walkin.lastNotified.toISOString() : null,
      assignedTable: walkin.assignedTable,
      seatedAt: walkin.seatedAt ? walkin.seatedAt.toISOString() : null,
      leftAt: walkin.leftAt ? walkin.leftAt.toISOString() : null,
      notes: walkin.notes,
      source: walkin.source,
      allergies: walkin.allergies,
      loyaltyMember: walkin.loyaltyMember,
      previousVisits: walkin.previousVisits,
      createdAt: walkin.createdAt.toISOString(),
      updatedAt: walkin.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating walk-in status:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/walkins/:id/assign-table - Assign table to walk-in guest
router.put('/:id/assign-table', async (req, res) => {
  try {
    const { id } = req.params;
    const { tableId } = req.body;

    console.log(`Assigning table: Guest ID=${id}, Table ID=${tableId}`);

    const walkin = await Walkin.findOne({ walkinId: id });
    if (!walkin) {
      console.log(`Walk-in guest not found: ${id}`);
      return res.status(404).json({ error: 'Walk-in guest not found' });
    }

    const table = await Table.findOne({ tableId });
    if (!table) {
      console.log(`Table not found: ${tableId}`);
      return res.status(404).json({ error: 'Table not found' });
    }

    if (table.status !== 'available') {
      return res.status(400).json({ error: 'Table is not available' });
    }

    if (table.capacity < walkin.partySize) {
      return res.status(400).json({ error: 'Table capacity is insufficient for party size' });
    }

    // Update walk-in with table assignment
    walkin.assignedTable = tableId;
    walkin.status = 'seated';
    walkin.seatedAt = new Date();
    await walkin.save();

    // Update table status
    table.status = 'occupied';
    table.updatedAt = new Date();
    await table.save();

    // Create notification
    const notification = new Notification({
      type: 'walkin',
      message: `Walk-in guest seated: ${walkin.guestName}`,
      details: `${walkin.guestName} - Table ${tableId}, Party of ${walkin.partySize}`,
      relatedId: walkin._id,
      relatedCollection: 'Walkins',
    });
    await notification.save();

    res.json({
      id: walkin.walkinId,
      guestName: walkin.guestName,
      phone: walkin.phone,
      email: walkin.email,
      partySize: walkin.partySize,
      arrivalTime: walkin.arrivalTime.toISOString(),
      estimatedWait: walkin.estimatedWait,
      status: walkin.status,
      priority: walkin.priority,
      specialRequests: walkin.specialRequests,
      preferredSeating: walkin.preferredSeating,
      notificationsSent: walkin.notificationsSent,
      lastNotified: walkin.lastNotified ? walkin.lastNotified.toISOString() : null,
      assignedTable: walkin.assignedTable,
      seatedAt: walkin.seatedAt ? walkin.seatedAt.toISOString() : null,
      leftAt: walkin.leftAt ? walkin.leftAt.toISOString() : null,
      notes: walkin.notes,
      source: walkin.source,
      allergies: walkin.allergies,
      loyaltyMember: walkin.loyaltyMember,
      previousVisits: walkin.previousVisits,
      createdAt: walkin.createdAt.toISOString(),
      updatedAt: walkin.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error assigning table:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/walkins/:id/notify - Send notification to walk-in guest
router.put('/:id/notify', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Sending notification to guest: ID=${id}`);
    
    const walkin = await Walkin.findOne({ walkinId: id });
    if (!walkin) {
      console.log(`Walk-in guest not found: ${id}`);
      return res.status(404).json({ error: 'Walk-in guest not found' });
    }

    console.log(`Found walk-in for notification: ${walkin.guestName} (${walkin.walkinId})`);

    // Update notification count and timestamp
    walkin.notificationsSent += 1;
    walkin.lastNotified = new Date();
    await walkin.save();

    console.log(`Notification count updated: ${walkin.notificationsSent}`);

    // Create notification record
    const notification = new Notification({
      type: 'walkin',
      message: `Notification sent to: ${walkin.guestName}`,
      details: `${walkin.guestName} - Party of ${walkin.partySize}, Phone: ${walkin.phone}`,
      relatedId: walkin._id,
      relatedCollection: 'Walkins',
    });
    await notification.save();

    res.json({
      message: 'Notification sent successfully',
      notificationsSent: walkin.notificationsSent,
      lastNotified: walkin.lastNotified.toISOString()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/walkins/:id - Remove walk-in guest
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const walkin = await Walkin.findOne({ walkinId: id });
    if (!walkin) {
      return res.status(404).json({ error: 'Walk-in guest not found' });
    }

    // If guest was assigned a table, make it available again
    if (walkin.assignedTable) {
      await Table.updateOne(
        { tableId: walkin.assignedTable },
        { status: 'available', updatedAt: new Date() }
      );
    }

    await Walkin.deleteOne({ walkinId: id });
    
    res.json({ message: 'Walk-in guest removed successfully' });
  } catch (error) {
    console.error('Error removing walk-in guest:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/walkins/stats - Get walk-in statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await Walkin.aggregate([
      {
        $match: {
          arrivalTime: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgWaitTime: { $avg: '$estimatedWait' }
        }
      }
    ]);

    const totalWaiting = await Walkin.countDocuments({ status: 'waiting' });
    const totalCalled = await Walkin.countDocuments({ status: 'called' });
    
    // Calculate average and longest wait time for current queue
    const waitingGuests = await Walkin.find({ 
      status: { $in: ['waiting', 'called'] } 
    });
    
    const currentTime = new Date();
    const waitTimes = waitingGuests.map(guest => 
      Math.floor((currentTime - guest.arrivalTime) / 60000)
    );
    
    const avgWaitTime = waitTimes.length > 0 ? 
      Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0;
    const longestWait = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

    res.json({
      totalWaiting,
      totalCalled,
      avgWaitTime,
      longestWait,
      todayStats
    });
  } catch (error) {
    console.error('Error fetching walk-in stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/walkins/available-tables - Get available tables for walk-ins
router.get('/available-tables', async (req, res) => {
  try {
    const { partySize } = req.query;
    
    let query = { status: 'available' };
    if (partySize) {
      query.capacity = { $gte: parseInt(partySize) };
    }

    const tables = await Table.find(query).sort({ capacity: 1 });
    
    const formattedTables = tables.map(table => ({
      id: table.tableId,
      capacity: table.capacity,
      location: table.location,
      status: table.status,
      type: table.location.toLowerCase().includes('private') ? 'private' :
            table.location.toLowerCase().includes('window') ? 'window' :
            table.location.toLowerCase().includes('patio') ? 'outdoor' : 'regular',
      section: table.location
    }));

    res.json(formattedTables);
  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;