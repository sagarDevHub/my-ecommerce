'use client';

import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, CheckCircle2, Clock, Package, ShoppingBag, Truck, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderProduct {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  images?: Record<string, string>;
}

interface OrderDetails {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  amount: string;
  email: string;
  createdAt: string;
  products: OrderProduct[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken, isLoaded, userId } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!isLoaded || !userId || !params.id) return;

      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:8001/user-orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Order not found or access denied.');
        }

        const data: OrderDetails = await res.json();
        setOrder(data);
      } catch (err: any) {
        console.error('Failed to fetch order tracking status:', err);
        setError(err.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [params.id, isLoaded, userId, getToken]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-400 gap-3">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        <p className="text-sm">Fetching tracking status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 rounded-xl text-center flex flex-col items-center gap-4">
        <XCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-lg font-bold">Order Not Found</h2>
        <p className="text-xs text-gray-500">{error || "We couldn't retrieve this order."}</p>
        <button
          onClick={() => router.push('/orders')}
          className="mt-2 text-xs bg-gray-900 text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg font-medium cursor-pointer"
        >
          View All Orders
        </button>
      </div>
    );
  }

  // Calculate timeline steps dynamically based on current status
  const currentStatus = order.status?.toLowerCase() || 'pending';

  const steps = [
    {
      label: 'Order Placed',
      icon: Clock,
      completed: true,
    },
    {
      label: 'Processing',
      icon: Package,
      completed: ['processing', 'shipped', 'delivered'].includes(currentStatus),
    },
    {
      label: 'On The Way',
      icon: Truck,
      completed: ['shipped', 'delivered'].includes(currentStatus),
    },
    {
      label: 'Delivered',
      icon: CheckCircle2,
      completed: currentStatus === 'delivered',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 flex flex-col gap-8">
      {/* HEADER NAV */}
      <button
        onClick={() => router.push('/orders')}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white self-start transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </button>

      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 lg:p-8 rounded-xl flex flex-col gap-8 shadow-sm">
        {/* ORDER HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-xl font-bold">Order Details & Status</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Order ID:{' '}
              <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">
                {order.id}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-gray-400">Status:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
              {order.status || 'PENDING'}
            </span>
          </div>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Live Shipment Tracker
          </h3>
          <div className="grid grid-cols-4 gap-2 my-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      s.completed
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORDERED PRODUCTS ITEM LIST */}
        <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Items in this order
          </h3>
          <div className="flex flex-col gap-4">
            {Array.isArray(order.products) &&
              order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-white dark:bg-gray-800 rounded-md overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                      {item.images ? (
                        <Image
                          src={
                            item.images[item.selectedColor] || Object.values(item.images)[0] || ''
                          }
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Size: <strong className="uppercase">{item.selectedSize}</strong> • Color:{' '}
                        <strong className="capitalize">{item.selectedColor}</strong>
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
          </div>
        </div>

        {/* TOTAL SUMMARY & FOOTER NAV */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-gray-500">Total Paid:</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">
              ${Number(order.amount).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/orders')}
              className="flex-1 sm:flex-none border border-gray-300 dark:border-gray-700 px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer text-center"
            >
              View All Orders
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="flex-1 sm:flex-none bg-gray-900 text-white dark:bg-white dark:text-black px-4 py-2.5 rounded-lg text-xs font-medium hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
