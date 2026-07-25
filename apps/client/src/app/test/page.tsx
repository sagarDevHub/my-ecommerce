import { auth } from '@clerk/nextjs/server';

const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  // Order rotue test
  const resProduct = await fetch('http://localhost:8000/test', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const productData = await resProduct.json();
  console.log(productData);

  // Order rotue test
  const resOrder = await fetch('http://localhost:8001/test', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const orderData = await resOrder.json();
  console.log(orderData);

  // Payment rotue test
  const resPayment = await fetch('http://localhost:8002/test', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const paymentData = await resPayment.json();
  console.log(paymentData);
  return <div className="">Test Page</div>;
};

export default TestPage;
