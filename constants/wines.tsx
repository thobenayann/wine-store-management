export const wineTypeLabels = {
    RED: 'rouge',
    WHITE: 'blanc',
    ROSE: 'rosé',
} as const;

export type WineType = keyof typeof wineTypeLabels;

export const getWineTypeLabel = (type: 'RED' | 'WHITE' | 'ROSE') => {
    return wineTypeLabels[type];
};

export const frenchRegions = [
    'Auvergne-Rhône-Alpes',
    'Bourgogne-Franche-Comté',
    'Bretagne',
    'Centre-Val de Loire',
    'Corse',
    'Grand Est',
    'Hauts-de-France',
    'Île-de-France',
    'Normandie',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Pays de la Loire',
    "Provence-Alpes-Côte d'Azur",
].sort();
