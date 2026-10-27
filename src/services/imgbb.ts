/**
 * Compresses an image using an HTML5 Canvas to WebP format.
 * Reduces dimension if wider/taller than maxDimension.
 */
export async function compressImageToWebP(
  file: File, 
  maxDimension = 1200, 
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', quality);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              // Fallback to dataUrl conversion
              resolve({ blob: new Blob([dataUrl]), dataUrl });
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to ImgBB API.
 * If apiKey is not provided or upload fails, falls back automatically to
 * a compressed DataURL (Base64 WebP) so that the user demo works 100% offline.
 */
export async function uploadToImgBB(
  file: File, 
  apiKey?: string
): Promise<{ url: string; isLocalFallback: boolean }> {
  try {
    // 1. Compress image to WebP first
    const { blob, dataUrl } = await compressImageToWebP(file);

    // 2. If no API key provided, use local dataUrl immediately
    if (!apiKey || apiKey.trim() === '') {
      return { url: dataUrl, isLocalFallback: true };
    }

    // 3. Prepare FormData for ImgBB
    const formData = new FormData();
    formData.append('image', blob, `${Date.now()}_brk_agro.webp`);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.warn(`ImgBB API responded with ${response.status}. Using local fallback preview.`);
      return { url: dataUrl, isLocalFallback: true };
    }

    const data = await response.json();
    if (data && data.data && data.data.url) {
      return { url: data.data.display_url || data.data.url, isLocalFallback: false };
    }

    return { url: dataUrl, isLocalFallback: true };
  } catch (err) {
    console.warn('Error during ImgBB upload, falling back to local compressed image', err);
    // Return a readable data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result as string, isLocalFallback: true });
      reader.onerror = () => resolve({ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', isLocalFallback: true });
      reader.readAsDataURL(file);
    });
  }
}
