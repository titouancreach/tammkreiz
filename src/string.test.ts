import { removeAccents } from "./string";

test("should remove accents to a string", () => {
  // some random french words
  expect(removeAccents("été")).toBe("ete");
  expect(removeAccents("à")).toBe("a");
  expect(removeAccents("maïs")).toBe("mais");
  expect(removeAccents("août")).toBe("aout");
});

test("Should not transform a string if there is no accents in it", () => {
  expect(removeAccents("titouan")).toBe("titouan");
});

test("Should take the case into account", () => {
  expect(removeAccents("Été")).toBe("Ete");
  expect(removeAccents("ÉTÉ")).toBe("ETE");
  expect(removeAccents("été")).toBe("ete");
  expect(removeAccents("éTé")).toBe("eTe");
});
