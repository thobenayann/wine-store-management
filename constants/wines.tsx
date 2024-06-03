export const wineTypeLabels = {
    RED: 'rouge',
    WHITE: 'blanc',
    ROSE: 'rosé',
} as const;

export type WineType = keyof typeof wineTypeLabels;

export const getWineTypeLabel = (type: 'RED' | 'WHITE' | 'ROSE') => {
    return wineTypeLabels[type];
};

export const frenchWineRegions = [
    'Alsace',
    'Beaujolais',
    'Bordeaux',
    'Bourgogne',
    'Champagne',
    'Corse',
    'Jura',
    'Languedoc-Roussillon',
    'Loire Valley',
    'Lorraine',
    'Provence',
    'Rhône Valley',
    'Savoie',
    'Sud-Ouest',
].sort();

export const internationalWineRegions = [
    'Australie - Vallée de la Barossa',
    'Australie - Vallée de Hunter',
    'Chili - Vallée de Maipo',
    'Chili - Vallée de Colchagua',
    'Allemagne - Moselle',
    'Allemagne - Rheingau',
    'Italie - Toscane',
    'Italie - Piémont',
    'Nouvelle-Zélande - Marlborough',
    'Portugal - Vallée du Douro',
    'Afrique du Sud - Stellenbosch',
    'Espagne - Rioja',
    'Espagne - Priorat',
    'États-Unis - Vallée de Napa',
    'États-Unis - Vallée de Sonoma',
    'Argentine - Mendoza',
].sort();
