import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true,
    parentId: 0,
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
        parentId: 2,
      },
      {
        id: 5,
        label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
        link: '/ecommerce',
        parentId: 2,
      },
    ],
  },
  {
    id: 12,
    label: 'MENUITEMS.CADASTROS.TEXT',
    isTitle: true,
  },
  {
    id: 13,
    label: 'MENUITEMS.CADASTROS.LIST.CENTROCUSTO',
    icon: 'ti ti-building-warehouse',
    link: '/pages/cadastros/centro-custo/lista',
    parentId: 12,
  },
  {
    id: 14,
    label: 'MENUITEMS.CADASTROS.LIST.GRUPOFINANCEIRO',
    icon: 'ti ti-category',
    link: '/pages/cadastros/grupo-financeiro/lista',
    parentId: 12,
  },
  {
    id: 15,
    label: 'MENUITEMS.CADASTROS.LIST.RUBRICAS',
    icon: 'ti ti-list-details',
    link: '/pages/cadastros/rubricas',
    parentId: 12,
  },
  {
    id: 16,
    label: 'MENUITEMS.CADASTROS.LIST.GRUPO_MENSALIDADE',
    icon: 'ti ti-users-group',
    link: '/pages/cadastros/grupo-mensalidade/lista',
    parentId: 12,
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
        link: '/pages/cadastros/socio/lista',
        parentId: 17,
      },
      {
        id: 19,
        label: 'MENUITEMS.CADASTROS.LIST.SOCIO.CADASTRAR',
        link: '/pages/cadastros/socio/novo',
        parentId: 17,
      },
      {
        id: 20,
        label: 'MENUITEMS.CADASTROS.LIST.SOCIO.IMPORTARCSV',
        link: '/pages/cadastros/socio/importar',
        parentId: 17,
      },
    ],
  },
  {
    id: 21,
    label: 'MENUITEMS.CADASTROS.LIST.FORNECEDOR',
    icon: 'ti ti-truck-delivery',
    link: '/pages/cadastros/fornecedores/lista',
    parentId: 12,
  },
  {
    id: 24,
    label: 'MENUITEMS.COBRANCAS.TEXT',
    isTitle: true,
  },
  {
    id: 25,
    label: 'MENUITEMS.CADASTROS.LIST.SOCIO.GERARCOBRANCAMENSALIDADE',
    icon: 'ti ti-file-dollar',
    link: '/pages/cadastros/socio/gerar-cobrancas',
    parentId: 24,
  },

  {
    id: 30,
    label: 'MENUITEMS.COBRANCAS.LIST.COBRANCASOUTRASRUBRICAS',
    icon: 'ti ti-file-invoice',
    parentId: 24,
    subItems: [
      {
        id: 31,
        label:
          'MENUITEMS.COBRANCAS.LIST.GERARCOBRANCASOUTRASRUBRICASINDIVIDUAL',
        link: '/pages/cadastros/cobrancas/outras-rubricas-individual',
        parentId: 30,
      },
      {
        id: 32,
        label: 'MENUITEMS.COBRANCAS.LIST.GERARCOBRANCASOUTRASRUBRICASLOTE',
        link: '/pages/cadastros/cobrancas/outras-rubricas-lote',
        parentId: 30,
      },
    ],
  },
  // {
  //   id: 37,
  //   label: 'MENUITEMS.COBRANCAS.LIST.COBRANCAS_AVULSAS',
  //   icon: 'ti ti-file-dollar',
  //   link: '/pages/financeiro/cobrancas-avulsas/lista',
  //   parentId: 24,
  // },
  {
    id: 33,
    label: 'MENUITEMS.FINANCEIRO.TEXT',
    isTitle: true,
  },
  {
    id: 34,
    label: 'MENUITEMS.FINANCEIRO.LIST.CONTAS_A_PAGAR',
    icon: 'ti ti-arrow-down-left',
    link: '/pages/financeiro/contas-a-pagar/lista',
    parentId: 33,
  },
  {
    id: 35,
    label: 'MENUITEMS.FINANCEIRO.LIST.CONTAS_A_RECEBER',
    icon: 'ti ti-arrow-up-right',
    link: '/pages/financeiro/cobrancas-avulsas/lista',
    parentId: 33,
  },
  {
    id: 36,
    label: 'MENUITEMS.FINANCEIRO.LIST.QUITAR_TRANSACOES',
    icon: 'ti ti-check-circle',
    link: '/pages/financeiro/quitar-transacoes',
    parentId: 33,
  },
  {
    id: 37,
    label: 'MENUITEMS.FINANCEIRO.LIST.QUITACAO_CREDITO',
    icon: 'ti ti-cash',
    link: '/pages/financeiro/quitacao-credito',
    parentId: 33,
  },
  {
    id: 166,
    label: 'MENUITEMS.FINANCEIRO.LIST.UPLOAD_OFX',
    icon: 'ti ti-upload',
    link: '/pages/financeiro/upload-ofx',
    parentId: 33,  // Corrigido: anteriormente tinha parentId 159 que não existe
  },
];
