import { set, get, del, clear } from 'idb-keyval';

const STORAGE_KEY = 'dicom-files';

export interface StoredDicom {
  name: string;
  file: File;
  timestamp: number;
}

export const saveDicom = async (file: File): Promise<void> => {
  try {
    const storedDicom: StoredDicom = {
      name: file.name,
      file,
      timestamp: Date.now(),
    };
    await set(file.name, storedDicom);
  } catch (error) {
    console.error('Error saving DICOM file:', error);
    throw new Error('Failed to save DICOM file');
  }
};

export const getDicom = async (name: string): Promise<File | undefined> => {
  try {
    const storedDicom = await get<StoredDicom>(name);
    return storedDicom?.file;
  } catch (error) {
    console.error('Error retrieving DICOM file:', error);
    throw new Error('Failed to retrieve DICOM file');
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear storage');
  }
};

export const deleteDicom = async (name: string): Promise<void> => {
  try {
    await del(name);
  } catch (error) {
    console.error('Error deleting DICOM file:', error);
    throw new Error('Failed to delete DICOM file');
  }
};
