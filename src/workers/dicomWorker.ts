import * as dicomParser from 'dicom-parser';

self.onmessage = async (e) => {
  const file = e.data;
  const arrayBuffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);

  let metadata: Record<string, string> = {};

  try {
    const dataSet = dicomParser.parseDicom(byteArray);
    metadata = {
      'Patient Name': dataSet.string('x00100010') || 'Unknown',
      'Study Description': dataSet.string('x00081030') || 'Unknown',
      'Modality': dataSet.string('x00080060') || 'Unknown',
    };
  } catch (error) {
    metadata = { error: 'Failed to parse DICOM' };
  }

  self.postMessage({ metadata });
};
