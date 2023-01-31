import { UserPrivateKey } from "./index"

export const fetchUrl = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({UserPrivateKey: UserPrivateKey, toAddress: 'string', amount: 0})
    });
  
    if (!response.ok) {
      throw new Error(
        `Unable to fetch url": ${response.status} ${response.statusText}.`,
      );
    }
  
    const res = (await response.json()) as T;
  
    return res;
  };