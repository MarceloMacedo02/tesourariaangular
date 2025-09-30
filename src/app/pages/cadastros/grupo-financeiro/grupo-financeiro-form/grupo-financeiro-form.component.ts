import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoFinanceiro } from '../grupo-financeiro.model';
import { GrupoFinanceiroService } from '../grupo-financeiro.service';

@Component({
  selector: 'app-grupo-financeiro-form',
  templateUrl: './grupo-financeiro-form.component.html',
  styleUrls: ['./grupo-financeiro-form.component.scss']
})
export class GrupoFinanceiroFormComponent implements OnInit {
  grupoFinanceiro: GrupoFinanceiro = {
    nomeGrupoFinanceiro: '',
    descricao: '',
    centroCustoId: 0,
    ativo: true
  };
  
  isEditing = false;
  loading = false;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;
  centrosCusto: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grupoFinanceiroService: GrupoFinanceiroService
  ) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Novo Grupo Financeiro', active: true }
    ];

    // Load centros de custo for the dropdown
    this.loadCentrosCusto();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.breadCrumbItems[1] = { label: 'Editar Grupo Financeiro', active: true };
      this.loadGrupoFinanceiro(parseInt(id, 10));
    }
  }

  loadCentrosCusto(): void {
    this.grupoFinanceiroService.getCentrosCusto().subscribe({
      next: (data) => {
        this.centrosCusto = data;
      },
      error: (error) => {
        console.error('Erro ao carregar centros de custo:', error);
        this.errors.push('Erro ao carregar centros de custo: ' + (error.error?.message || 'Erro desconhecido'));
      }
    });
  }

  loadGrupoFinanceiro(id: number): void {
    this.loading = true;
    this.grupoFinanceiroService.getGrupoFinanceiroById(id).subscribe({
      next: (data) => {
        this.grupoFinanceiro = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupo financeiro:', error);
        this.loading = false;
        // Redirecionar de volta para a lista em caso de erro
        this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
      }
    });
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validação básica
    if (!this.grupoFinanceiro.nomeGrupoFinanceiro?.trim()) {
      this.errors.push('Nome do grupo financeiro é obrigatório');
      return;
    }

    if (this.grupoFinanceiro.nomeGrupoFinanceiro.trim().length > 100) {
      this.errors.push('Nome do grupo financeiro não pode ter mais de 100 caracteres');
      return;
    }

    if (this.grupoFinanceiro.descricao && this.grupoFinanceiro.descricao.length > 255) {
      this.errors.push('Descrição não pode ter mais de 255 caracteres');
      return;
    }

    if (!this.grupoFinanceiro.centroCustoId) {
      this.errors.push('Centro de custo é obrigatório');
      return;
    }

    this.loading = true;

    if (this.isEditing && this.grupoFinanceiro.id) {
      this.grupoFinanceiroService.updateGrupoFinanceiro(this.grupoFinanceiro.id, this.grupoFinanceiro).subscribe({
        next: () => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
        },
        error: (error) => {
          console.error('Erro ao atualizar grupo financeiro:', error);
          this.loading = false;
          this.errors.push('Erro ao atualizar grupo financeiro: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    } else {
      this.grupoFinanceiroService.createGrupoFinanceiro(this.grupoFinanceiro).subscribe({
        next: (novoGrupoFinanceiro) => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
        },
        error: (error) => {
          console.error('Erro ao criar grupo financeiro:', error);
          this.loading = false;
          this.errors.push('Erro ao criar grupo financeiro: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    }
  }

  onCancel(): void {
    // Redirecionar de volta para a lista
    this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
  }
}