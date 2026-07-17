export function phoneMask(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 13);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 4) {
    return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
  }

  if (numbers.length <= 9) {
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
  }

  return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(
    4,
    9
  )}-${numbers.slice(9)}`;
}