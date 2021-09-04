const getErrorMessage = (err: { [key: string]: any }): string => {
  const defaultMessage = "An error has occurred!";
  if (err.errors && err.errors.length > 0) {
    return err.errors[0].message || defaultMessage;
  }
  if (err.message) {
    return err.message;
  }

  return defaultMessage;
};

export default getErrorMessage;
