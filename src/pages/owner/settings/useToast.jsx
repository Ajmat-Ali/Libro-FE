import { useState } from "react";

function useToast() {
  const [toast, setToast] = useState(null);
  const show = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };
  return [toast, show];
}

export default useToast;
