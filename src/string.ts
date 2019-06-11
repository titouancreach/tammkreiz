const map = {
  e: "éèêë",
  a: "àâä",
  i: "ïî",
  o: "ô",
  n: "ñ"
};

export function removeAccentOnChar(c: string) {
  return Object.entries(map).reduce((acc, currentPair) => {
    const [currentKey, currentValue] = currentPair;
    if (currentValue.includes(c)) {
      return currentKey;
    } else {
      return acc;
    }
  }, c);
}

export function removeAccents(s: string) {
  return [...s].map(removeAccentOnChar).join();
}
