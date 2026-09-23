// Une clases CSS ignorando valores falsy.
export const cx = (...classes) => classes.filter(Boolean).join(' ');
