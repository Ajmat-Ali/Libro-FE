let scriptLoadingPromise = null;

/**
 * Loads the Razorpay checkout script exactly once, no matter how many
 * times this function is called (e.g. student opens/closes the modal
 * multiple times in one session).
 */
const loadRazorpayScript = () => {
  // Already loaded in a previous call
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  // Already in the process of loading — reuse the same promise
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptLoadingPromise = null; // allow retry on next attempt
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
};

export default loadRazorpayScript;
