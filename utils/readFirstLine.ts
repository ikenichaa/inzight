export const readFirstLineOfFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const CHUNK_SIZE = 1024; // Read 1KB at a time
    const reader = new FileReader();
    let offset = 0;
    let firstLine = "";

    reader.onerror = () => reject(new Error("Error reading file"));

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target) return;
      const chunk = new Uint8Array(e.target.result as ArrayBuffer);
      for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === 10 || chunk[i] === 13) {
          // 10 is '\n', 13 is '\r'
          // We've found the end of the first line
          resolve(firstLine);
          return;
        }
        firstLine += String.fromCharCode(chunk[i]);
      }

      if (offset >= file.size) {
        // We've reached the end of the file without finding a newline
        resolve(firstLine);
      } else {
        // Read the next chunk
        offset += CHUNK_SIZE;
        readNextChunk();
      }
    };

    const readNextChunk = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    readNextChunk(); // Start reading
  });
};
