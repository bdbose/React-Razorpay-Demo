import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { ReactComponent as Banner } from './banner.svg';

function App() {
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (!res) {
      alert('Are you online?');
      return;
    }

    const result = await axios.post(
      'https://payment-razorpay.herokuapp.com/payment/orders',
    );

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: 'rzp_test_z4oAp899eFBusu',
      amount: amount.toString(),
      currency: currency,
      name: 'BoseCode',
      description: 'Buy me a pizza!',
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(
          'https://payment-razorpay.herokuapp.com/payment/success',
          data,
        );

        alert(result.data.msg);
      },
      prefill: {
        name: 'Bidipto Bose',
        email: 'bdbose123@gmail.com',
        contact: '8017077650',
      },
      notes: {
        address: 'BoseCode',
      },
      theme: {
        color: '#61dafb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className='App'>
      <div className='display-wrapper'>
        <div className='left-wrapper'>
          <Banner />
        </div>
        <div className='right-wrapper'>
          <h1>Buy me a Pizza 🍕</h1>
          <span>
            Hey, I am Bidipto Bose this is a test Razorpay Payment Gateway.
            Please dont use this. If you lose money we are not in fault.
          </span>
          <div className='price-wrapper'>
            <h3>Total:</h3>
            <span>₹500</span>
          </div>
          <button onClick={displayRazorpay}>Buy a Pizza!</button>
        </div>
      </div>
    </div>
  );
}

export default App;
