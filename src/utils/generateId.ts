import randint from './randint';

export default (
  length: number,
  alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ1234567890'
): string => {
  return Array.from(
    Array(length),
    () => alphabet[randint(0, alphabet.length)]
  ).join('');
};
