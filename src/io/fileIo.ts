export async function downloadText(
  text: string,
  filename: string
): Promise<'saved' | 'downloaded' | 'cancelled'> {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

  // File System Access API (Chromium)
  const anyWindow = window as unknown as {
    showSaveFilePicker?: (options: {
      suggestedName?: string;
      types?: Array<{ description?: string; accept: Record<string, string[]> }>;
    }) => Promise<FileSystemFileHandle>;
  };

  if (typeof anyWindow.showSaveFilePicker === 'function') {
    try {
      const handle = await anyWindow.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'LDraw multi-part document',
            accept: { 'text/plain': ['.mpd', '.ldr'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return 'saved';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
      // fall through to anchor fallback
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}

export function openFilePicker(): Promise<{ text: string; name: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mpd,.ldr,text/plain';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const text = await file.text();
      resolve({ text, name: file.name });
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}
