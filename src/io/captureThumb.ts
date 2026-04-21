/**
 * Captura um thumbnail do canvas 3D principal e retorna um data URL PNG
 * redimensionado para `maxWidth` (preservando proporção). Retorna null se
 * nenhum canvas for encontrado ou se o navegador recusar a extração
 * (raro — acontece só com contextos tainted, que aqui não ocorrem).
 *
 * O thumbnail é pequeno (~6-15 KB) e seguro para armazenar no IndexedDB
 * junto com a cena — muito mais barato que renderizar cenas inteiras só
 * para construir a grade de "Meus salvos".
 */
export function captureThumb(maxWidth = 240): string | null {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return null;

  const srcW = canvas.width;
  const srcH = canvas.height;
  if (srcW === 0 || srcH === 0) return null;

  const scale = Math.min(1, maxWidth / srcW);
  const dstW = Math.round(srcW * scale);
  const dstH = Math.round(srcH * scale);

  const off = document.createElement('canvas');
  off.width = dstW;
  off.height = dstH;
  const ctx = off.getContext('2d');
  if (!ctx) return null;

  try {
    ctx.drawImage(canvas, 0, 0, dstW, dstH);
    return off.toDataURL('image/png');
  } catch {
    // toDataURL pode falhar em WebGL contexts without preserveDrawingBuffer
    // se a imagem já foi apresentada. Capturar imediatamente após render resolve.
    return null;
  }
}
