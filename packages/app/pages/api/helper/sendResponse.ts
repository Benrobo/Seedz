function sendResponse(data: any, isError?: boolean, message?: string) {
  return {
    error: isError,
    message,
    data,
  };
}
export default sendResponse;
