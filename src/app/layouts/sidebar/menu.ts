import { MenuItem } from './menu.model';
export const MENU: MenuItem[] = [
  // Itens iniciais (assumidos de versões anteriores)
  {
    id: 1,
    label: 'Menu',
    isTitle: true,
    parentId: 0,
  },
  {
    id: 2,
    label: 'Dashboard',
    icon: 'ti ti-brand-google-home',
    subItems: [
      {
        id: 3,
        label: 'Analytics',
        link: '/',
        parentId: 2,
      },
      {
        id: 5,
        label: 'Ecommerce',
        link: '/ecommerce',
        parentId: 2,
      },
    ],
  },
  // Seção Cadastros
  {
    id: 12,
    label: 'Cadastros',
    isTitle: true,
  },
  {
    id: 13,
    label: 'Centro de Custo',
    icon: 'ti ti-building-warehouse',
    link: '/pages/cadastros/centro-custo/lista',
    parentId: 12,
  },
  {
    id: 14,
    label: 'Grupo Financeiro',
    icon: 'ti ti-category',
    link: '/pages/cadastros/grupo-financeiro/lista',
    parentId: 12,
  },
  {
    id: 15,
    label: 'Rubricas',
    icon: 'ti ti-list-details',
    link: '/pages/cadastros/rubricas',
    parentId: 12,
  },
  {
    id: 16,
    label: 'Grupo Mensalidade',
    icon: 'ti ti-users-group',
    link: '/pages/cadastros/grupo-mensalidade/lista',
    parentId: 12,
  },
  {
    id: 17,
    label: 'Sócio',
    icon: 'ti ti-user',
    parentId: 12,
    subItems: [
      {
        id: 18,
        label: 'Listar',
        link: '/pages/cadastros/socio/lista',
        parentId: 17,
      },
      {
        id: 19,
        label: 'Cadastrar',
        link: '/pages/cadastros/socio/novo',
        parentId: 17,
      },
      {
        id: 20,
        label: 'Importar CSV',
        link: '/pages/cadastros/socio/importar',
        parentId: 17,
      },
    ],
  },
  {
    id: 21,
    label: 'Fornecedores',
    icon: 'ti ti-truck-delivery',
    link: '/pages/cadastros/fornecedores/lista',
    parentId: 12,
  },
  // Seção Cobranças
  {
    id: 24,
    label: 'Cobranças',
    isTitle: true,
  },
  {
    id: 25,
    label: 'Gerar Cobrança de Mensalidade',
    icon: 'ti ti-file-dollar',
    link: '/pages/cadastros/socio/gerar-cobrancas',
    parentId: 24,
  },
  {
    id: 30,
    label: 'Cobranças Outras Rubricas',
    icon: 'ti ti-file-invoice',
    parentId: 24,
    subItems: [
      {
        id: 31,
        label: 'Gerar Cobrança Individual Outras Rubricas',
        link: '/pages/cadastros/cobrancas/outras-rubricas-individual',
        parentId: 30,
      },
      {
        id: 32,
        label: 'Gerar Cobrança em Lote Outras Rubricas',
        link: '/pages/cadastros/cobrancas/outras-rubricas-lote',
        parentId: 30,
      },
    ],
  },
  // {
  //   id: 37,
  //   label: 'Cobranças Avulsas',
  //   icon: 'ti ti-file-dollar',
  //   link: '/pages/financeiro/cobrancas-avulsas/lista',
  //   parentId: 24,
  // },
  // Seção Financeiro
  {
    id: 33,
    label: 'Financeiro',
    isTitle: true,
  },
  {
    id: 34,
    label: 'Contas a Pagar',
    icon: 'ti ti-arrow-down-left',
    link: '/pages/financeiro/contas-a-pagar/lista',
    parentId: 33,
  },
  {
    id: 35,
    label: 'Contas a Receber',
    icon: 'ti ti-arrow-up-right',
    link: '/pages/financeiro/cobrancas-avulsas/lista',
    parentId: 33,
  },

  // Seção Transações
  {
    id: 167,
    label: 'Transações',
    icon: 'ti ti-exchange',
    parentId: 33,
    subItems: [
      {
        id: 168,
        label: 'Listar Transações',
        link: '/pages/financeiro/transacoes/listar',
        parentId: 167,
      },
      {
        id: 173,
        label: 'Transações de Crédito',
        link: '/pages/financeiro/transacoes/credito',
        parentId: 167,
      },
      {
        id: 174,
        label: 'Transações de Débito',
        link: '/pages/financeiro/transacoes/debito',
        parentId: 167,
      },
    ],
  },
  {
    id: 166,
    label: 'Upload OFX',
    icon: 'ti ti-upload',
    link: '/pages/financeiro/upload-ofx',
    parentId: 33,
  },
];
