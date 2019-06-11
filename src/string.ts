// should cover most french + bretton
const map = {
  e: "éèêë",
  a: "àâä",
  i: "ïî",
  o: "ô",
  u: "ûù",
  n: "ñ"
};

type char = string;

function isLowercase(a: char) {
  return a.toLowerCase() === a;
}

function removeAccentOnChar(c: char): char {
  return Object.entries(map).reduce((acc, currentPair) => {
    const [currentKey, currentValue] = currentPair;
    if (currentValue.includes(c.toLowerCase())) {
      if (isLowercase(c)) {
        return currentKey;
      } else {
        return currentKey.toUpperCase();
      }
    } else {
      return acc;
    }
  }, c);
}

export function removeAccents(s: string) {
  return [...s].map(removeAccentOnChar).join("");
}
