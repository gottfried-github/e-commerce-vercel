// see #config.js in readme
export const imageScaleTemplates = {
  // constrain original size to not exceed vercel blob 4.5MB size limit
  original: {
    width: 3600,
    height: null,
    options: {
      fit: 'inside',
      withoutEnlargement: true,
    },
  },
  other: [
    {
      suffix: 's',
      width: 800,
      height: null,
      options: {
        fit: 'inside',
        withoutEnlargement: true,
      },
    },
    {
      suffix: 'l',
      width: 1800,
      height: null,
      options: {
        fit: 'inside',
        withoutEnlargement: true,
      },
    },
  ],
}
