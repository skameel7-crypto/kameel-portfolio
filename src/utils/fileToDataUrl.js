// Firestore document limit is 1 MB. Base64 inflates ~33%, so 500 KB
// raw → ~670 KB stored, safely under the limit with room for other fields.
const DEFAULT_MAX_BYTES = 500 * 1024;

export function fileToDataUrl(file, maxBytes = DEFAULT_MAX_BYTES) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (file.size > maxBytes) {
      const kb = Math.round(maxBytes / 1024);
      reject(new Error(`File is too large. Please use a file under ${kb} KB.`));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the file."));

    reader.readAsDataURL(file);
  });
}