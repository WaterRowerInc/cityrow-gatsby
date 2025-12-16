import React from "react";
import clsx from "classnames";
import "./AlertMessage.scss";

interface AlertProps {
  children: React.ReactNode;
  type: "error" | "success";
  timeout: number;
}

interface AlertState {
  hidden: boolean;
}

let timeoutTracker: number | undefined;

function AlertMessage({ timeout, children, type }: AlertProps) {
  const [hidden, setHidden] = React.useState(false);

  function hide() {
    setHidden(true);
  }

  React.useEffect(() => {
    timeoutTracker = window.setTimeout(hide, timeout);
    return () => {
      if (timeoutTracker) {
        window.clearTimeout(timeoutTracker);
      }
    };
  }, []);

  return (
    <div
      className={clsx(`alert-messages__alert alert-messages__alert--${type}`, {
        "alert-messages__alert--hidden": hidden,
      })}
    >
      {children}
    </div>
  );
}

export default AlertMessage;
