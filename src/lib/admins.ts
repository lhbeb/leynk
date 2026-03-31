// List of admins who can create/manage profiles
export const ADMIN_NAMES = [
    'Mehdi',
    'Hmed',
    'Janah',
    'Jebbar',
    'Walid',
    'Amine',
    'Othman',
    'Youssef',
    'Abdo',
    'Yassine',
] as const;

export type AdminName = typeof ADMIN_NAMES[number];
