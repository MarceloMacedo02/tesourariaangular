import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoMensalidade, ItemRubricaMensalidade, Rubrica } from '../grupo-mensalidade.model';
import { GrupoMensalidadeService } from '../grupo-mensalidade.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo-mensalidade-form',
  templateUrl: './grupo-mensalidade-form.component.html',
  styleUrls: ['./grupo-mensalidade-form.component.scss']
})
export class GrupoMensalidadeFormComponent implements OnInit {
  // Objeto GrupoMensalidade com campos de uso exclusivo do backend (dataRegistro, dataAtualizacao, dataCriacao)
  // Estes campos são somente leitura no frontend e são gerenciados exclusivamente pelo backend
  grupoMensalidade: GrupoMensalidade = {
    nomeGrupoMensalidade: '',
    descricao: '',
    ativo: true,
    itensRubricaMensalidade: [],
    dataRegistro: undefined, // Campo de uso exclusivo do backend
    dataAtualizacao: undefined, // Campo de uso exclusivo do backend
    dataCriacao: undefined // Campo de uso exclusivo do backend
  };

  isEditing = false;
  loading = false;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;
  rubricas: Rubrica[] = []; // Lista de rubricas para o select
  selectedRubricaId: number | null = null; // Variável intermediária para controlar o valor do ng-select de rubrica
  newItem: ItemRubricaMensalidade = {
    rubricaId: 0,
    valor: 0,
    descricao: '',
    ativo: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grupoMensalidadeService: GrupoMensalidadeService
  ) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Novo Grupo de Mensalidade', active: true }
    ];

    // Carregar rubricas para o select
    this.loadRubricas().then(() => {
      // Após carregar as rubricas, verificar se é edição
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditing = true;
        this.breadCrumbItems[1] = { label: 'Editar Grupo de Mensalidade', active: true };
        this.loadGrupoMensalidade(parseInt(id, 10));
      }
    });
  }

  get valorTotal(): number {
    if (!this.grupoMensalidade.itensRubricaMensalidade || this.grupoMensalidade.itensRubricaMensalidade.length === 0) {
      return 0;
    }
    
    return this.grupoMensalidade.itensRubricaMensalidade.reduce((total, item) => {
      return total + (item.valor || 0);
    }, 0);
  }

  loadRubricas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.grupoMensalidadeService.getRubricas().subscribe({
        next: (data: Rubrica[]) => {
          this.rubricas = data;
          resolve();
        },
        error: (error: any) => {
          console.error('Erro ao carregar rubricas:', error);
          this.errors.push('Erro ao carregar rubricas: ' + (error.error?.message || 'Erro desconhecido'));
          reject(error);
        }
      });
    });
  }

  loadGrupoMensalidade(id: number): void {
    this.loading = true;
    this.grupoMensalidadeService.getGrupoMensalidadeById(id).subscribe({
      next: (data: GrupoMensalidade) => {
        this.grupoMensalidade = data;
        // Garantir que itensRubricaMensalidade seja inicializado
        if (!this.grupoMensalidade.itensRubricaMensalidade) {
          this.grupoMensalidade.itensRubricaMensalidade = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar grupo de mensalidade:', error);
        this.loading = false;
        // Redirecionar de volta para a lista em caso de erro
        this.router.navigate(['/pages/cadastros/grupo-mensalidade']);
      }
    });
  }

  // Adiciona um novo item de rubrica ao grupo
  addItem(): void {
    // Validação básica - verificar se a rubrica foi selecionada via ng-select
    if (!this.selectedRubricaId || this.selectedRubricaId <= 0) {
      this.errors.push('Selecione uma rubrica');
      return;
    }

    if (this.newItem.valor <= 0) {
      this.errors.push('Valor deve ser maior que zero');
      return;
    }

    // Verificar se já existe um item com a mesma rubrica
    if (this.grupoMensalidade.itensRubricaMensalidade?.some((item: ItemRubricaMensalidade) => item.rubricaId === this.selectedRubricaId)) {
      this.errors.push('Esta rubrica já está adicionada');
      return;
    }

    // Adicionar o novo item com base no valor selecionado no ng-select
    const novoItem: ItemRubricaMensalidade = {
      rubricaId: this.selectedRubricaId,
      valor: this.newItem.valor,
      descricao: this.newItem.descricao,
      ativo: this.newItem.ativo
    };
    
    if (!this.grupoMensalidade.itensRubricaMensalidade) {
      this.grupoMensalidade.itensRubricaMensalidade = [];
    }
    this.grupoMensalidade.itensRubricaMensalidade.push(novoItem);
    
    // Resetar o objeto newItem e o ng-select
    this.newItem = {
      rubricaId: 0,
      valor: 0,
      descricao: '',
      ativo: true
    };
    this.selectedRubricaId = null;
    
    // Remover mensagens de erro relacionadas a adicionar itens
    this.errors = this.errors.filter(error => 
      !error.includes('rubrica') && 
      !error.includes('Valor') && 
      !error.includes('adicionada')
    );
  }

  // Remove um item de rubrica do grupo
  removeItem(index: number): void {
    if (this.grupoMensalidade.itensRubricaMensalidade && index >= 0 && index < this.grupoMensalidade.itensRubricaMensalidade.length) {
      const item = this.grupoMensalidade.itensRubricaMensalidade[index];
      
      // Mostrar modal de confirmação antes de remover
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4b93ff',
        cancelButtonColor: '#f9554c',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (item.id) {
            // Se o item já existia no backend (tem ID), verificar se devemos remover ou marcar como inativo
            // Neste caso, vamos remover o item do array
            this.grupoMensalidade.itensRubricaMensalidade?.splice(index, 1);
          } else {
            // Se é um item novo (sem ID), apenas remover do array
            this.grupoMensalidade.itensRubricaMensalidade?.splice(index, 1);
          }
          
          Swal.fire({
            title: 'Removido!',
            text: 'O item foi removido com sucesso.',
            icon: 'success',
            confirmButtonColor: '#4b93ff'
          });
        }
      });
    }
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validação básica
    if (!this.grupoMensalidade.nomeGrupoMensalidade?.trim()) {
      this.errors.push('Nome do grupo de mensalidade é obrigatório');
      return;
    }

    if (this.grupoMensalidade.nomeGrupoMensalidade.trim().length > 100) {
      this.errors.push('Nome do grupo de mensalidade não pode ter mais de 100 caracteres');
      return;
    }

    if (this.grupoMensalidade.descricao && this.grupoMensalidade.descricao.length > 255) {
      this.errors.push('Descrição não pode ter mais de 255 caracteres');
      return;
    }

    this.loading = true;

    if (this.isEditing && this.grupoMensalidade.id) {
      this.grupoMensalidadeService.updateGrupoMensalidade(this.grupoMensalidade.id!, this.grupoMensalidade).subscribe({
        next: () => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/grupo-mensalidade']);
        },
        error: (error: any) => {
          console.error('Erro ao atualizar grupo de mensalidade:', error);
          this.loading = false;
          this.errors.push('Erro ao atualizar grupo de mensalidade: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    } else {
      this.grupoMensalidadeService.createGrupoMensalidade(this.grupoMensalidade).subscribe({
        next: (novoGrupo: GrupoMensalidade) => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/grupo-mensalidade']);
        },
        error: (error: any) => {
          console.error('Erro ao criar grupo de mensalidade:', error);
          this.loading = false;
          this.errors.push('Erro ao criar grupo de mensalidade: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    }
  }

  onCancel(): void {
    // Redirecionar de volta para a lista
    this.router.navigate(['/pages/cadastros/grupo-mensalidade']);
  }

  getRubricaNome(rubricaId: number): string {
    const rubrica = this.rubricas.find(r => r.id === rubricaId);
    return rubrica ? rubrica.nome : 'Rubrica não encontrada';
  }

  // Método chamado quando a rubrica é selecionada no ng-select
  onRubricaChange(event: any): void {
    // Atualiza o rubricaId com o ID da rubrica selecionada
    this.selectedRubricaId = event?.id || null;
    this.newItem.rubricaId = event?.id || 0;
    console.log('Rubrica selecionada:', event, 'selectedRubricaId:', this.selectedRubricaId, 'newItem.rubricaId:', this.newItem.rubricaId);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}