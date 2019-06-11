const map = {
  e: "éèêë",
  a: "àâä",
  i: "ïî",
  o: "ô",
  n: "ñ"
};

type char = string;

function removeAccentOnChar(c: char): char {
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
  return [...s].map(removeAccentOnChar).join("");
}
