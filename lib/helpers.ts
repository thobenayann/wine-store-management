/**
 * Convertit un objet Date en un objet Date UTC.
 *
 * Cette fonction prend un objet Date local et retourne un nouvel objet Date
 * représentant la même date et heure en temps universel coordonné (UTC).
 *
 * @param {Date} date - L'objet Date à convertir en UTC.
 * @returns {Date} Un nouvel objet Date qui représente la date et l'heure en UTC.
 *
 * @example
 * // Si vous êtes dans le fuseau horaire UTC-5 et que la date locale est le 1er janvier 2023 à 10:15:30.150
 * const localDate = new Date(2023, 0, 1, 10, 15, 30, 150);
 * const utcDate = DateToUTCDate(localDate);
 * console.log(utcDate); // Affiche "2023-01-01T15:15:30.150Z" dans la console
 */
export function DateToUTCDate(date: Date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    );
}

/**
 * Formate une date en une chaîne lisible selon une locale spécifique.
 *
 * @param {Date} date - La date à formater.
 * @param {string} [locale='en-us'] - La locale utilisée pour le formatage de la date (par défaut : 'en-us').
 * @returns {string} - La date formatée en chaîne de caractères.
 */
export function formatDate(date: Date, locale: string = 'en-us'): string {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Traduit les statuts des commandes en français.
 *
 * @param {string} status - Le statut de la commande en anglais.
 * @returns {string} - Le statut de la commande en français.
 */
export function translateOrderStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
        PENDING: 'En attente',
        CONFIRMED: 'Confirmée',
        FULFILLED: 'Honorée',
        INVOICED: 'Facturée',
        CANCELLED: 'Annulée',
    };

    return statusTranslations[status] || status;
}