import { Request } from 'express';

export interface ICar {
  _id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: 'new' | 'used';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  mileage?: number;
  description: string;
  features: string[];
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdminPayload {
  email: string;
  role: 'admin';
}

export interface AuthRequest extends Request {
  admin?: IAdminPayload;
}

export interface CarFormData {
  make: string;
  model: string;
  year: string;
  price: string;
  condition: 'new' | 'used';
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'manual' | 'automatic';
  mileage?: string;
  description: string;
  features?: string;
  existingImages?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  error?: string;
}