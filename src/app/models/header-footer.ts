/**
 * Models used in the app header and footer.
 */

export interface INavItem {
    label: string;
    link: string;
}

export interface IImageLink {
    src: string;
    href: string;
}

export interface ISocialLinks {
    facebook?: string;
    twitter?: string;
    youtube?: string;
}
