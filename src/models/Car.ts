import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { ICar } from '../types/index.js';

export type CarDocument = HydratedDocument<ICar>;

const carSchema = new Schema<ICar>(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },

    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1900,
      max: new Date().getFullYear() + 1,
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },

    condition: {
      type: String,
      enum: ['new', 'used'],
      required: [true, 'Condition is required'],
    },

    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      default: 'petrol',
    },

    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      default: 'automatic',
    },

    mileage: {
      type: Number,
      min: 0,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

carSchema.index({
  make: 'text',
  model: 'text',
  description: 'text',
});

const Car = mongoose.model<ICar>('Car', carSchema);

export default Car;