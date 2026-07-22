export type CinematicDrawable = ImageBitmap | HTMLImageElement;

type CacheEntry = {
  drawable: CinematicDrawable;
  touched: number;
};

function isBitmap(drawable: CinematicDrawable): drawable is ImageBitmap {
  return typeof ImageBitmap !== "undefined" && drawable instanceof ImageBitmap;
}

async function decodeBlob(blob: Blob): Promise<CinematicDrawable> {
  if ("createImageBitmap" in window) return createImageBitmap(blob);

  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export class FrameStore {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly pending = new Map<string, Promise<CinematicDrawable>>();
  private clock = 0;

  constructor(private readonly capacity = 56) {}

  get(url: string) {
    const entry = this.cache.get(url);
    if (!entry) return null;
    entry.touched = ++this.clock;
    return entry.drawable;
  }

  async load(url: string, signal?: AbortSignal) {
    const cached = this.get(url);
    if (cached) return cached;
    const existing = this.pending.get(url);
    if (existing) return existing;

    const request = fetch(url, { signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Frame request failed: ${response.status} ${url}`);
        return response.blob();
      })
      .then(decodeBlob)
      .then((drawable) => {
        this.cache.set(url, { drawable, touched: ++this.clock });
        this.trim();
        return drawable;
      })
      .finally(() => this.pending.delete(url));

    this.pending.set(url, request);
    return request;
  }

  private trim() {
    while (this.cache.size > this.capacity) {
      let oldestUrl: string | null = null;
      let oldestTouch = Number.POSITIVE_INFINITY;
      for (const [url, entry] of this.cache) {
        if (entry.touched < oldestTouch) {
          oldestTouch = entry.touched;
          oldestUrl = url;
        }
      }
      if (!oldestUrl) return;
      const entry = this.cache.get(oldestUrl);
      if (entry && isBitmap(entry.drawable)) entry.drawable.close();
      this.cache.delete(oldestUrl);
    }
  }

  dispose() {
    for (const entry of this.cache.values()) {
      if (isBitmap(entry.drawable)) entry.drawable.close();
    }
    this.cache.clear();
    this.pending.clear();
  }
}
