import mongoose from 'mongoose';
const PriceSchema = new mongoose.Schema({
  product: { type: String, index: true },
  price: Number,
  source: String,
  date: { type: Date, default: Date.now }
});
export default mongoose.model('PriceRecord', PriceSchema);
