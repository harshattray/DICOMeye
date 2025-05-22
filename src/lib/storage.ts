import { set, get } from 'idb-keyval';

export const saveDicom = async (file: File) => {
  await set(file.name, file);
};

export const getDicom = async (name: string): Promise<File | undefined> => {
  return await get(name);
};
