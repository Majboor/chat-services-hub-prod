
export const sanitizeCampaignName = (name: string): string => {
  if (!name) return '';
  return name.trim()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_-]/g, '') // Remove any characters that aren't alphanumeric, underscore, or hyphen
    .toLowerCase(); // Convert to lowercase for consistency
};
