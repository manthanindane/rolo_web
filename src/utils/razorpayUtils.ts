interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay loaded');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Razorpay failed to load');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

interface InitPaymentParams {
  bookingFlow: any;
  onSuccess: (response: any) => void;
  onFailure: () => void;
}

export const initializePayment = async ({
  bookingFlow,
  onSuccess,
  onFailure
}: InitPaymentParams): Promise<void> => {
  if (!window.Razorpay) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      onFailure();
      return;
    }
  }

  const options: RazorpayOptions = {
    key: 'rzp_live_RHW97oiHDY3dQq',
    amount: Math.round(bookingFlow.estimatedPrice * 100),
    currency: 'INR',
    name: 'ROLO Rides',
    description: 'Ride booking',
    handler: onSuccess,
    prefill: {
      name: 'Customer',
      email: '[email protected]',
      contact: '9999999999'
    },
    theme: {
      color: '#00D1C1'
    },
    modal: {
      ondismiss: onFailure
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
