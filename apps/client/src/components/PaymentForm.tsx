'use client';

import useCartStore from '@/stores/cartStore';
import { ShippingFormInputs } from '@/types';
import { useAuth } from '@clerk/nextjs';
import { AlertCircle, ArrowLeft, ShoppingCartIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentFormProps {
  shippingData?: ShippingFormInputs;
}

const PaymentForm = ({ shippingData }: PaymentFormProps) => {
  const { getToken, userId, isLoaded } = useAuth();
  const { cart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal > 0 ? subtotal - 10 + 10 : 0;

  if (!shippingData) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          No shipping address provided yet. Please go back and complete step 2.
        </p>
        <button
          onClick={() => router.push('/cart?step=2')}
          className="text-xs font-medium text-gray-900 dark:text-gray-100 underline hover:opacity-80 cursor-pointer"
        >
          Return to Shipping Address
        </button>
      </div>
    );
  }

  const handleRazorpayPayment = async () => {
    if (!isLoaded || !userId) {
      toast.error('You must be logged in to make a payment.');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      // 1. Get Clerk Bearer Token
      const token = await getToken();

      if (!token) {
        throw new Error('Failed to retrieve authentication session. Please sign in again.');
      }

      // 2. Create PENDING Order in order-service (port 8001)
      const orderRes = await fetch('http://localhost:8001/user-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: shippingData.email,
          amount: totalAmount.toString(),
          products: cart,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create order on server.');
      }

      const orderData = await orderRes.json();

      // 3. Create Razorpay Session in payment-service (port 8002)
      const paymentRes = await fetch('http://localhost:8002/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: orderData.id,
        }),
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize payment gateway.');
      }

      const paymentData = await paymentRes.json();

      // 4. Open Razorpay Modal
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        name: 'KubeCart',
        description: `Order #${orderData.id}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: shippingData.name,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        theme: {
          color: '#111827',
        },
        handler: function (response: any) {
          toast.success('Payment successful! Redirecting to order status...');
          router.push(`/orders/${orderData.id}`);
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment window closed.');
          },
        },
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK failed to load. Please refresh.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Payment process failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* DELIVERY SUMMARY */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/60 flex flex-col gap-1.5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Delivery Address
          </h3>
          <button
            onClick={() => router.push('/cart?step=2')}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline cursor-pointer"
          >
            Edit
          </button>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {shippingData.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {shippingData.address}, {shippingData.city}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {shippingData.email} • {shippingData.phone}
        </p>
      </div>

      {/* NAVIGATION & ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/cart?step=2', { scroll: false })}
          className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 p-3.5 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Address
        </button>

        <button
          type="button"
          disabled={loading || !isLoaded || cart.length === 0}
          onClick={handleRazorpayPayment}
          className="flex-1 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 transition-all text-white p-3.5 rounded-lg cursor-pointer flex items-center justify-center gap-2 font-medium disabled:opacity-50 text-sm shadow-sm"
        >
          {loading ? (
            'Preparing Razorpay...'
          ) : (
            <>
              Pay ₹{totalAmount.toFixed(2)}
              <ShoppingCartIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
