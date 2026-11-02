import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/calculator_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// History Schema & Model
const historySchema = new mongoose.Schema({
  expression: { type: String, required: true },
  result: { type: Number, required: true }
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

// POST: Save a calculation
app.post('/api/calculate', async (req, res) => {
  try {
    const { expression, result } = req.body;
    if (!expression || result === undefined) {
      return res.status(400).json({ success: false, message: 'Expression and result are required' });
    }
    const entry = await History.create({ expression, result });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Fetch recent calculation history (last 20)
app.get('/api/history', async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Clear history
app.delete('/api/history', async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ success: true, message: 'History cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
