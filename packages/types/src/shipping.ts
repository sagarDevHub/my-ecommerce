import { z } from 'zod';

export const shippingFormSchema = z.object({
  name: z.string().min(1, 'Name is required!'),
  email: z.string().min(1, 'Email is required!').email('Invalid email address!'),
  phone: z
    .string()
    .min(1, 'Phone number is required!')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits!'),
  address: z.string().min(1, 'Address is required!'),
  city: z.string().min(1, 'City is required!'),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export interface Address extends ShippingFormInputs {
  id: string;
  isDefault?: boolean;
}
