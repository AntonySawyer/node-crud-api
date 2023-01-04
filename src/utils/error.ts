export const getRequiredErrorMessage = (fieldName: string): string => (
  `${fieldName} is required.`
);

export const getSomethingWrongWithFieldErrorMessage = (fieldName: string): string => (
  `Something is wrong with ${fieldName}`
);
