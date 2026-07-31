'use client';

import { Address, ShippingFormInputs, shippingFormSchema } from '@repo/types';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ShippingForm = ({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) => {
  const { getToken, userId, isLoaded } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema as any),
  });

  useEffect(() => {
    async function fetchAddresses() {
      if (!isLoaded || !userId) {
        setLoading(false);
        setShowAddNew(true);
        return;
      }

      try {
        const token = await getToken();
        const res = await fetch('http://localhost:8001/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch addresses');

        const data: Address[] = await res.json();
        setSavedAddresses(data || []);

        if (data && data.length > 0) {
          const lastUsed = data[0];
          if (lastUsed) {
            setSelectedAddressId(lastUsed.id);
            applyAddressToForm(lastUsed);
            setShowAddNew(false);
          }
        } else {
          setShowAddNew(true);
        }
      } catch (err) {
        setShowAddNew(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, [userId, isLoaded, getToken]);

  const applyAddressToForm = (addr: Address) => {
    setValue('name', addr.name);
    setValue('email', addr.email);
    setValue('phone', addr.phone);
    setValue('address', addr.address);
    setValue('city', addr.city);
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    applyAddressToForm(addr);
    setShowAddNew(false);
  };

  const onSubmit = async (data: ShippingFormInputs) => {
    if (showAddNew) {
      try {
        const token = await getToken();
        await fetch('http://localhost:8001/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.error('Failed to save address:', err);
      }
    }

    setShippingForm(data);
    router.push('/cart?step=3', { scroll: false });
  };

  if (loading) {
    return <div className="text-sm text-gray-400 py-4">Loading shipping addresses...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {savedAddresses.length > 0 && !showAddNew && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Select Delivery Address
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {savedAddresses.map((addr, idx) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                  selectedAddressId === addr.id
                    ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{addr.name}</p>
                    {idx === 0 && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                        Last Used
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-80">
                    {addr.address}, {addr.city}
                  </p>
                  <p className="text-xs opacity-60">{addr.phone}</p>
                </div>
                {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-white" />}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAddNew(true)}
            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline self-start mt-1 cursor-pointer"
          >
            + Add New Address
          </button>
        </div>
      )}

      {(showAddNew || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Enter Delivery Address
            </h3>
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddNew(false)}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Use Saved Address
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Full Name</label>
            <input
              className="border-b border-gray-300 dark:border-gray-700 bg-transparent py-2 text-sm outline-none"
              placeholder="John Doe"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Email</label>
            <input
              className="border-b border-gray-300 dark:border-gray-700 bg-transparent py-2 text-sm outline-none"
              placeholder="johndoe@gmail.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Phone</label>
            <input
              className="border-b border-gray-300 dark:border-gray-700 bg-transparent py-2 text-sm outline-none"
              placeholder="9876543210"
              {...register('phone')}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Address</label>
            <input
              className="border-b border-gray-300 dark:border-gray-700 bg-transparent py-2 text-sm outline-none"
              placeholder="123 Main St"
              {...register('address')}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">City</label>
            <input
              className="border-b border-gray-300 dark:border-gray-700 bg-transparent py-2 text-sm outline-none"
              placeholder="Mumbai"
              {...register('city')}
            />
            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => router.push('/cart?step=1', { scroll: false })}
              className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-3 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white dark:bg-white dark:text-black p-3 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all"
            >
              Save & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {!showAddNew && savedAddresses.length > 0 && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/cart?step=1', { scroll: false })}
            className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-3 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-gray-900 text-white dark:bg-white dark:text-black p-3 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all"
          >
            Use Address <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShippingForm;
