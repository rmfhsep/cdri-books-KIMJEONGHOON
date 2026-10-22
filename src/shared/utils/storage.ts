/**
 * localStorage에 JSON으로 저장한 값을 읽는다.
 * @param key 저장 키.
 * @param fallback 저장된 값이 없거나 읽을 수 없을 때 사용할 기본값.
 * @returns 저장된 값 또는 기본값.
 * @example
 * const history = readStorage<string[]>("books.history", []);
 */
export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

/**
 * 값을 JSON으로 바꿔 localStorage에 저장한다. 저장 공간이 부족하거나 접근이 막혀 실패하면 무시한다.
 * @param key 저장 키.
 * @param value 저장할 값.
 * @example
 * writeStorage("books.history", history);
 */
export const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장하지 못해도 화면은 그대로 동작하고, 새로고침 후 값만 남지 않는다.
  }
};
