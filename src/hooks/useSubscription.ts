import { useEffect, useState } from "react";

function useSubscription(subscribe: (v: any) => any, unsubscribe: (v: any) => any, getValue: any) {
    const [state, setState] = useState(getValue());
  
    useEffect(() => {
      const handlerChange = setState(getValue());
      subscribe(handlerChange);
      return () => unsubscribe(handlerChange);
    }, [getValue, subscribe, unsubscribe]);
  
    return state;
  }
  
  export default useSubscription;
  