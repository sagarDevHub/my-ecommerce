'use client';

import PaymentForm from '@/components/PaymentForm';
import ShippingForm from '@/components/ShippingForm';
import useCartStore from '@/stores/cartStore';
import { CartItemType, ShippingFormInputs } from '@/types';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const steps = [
  { id: 1, title: 'Shopping Cart' },
  { id: 2, title: 'Shipping Address' },
  { id: 3, title: 'Payment Method' },
];

const availableSizes = ['s', 'm', 'l', 'xl'];
const availableColors = ['gray', 'green', 'black', 'blue', 'white'];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const [mounted, setMounted] = useState(false);

  const activeStep = parseInt(searchParams.get('step') || '1');
  const { cart, removeFromCart, updateQuantity, updateVariant } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center mt-12 min-h-[50vh]">
        <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
        <p className="text-sm text-gray-400">Loading cart...</p>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12 mb-20 px-4">
      <h1 className="text-2xl font-medium">Your Shopping Cart</h1>

      {/* STEPS HEADER */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map(step => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep
                ? 'border-gray-800 dark:border-gray-200'
                : 'border-gray-300 dark:border-gray-700'
            }`}
            key={step.id}
          >
            <div
              className={`flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                step.id === activeStep
                  ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
                  : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-7/12 shadow-lg border border-gray-100 dark:border-gray-800 p-6 lg:p-8 rounded-xl flex flex-col gap-6 bg-white dark:bg-gray-900/60">
          {activeStep === 1 ? (
            cart.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Your cart is currently empty.
              </p>
            ) : (
              cart.map((item: CartItemType) => (
                <div
                  className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 last:border-none last:pb-0"
                  key={item.id + item.selectedSize + item.selectedColor}
                >
                  <div className="flex gap-6 items-center">
                    <div className="relative w-28 h-28 bg-gray-50 dark:bg-gray-800/80 rounded-lg overflow-hidden shrink-0 border border-gray-200/50 dark:border-gray-700/50">
                      <Image
                        src={
                          item.images?.[item.selectedColor] ||
                          item.images?.[Object.keys(item.images || {})[0] || ''] ||
                          ''
                        }
                        alt={item.name}
                        fill
                        sizes="120px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">{item.name}</p>

                      {/* SIZE & COLOR DROPDOWNS */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <label className="text-[11px] text-gray-400">Size:</label>
                          <select
                            value={item.selectedSize}
                            onChange={e => updateVariant(item, e.target.value, item.selectedColor)}
                            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 text-xs font-medium cursor-pointer text-gray-900 dark:text-gray-200 outline-none"
                          >
                            {(item.sizes || availableSizes).map((sz: string) => (
                              <option key={sz} value={sz}>
                                {sz.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <label className="text-[11px] text-gray-400">Color:</label>
                          <select
                            value={item.selectedColor}
                            onChange={e => updateVariant(item, item.selectedSize, e.target.value)}
                            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 text-xs font-medium cursor-pointer text-gray-900 dark:text-gray-200 outline-none capitalize"
                          >
                            {(item.colors || availableColors).map((clr: string) => (
                              <option key={clr} value={clr}>
                                {clr}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* QUANTITY BUTTONS */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">Qty:</span>
                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 py-0.5 min-w-5.5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-semibold mt-0.5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item)}
                    className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all text-red-500 flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <PaymentForm shippingData={shippingForm} />
          ) : (
            <div className="flex flex-col gap-4 items-start py-4">
              <p className="text-sm text-gray-500">
                Please fill out the shipping address to continue to payment.
              </p>
              <button
                onClick={() => router.push('/cart?step=2')}
                className="text-xs font-medium bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 cursor-pointer"
              >
                Go to Shipping Address
              </button>
            </div>
          )}
        </div>

        <div className="w-full lg:w-5/12 shadow-lg border border-gray-100 dark:border-gray-800 p-6 lg:p-8 rounded-xl flex flex-col gap-6 h-max bg-white dark:bg-gray-900/60">
          <h2 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-3">
            Cart Summary
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="font-medium">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">Discount (10%)</p>
              <p className="font-medium text-emerald-500">-${(subtotal > 0 ? 10 : 0).toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">Shipping Fee</p>
              <p className="font-medium">${(subtotal > 0 ? 10 : 0).toFixed(2)}</p>
            </div>
            <hr className="border-gray-200 dark:border-gray-800 my-1" />
            <div className="flex justify-between items-center text-base">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Total</p>
              <p className="font-bold text-lg">${subtotal.toFixed(2)}</p>
            </div>
          </div>

          {activeStep === 1 && (
            <button
              disabled={cart.length === 0}
              onClick={() => router.push('/cart?step=2', { scroll: false })}
              className="w-full bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 transition-all text-white p-3.5 rounded-lg cursor-pointer flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Continue to Shipping
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
