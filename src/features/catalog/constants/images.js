export const PRODUCT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const PRODUCT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export function validateProductImage(file) {
  if (!file) return null;
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) return 'Usa una imagen JPG, PNG, WEBP o GIF.';
  if (file.size > PRODUCT_IMAGE_MAX_SIZE) return 'La imagen no puede superar los 5 MB.';
  return null;
}
