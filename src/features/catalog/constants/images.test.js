import { describe, expect, it } from 'vitest';
import { PRODUCT_IMAGE_MAX_SIZE, validateProductImage } from './images';

describe('validación de imágenes de producto', () => {
  it('acepta tipos permitidos dentro del límite', () => {
    expect(validateProductImage({ type: 'image/png', size: PRODUCT_IMAGE_MAX_SIZE })).toBeNull();
  });

  it('rechaza tipos no permitidos', () => {
    expect(validateProductImage({ type: 'application/pdf', size: 100 })).toMatch(/JPG/);
  });

  it('rechaza imágenes que superan 5 MB', () => {
    expect(validateProductImage({ type: 'image/jpeg', size: PRODUCT_IMAGE_MAX_SIZE + 1 })).toMatch(/5 MB/);
  });
});