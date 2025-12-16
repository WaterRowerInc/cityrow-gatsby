export async function expectThrows(func: Function, ErrorClass) {
  await expect(func()).rejects.toThrowError(ErrorClass);
}
