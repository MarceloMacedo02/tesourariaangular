import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'ti ti-brand-google-home',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
                link: '/',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
                link: '/ecommerce',
                parentId: 2
            }
        ]
    },
    {
        id: 12,
        label: 'MENUITEMS.CADASTROS.TEXT',
        isTitle: true
    },
    {
        id: 13,
        label: 'MENUITEMS.CADASTROS.LIST.CENTROCUSTO',
        icon: 'ti ti-building-warehouse',
        link: '/pages/cadastros/centro-custo/lista',
        parentId: 12
    },
    {
        id: 14,
        label: 'MENUITEMS.CADASTROS.LIST.GRUPOFINANCEIRO',
        icon: 'ti ti-category',
        link: '/cadastros/grupo-financeiro',
        parentId: 12
    },
    {
        id: 15,
        label: 'MENUITEMS.CADASTROS.LIST.RUBRICAS',
        icon: 'ti ti-list-details',
        link: '/cadastros/rubricas',
        parentId: 12
    },
    {
        id: 16,
        label: 'MENUITEMS.CADASTROS.LIST.GRUPO_MENSALIDADE',
        icon: 'ti ti-users-group',
        link: '/cadastros/grupo-mensalidade',
        parentId: 12
    },
    {
        id: 17,
        label: 'MENUITEMS.CADASTROS.LIST.SOCIO',
        icon: 'ti ti-user',
        parentId: 12,
        subItems: [
            {
                id: 18,
                label: 'MENUITEMS.CADASTROS.LIST.SOCIO.LISTAR',
                link: '/cadastros/socio/listar',
                parentId: 17
            },
            {
                id: 19,
                label: 'MENUITEMS.CADASTROS.LIST.SOCIO.IMPORTARCSV',
                link: '/cadastros/socio/importar',
                parentId: 17
            }
        ]
    },
    {
        id: 20,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 21,
        label: 'MENUITEMS.APPS.LIST.CALENDAR',
        icon: 'ti ti-calendar',
        link: '/apps/calendar',
        parentId: 20
    },
    {
        id: 22,
        label: 'MENUITEMS.APPS.LIST.CHAT',
        icon: 'ti ti-messages',
        link: '/apps/chat',
        parentId: 20
    },
    {
        id: 23,
        label: 'MENUITEMS.APPS.LIST.EMAIL',
        icon: 'ti ti-mail',
        link: '/apps/email',
        parentId: 20,
    },
    {
        id: 24,
        label: 'MENUITEMS.APPS.LIST.FILEMANAGER',
        icon: 'ti ti-folders',
        link: '/apps/file-manager',
        parentId: 20,
    },
    {
        id: 25,
        label: 'MENUITEMS.APPS.LIST.TODO',
        icon: 'ti ti-list',
        link: '/apps/to-do',
        parentId: 20,
    },
    {
        id: 26,
        label: 'MENUITEMS.APPS.LIST.CONTACTS',
        icon: 'ti ti-address-book',
        link: '/apps/contacts',
        parentId: 20,
    },
    {
        id: 27,
        label: 'MENUITEMS.APPS.LIST.KANBANBOARD',
        icon: 'ti ti-subtask',
        link: '/apps/kanbanboard',
        parentId: 20,
    },
    {
        id: 39,
        label: 'MENUITEMS.APPS.LIST.INVOICES',
        icon: 'ti ti-file-invoice',
        parentId: 20,
        subItems: [
            {
                id: 40,
                label: 'MENUITEMS.APPS.LIST.LISTVIEW',
                link: '/invoices/list',
                parentId: 39
            },
            {
                id: 41,
                label: 'MENUITEMS.APPS.LIST.OVERVIEW',
                link: '/invoices/overview',
                parentId: 39
            },
            {
                id: 42,
                label: 'MENUITEMS.APPS.LIST.CREATEINVOICE',
                link: '/invoices/create',
                parentId: 39
            }
        ]
    },
    {
        id: 50,
        label: 'MENUITEMS.PAGES.TEXT',
        isTitle: true
    },
    {
        id: 51,
        label: 'MENUITEMS.AUTHENTICATION.TEXT',
        icon: 'ti ti-user-circle',
        subItems: [
            {
                id: 52,
                label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNIN',
                link: '/auth/signin',
                parentId: 51,
            },
            {
                id: 53,
                label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNUP',
                link: '/auth/signup',
                parentId: 51,
            },
            {
                id: 54,
                label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDRESET',
                link: '/auth/pass-reset',
                parentId: 51,
            },
            {
                id: 55,
                label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDCREATE',
                link: '/auth/pass-change',
                parentId: 51,
            },
            {
                id: 56,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                link: '/auth/lockscreen',
                parentId: 51
            },
            {
                id: 57,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
                link: '/auth/logout',
                parentId: 51
            },
            {
                id: 58,
                label: 'MENUITEMS.AUTHENTICATION.LIST.SUCCESSMESSAGE',
                link: '/auth/success-msg',
                parentId: 51
            },
            {
                id: 59,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                link: '/auth/twostep',
                parentId: 51
            },
            {
                id: 60,
                label: 'MENUITEMS.AUTHENTICATION.LIST.ERRORS',
                parentId: 51,
                subItems: [
                    {
                        id: 61,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.404ERROR',
                        link: '/auth/404',
                        parentId: 60
                    },
                    {
                        id: 62,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.500',
                        link: '/auth/500',
                        parentId: 60
                    },
                    {
                        id: 64,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.OFFLINE',
                        link: '/auth/offline',
                        parentId: 60
                    },
                ]
            },
        ]
    },
    {
        id: 65,
        label: 'MENUITEMS.EXTRAPAGES.TEXT',
        icon: 'ti ti-brand-adobe',
        subItems: [
            {
                id: 66,
                label: 'MENUITEMS.EXTRAPAGES.LIST.STARTER',
                link: '/pages/starter',
                parentId: 65
            },
            {
                id: 67,
                label: 'MENUITEMS.EXTRAPAGES.LIST.PROFILE',
                link: '/pages/profile',
                parentId: 65,
            },
            {
                id: 68,
                label: 'MENUITEMS.EXTRAPAGES.LIST.PROFILESETTINGS',
                link: '/pages/profile-settings',
                parentId: 65,
            },
            {
                id: 70,
                label: 'MENUITEMS.EXTRAPAGES.LIST.TIMELINE',
                link: '/pages/timeline',
                parentId: 65
            },
            {
                id: 71,
                label: 'MENUITEMS.EXTRAPAGES.LIST.FAQS',
                link: '/pages/faqs',
                parentId: 65
            },
            {
                id: 72,
                label: 'MENUITEMS.EXTRAPAGES.LIST.PRICING',
                link: '/pages/pricing',
                parentId: 65
            },
            {
                id: 73,
                label: 'MENUITEMS.EXTRAPAGES.LIST.MAINTENANCE',
                link: '/pages/maintenance',
                parentId: 65
            },
            {
                id: 74,
                label: 'MENUITEMS.EXTRAPAGES.LIST.COMINGSOON',
                link: '/pages/coming-soon',
                parentId: 65
            },
            {
                id: 75,
                label: 'MENUITEMS.EXTRAPAGES.LIST.PRIVACYPOLICY',
                link: '/pages/privacy-policy',
                parentId: 65
            },
            {
                id: 76,
                label: 'MENUITEMS.EXTRAPAGES.LIST.TERMS&CONDITIONS',
                link: '/pages/term-conditions',
                parentId: 65
            }
        ]
    },
    {
        id: 77,
        label: 'MENUITEMS.COMPONENTS.TEXT',
        isTitle: true
    },
    {
        id: 78,
        label: 'MENUITEMS.BOOTSTRAPUI1.TEXT',
        icon: "ti ti-atom",
        subItems: [
            {
                id: 79,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.ALERTS',
                link: '/ui/alerts',
                parentId: 78
            },
            {
                id: 80,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.BADGES',
                link: '/ui/badges',
                parentId: 78
            },
            {
                id: 81,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.BUTTONS',
                link: '/ui/buttons',
                parentId: 78
            },
            {
                id: 82,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.COLORS',
                link: '/ui/colors',
                parentId: 78
            },
            {
                id: 83,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.CARDS',
                link: '/ui/cards',
                parentId: 78
            },
            {
                id: 84,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.CAROUSEL',
                link: '/ui/carousel',
                parentId: 78
            },
            {
                id: 85,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.DROPDOWNS',
                link: '/ui/dropdowns',
                parentId: 78
            },
            {
                id: 86,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.GRID',
                link: '/ui/grid',
                parentId: 78
            },
            {
                id: 87,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.IMAGES',
                link: '/ui/images',
                parentId: 78
            },
            {
                id: 88,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.TABS',
                link: '/ui/tabs',
                parentId: 78
            },
            {
                id: 89,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.ACCORDION&COLLAPSE',
                link: '/ui/accordions',
                parentId: 78
            },
            {
                id: 90,
                label: 'MENUITEMS.BOOTSTRAPUI1.LIST.MODALS',
                link: '/ui/modals',
                parentId: 78
            },
        ]
    },
    {
        id: 91,
        label: 'MENUITEMS.BOOTSTRAPUI2.TEXT',
        icon: "ti ti-atom",
        subItems: [
            {
                id: 92,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.MEDIAOBJECT',
                link: '/ui/media',
                parentId: 91
            },
            {
                id: 93,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.EMBEDVIDEO',
                link: '/ui/embed-video',
                parentId: 91
            },
            {
                id: 94,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.TYPOGRAPHY',
                link: '/ui/typography',
                parentId: 91
            },
            {
                id: 95,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.LISTS',
                link: '/ui/lists',
                parentId: 91
            },
            {
                id: 96,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.LINKS',
                link: '/ui/links',
                parentId: 91
            },
            {
                id: 97,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.GENERAL',
                link: '/ui/general',
                parentId: 91
            },
            {
                id: 98,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.UTILITIES',
                link: '/ui/utilities',
                parentId: 91
            },
            {
                id: 99,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.OFFCANVAS',
                link: '/ui/offcanvas',
                parentId: 91
            },
            {
                id: 100,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.PLACEHOLDERS',
                link: '/ui/placeholders',
                parentId: 91
            },
            {
                id: 101,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.PROGRESS',
                link: '/ui/progress',
                parentId: 91
            },
            {
                id: 102,
                label: 'MENUITEMS.BOOTSTRAPUI2.LIST.NOTIFICATIONS',
                link: '/ui/notifications',
                parentId: 91
            }
        ]
    },
    {
        id: 103,
        label: 'MENUITEMS.ADVANCEUI.TEXT',
        icon: "ti ti-bat",
        subItems: [
            {
                id: 104,
                label: 'MENUITEMS.ADVANCEUI.LIST.SWEETALERTS',
                link: '/advance-ui/sweetalerts',
                parentId: 103
            },
            {
                id: 105,
                label: 'MENUITEMS.ADVANCEUI.LIST.SCROLLBAR',
                link: '/advance-ui/scrollbar',
                parentId: 103
            },
            {
                id: 106,
                label: 'MENUITEMS.ADVANCEUI.LIST.SWIPERSLIDER',
                link: '/advance-ui/swiper',
                parentId: 103
            },
            {
                id: 107,
                label: 'MENUITEMS.ADVANCEUI.LIST.RATTINGS',
                link: '/advance-ui/ratings',
                parentId: 103
            },
            {
                id: 108,
                label: 'MENUITEMS.ADVANCEUI.LIST.HIGHLIGHT',
                link: '/advance-ui/highlight',
                parentId: 103
            },
            {
                id: 109,
                label: 'MENUITEMS.ADVANCEUI.LIST.SCROLLSPY',
                link: '/advance-ui/scrollspy',
                parentId: 103
            }
        ]
    },
    {
        id: 110,
        label: 'MENUITEMS.WIDGETS.TEXT',
        icon: "ti ti-bow",
        link: '/apps/widgets'
    },
    {
        id: 111,
        label: 'MENUITEMS.FORMS.TEXT',
        icon: 'ti ti-file-stack',
        subItems: [
            {
                id: 112,
                label: 'MENUITEMS.FORMS.LIST.BASICELEMENTS',
                link: '/forms/elements',
                parentId: 111
            },
            {
                id: 113,
                label: 'MENUITEMS.FORMS.LIST.FORMSELECT',
                link: '/forms/select',
                parentId: 111
            },
            {
                id: 114,
                label: 'MENUITEMS.FORMS.LIST.CHECKBOXS&RADIOS',
                link: '/forms/checkboxs-radios',
                parentId: 111
            },
            {
                id: 115,
                label: 'MENUITEMS.FORMS.LIST.PICKERS',
                link: '/forms/pickers',
                parentId: 111
            },
            {
                id: 116,
                label: 'MENUITEMS.FORMS.LIST.INPUTMASKS',
                link: '/forms/masks',
                parentId: 111
            },
            {
                id: 117,
                label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                link: '/forms/advanced',
                parentId: 111
            },
            {
                id: 118,
                label: 'MENUITEMS.FORMS.LIST.RANGESLIDER',
                link: '/forms/range-sliders',
                parentId: 111
            },
            {
                id: 119,
                label: 'MENUITEMS.FORMS.LIST.VALIDATION',
                link: '/forms/validation',
                parentId: 111
            },
            {
                id: 120,
                label: 'MENUITEMS.FORMS.LIST.WIZARD',
                link: '/forms/wizard',
                parentId: 111
            },
            {
                id: 121,
                label: 'MENUITEMS.FORMS.LIST.EDITORS',
                link: '/forms/editors',
                parentId: 111
            },
            {
                id: 122,
                label: 'MENUITEMS.FORMS.LIST.FILEUPLOADS',
                link: '/forms/file-uploads',
                parentId: 111
            },
            {
                id: 123,
                label: 'MENUITEMS.FORMS.LIST.FORMLAYOUTS',
                link: '/forms/layouts',
                parentId: 111
            }
        ]
    },
    {
        id: 124,
        label: 'MENUITEMS.TABLES.TEXT',
        icon: 'ti ti-brand-airtable',
        subItems: [
            {
                id: 125,
                label: 'MENUITEMS.TABLES.LIST.BASICTABLES',
                link: '/tables/basic',
                parentId: 124
            },
            {
                id: 126,
                label: 'MENUITEMS.TABLES.LIST.GRIDJS',
                link: '/tables/gridjs',
                parentId: 124
            },
            {
                id: 127,
                label: 'MENUITEMS.TABLES.LIST.LISTJS',
                link: '/tables/listjs',
                parentId: 124
            }
        ]
    },
    {
        id: 128,
        label: 'MENUITEMS.CHARTS.TEXT',
        icon: 'ti ti-chart-donut',
        subItems: [
            {
                id: 129,
                label: 'MENUITEMS.CHARTS.LIST.LINE',
                link: '/charts/apex-line',
                parentId: 128
            },
            {
                id: 130,
                label: 'MENUITEMS.CHARTS.LIST.AREA',
                link: '/charts/apex-area',
                parentId: 128
            },
            {
                id: 131,
                label: 'MENUITEMS.CHARTS.LIST.COLUMN',
                link: '/charts/apex-column',
                parentId: 128
            },
            {
                id: 132,
                label: 'MENUITEMS.CHARTS.LIST.BAR',
                link: '/charts/apex-bar',
                parentId: 128
            },
            {
                id: 133,
                label: 'MENUITEMS.CHARTS.LIST.MIXED',
                link: '/charts/apex-mixed',
                parentId: 128
            },
            {
                id: 134,
                label: 'MENUITEMS.CHARTS.LIST.TIMELINE',
                link: '/charts/apex-timeline',
                parentId: 128
            },
            {
                id: 135,
                label: 'MENUITEMS.CHARTS.LIST.CANDLSTICK',
                link: '/charts/apex-candlestick',
                parentId: 128
            },
            {
                id: 136,
                label: 'MENUITEMS.CHARTS.LIST.BOXPLOT',
                link: '/charts/apex-boxplot',
                parentId: 128
            },
            {
                id: 137,
                label: 'MENUITEMS.CHARTS.LIST.BUBBLE',
                link: '/charts/apex-bubble',
                parentId: 128
            },
            {
                id: 138,
                label: 'MENUITEMS.CHARTS.LIST.SCATTER',
                link: '/charts/apex-scatter',
                parentId: 128
            },
            {
                id: 139,
                label: 'MENUITEMS.CHARTS.LIST.HEATMAP',
                link: '/charts/apex-heatmap',
                parentId: 128
            },
            {
                id: 140,
                label: 'MENUITEMS.CHARTS.LIST.TREEMAP',
                link: '/charts/apex-treemap',
                parentId: 128
            },
            {
                id: 141,
                label: 'MENUITEMS.CHARTS.LIST.PIE',
                link: '/charts/apex-pie',
                parentId: 128
            },
            {
                id: 142,
                label: 'MENUITEMS.CHARTS.LIST.RADIALBAR',
                link: '/charts/apex-radialbar',
                parentId: 128
            },
            {
                id: 143,
                label: 'MENUITEMS.CHARTS.LIST.RADAR',
                link: '/charts/apex-radar',
                parentId: 128
            },
            {
                id: 144,
                label: 'MENUITEMS.CHARTS.LIST.POLARAREA',
                link: '/charts/apex-polar',
                parentId: 128
            },
        ]
    },
    {
        id: 145,
        label: 'MENUITEMS.ICONS.TEXT',
        icon: 'ti ti-triangle-square-circle',
        subItems: [
            {
                id: 146,
                label: 'MENUITEMS.ICONS.LIST.REMIX',
                link: '/icons/remix',
                parentId: 145
            },
            {
                id: 147,
                label: 'MENUITEMS.ICONS.LIST.BOOTSTRAP',
                link: '/icons/bootstrap',
                parentId: 145
            },
            {
                id: 148,
                label: 'MENUITEMS.ICONS.LIST.PHOSPHOR',
                link: '/icons/phosphor',
                parentId: 145
            },

        ]
    },
    {
        id: 149,
        label: 'MENUITEMS.MAPS.TEXT',
        icon: 'ti ti-map',
        subItems: [
            {
                id: 150,
                label: 'MENUITEMS.MAPS.LIST.GOOGLE',
                link: '/maps/google',
                parentId: 149
            },
            {
                id: 151,
                label: 'MENUITEMS.MAPS.LIST.LEAFLET',
                link: '/maps/leaflet',
                parentId: 149
            }
        ]
    },
    {
        id: 152,
        label: 'MENUITEMS.MULTILEVEL.TEXT',
        icon: 'ti ti-brand-stackshare',
        subItems: [
            {
                id: 153,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
                parentId: 152
            },
            {
                id: 154,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
                parentId: 152,
                subItems: [
                    {
                        id: 155,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
                        parentId: 154
                    },
                    {
                        id: 156,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
                        parentId: 154,
                        subItems: [
                            {
                                id: 157,
                                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.LEVEL3.1',
                                parentId: 156
                            },
                            {
                                id: 158,
                                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.LEVEL3.2',
                                parentId: 156,

                            }
                        ]
                    }
                ]
            }
        ]
    }
]