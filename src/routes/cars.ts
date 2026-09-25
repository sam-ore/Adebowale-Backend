import express, { Response } from 'express';
import multer from 'multer';
import Car from '../models/Car.js';
import { auth } from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/upload.js';
import { AuthRequest, CarFormData } from '../types/index.js';

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// GET all cars (public)
router.get('/', async (_req, res: Response): Promise<void> => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET one car (public)
router.get('/:id', async (req, res: Response): Promise<void> => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST add car (admin only)
router.post(
  '/',
  auth,
  upload.array('images', 10),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const body = req.body as CarFormData;
      const files = req.files as Express.Multer.File[];

      if (!body.make || !body.model || !body.year || !body.price) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Upload images to Cloudinary
      const imageUrls: string[] = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file.buffer);
          imageUrls.push(url);
        }
      }

      const car = new Car({
        make: body.make,
        model: body.model,
        year: Number(body.year),
        price: Number(body.price),
        condition: body.condition,
        fuelType: body.fuelType || 'petrol',
        transmission: body.transmission || 'automatic',
        mileage: body.mileage ? Number(body.mileage) : undefined,
        description: body.description,
        features: body.features ? JSON.parse(body.features) : [],
        images: imageUrls,
      });

      await car.save();

      res.status(201).json({
        message: 'Car added successfully!',
        car,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// PUT update car (admin only)
router.put(
  '/:id',
  auth,
  upload.array('images', 10),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const body = req.body as CarFormData;
      const files = req.files as Express.Multer.File[];

      const car = await Car.findById(req.params.id);
      if (!car) {
        res.status(404).json({ error: 'Car not found' });
        return;
      }

      // Handle images
      let imageUrls: string[] = body.existingImages
        ? JSON.parse(body.existingImages)
        : car.images;

      if (files && files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file.buffer);
          imageUrls.push(url);
        }
      }

      // Update fields
      if (body.make) car.make = body.make;
      if (body.model) {
  car.set('model', body.model);
}
      if (body.year) car.year = Number(body.year);
      if (body.price) car.price = Number(body.price);
      if (body.condition) car.condition = body.condition;
      if (body.fuelType) car.fuelType = body.fuelType;
      if (body.transmission) car.transmission = body.transmission;
      if (body.mileage) car.mileage = Number(body.mileage);
      if (body.description) car.description = body.description;
      if (body.features) car.features = JSON.parse(body.features);
      car.images = imageUrls;

      await car.save();

      res.json({
        message: 'Car updated successfully!',
        car,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// DELETE car (admin only)
router.delete(
  '/:id',
  auth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const car = await Car.findByIdAndDelete(req.params.id);
      if (!car) {
        res.status(404).json({ error: 'Car not found' });
        return;
      }
      res.json({ message: 'Car deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

export default router;