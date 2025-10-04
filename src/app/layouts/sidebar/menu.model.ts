export interface MenuItem {
    id?: number;
    label?: string;
    icon?: string;
    link?: string;
    subItems?: MenuItem[];
    isTitle?: boolean;
    badge?: {
        variant: string;
        text: string;
    };
    parentId?: number;
    isParent?: boolean;
    hidden?: boolean;
    isLayout?: boolean;
}