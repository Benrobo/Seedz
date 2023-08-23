import React from "react";

function useIsRendered(timer?: number) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setLoading(true);
    }, (timer as number) * 1000 ?? 2000);
  });

  return loading;
}

export default useIsRendered;
