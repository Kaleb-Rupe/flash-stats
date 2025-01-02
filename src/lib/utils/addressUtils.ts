interface FormattedAddress {
  formattedAddress: string;
  copyToClipboard: () => void;
}

export const formatAddress = (address: string): FormattedAddress => {
  if (!address || address.length < 4) {
    return { formattedAddress: address, copyToClipboard: () => {} }; // Return a default object
  }

  const formattedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        console.log("Address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return { formattedAddress, copyToClipboard };
};
