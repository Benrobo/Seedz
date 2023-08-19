import React from "react";

function useIsRendered() {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setLoading(true);
    }, 2000);
  });

  return loading;
}

export default useIsRendered;
