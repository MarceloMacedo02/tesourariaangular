import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovimentacoesService } from '../../../services/movimentacoes.service';
import { ReferenciasFinanceirasService, ReferenciasFinanceiras } from '../../../services/referencias-financeiras.service';
import { SocioSimples, CobrancaSocio } from '../../../models/movimentacao.model';
import { Fornecedor, Rubrica, CentroCusto } from '../../../services/referencias-financeiras.service';

@Component({
  selector: 'app-quitacao-credito',
  templateUrl: './quitacao-credito.component.html',
  styleUrls: ['./quitacao-credito.component.css']
})
export class QuitacaoCreditoComponent implements OnInit {
  movimentacaoForm: FormGroup;
  carregando = false;
  carregandoSocios = false;
  
  // Dados de referência
  referencias: ReferenciasFinanceiras = {
    socios: [],
    fornecedores: [],
    rubricas: [],
    centrosCusto: []
  };
  
  categorias = [
    { id: 1, descricao: 'Recebimento de Mensalidade' },
    { id: 2, descricao: 'Recebimento de Rubrica' },
    { id: 3, descricao: 'Outros Recebimentos' }
  ];
  
  socios: SocioSimples[] = [];
  cobrancasMensais: CobrancaSocio[] = [];
  cobrancasRubricas: CobrancaSocio[] = [];

  constructor(
    private fb: FormBuilder,
    private movimentacoesService: MovimentacoesService,
    private referenciasService: ReferenciasFinanceirasService,
    private router: Router
  ) {
    this.movimentacaoForm = this.fb.group({
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataMovimento: ['', Validators.required],
      tipoMovimento: ['ENTRADA', Validators.required], // Crédito
      lancado: ['LANCADO', Validators.required], // Sempre lançado para crédito
      observacao: [''],
      rubricaId: [''],
      centroCustoId: [''],
      fornecedorId: [null],
      socioId: [null],
      categoriaId: ['']
    });
  }

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregarSocios();
    
    // Definir data atual como padrão
    const dataAtual = new Date().toISOString().split('T')[0];
    this.movimentacaoForm.patchValue({ dataMovimento: dataAtual });
  }

  get socioIdControl() {
    return this.movimentacaoForm.get('socioId');
  }

  carregarReferencias(): void {
    // Carregar rubricas e centros de custo
    this.referenciasService.getRubricas().subscribe({
      next: (rubricas) => {
        this.referencias.rubricas = rubricas;
      },
      error: (error) => {
        console.error('Erro ao carregar rubricas:', error);
      }
    });
    
    this.referenciasService.getCentrosCusto().subscribe({
      next: (centros) => {
        this.referencias.centrosCusto = centros;
      },
      error: (error) => {
        console.error('Erro ao carregar centros de custo:', error);
      }
    });
    
    // Carregar também os sócios e fornecedores para manter compatibilidade
    this.referenciasService.getSocios().subscribe({
      next: (socios) => {
        // Não precisamos armazenar os sócios aqui, já que usamos o serviço específico para isso
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
      }
    });
    
    this.referenciasService.getFornecedores().subscribe({
      next: (fornecedores) => {
        // Não precisamos armazenar os fornecedores aqui, já que usamos o serviço específico para isso
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedores:', error);
      }
    });
  }

  carregarSocios(): void {
    this.carregandoSocios = true;
    this.movimentacoesService.getSociosSimples().subscribe({
      next: (socios) => {
        this.socios = socios;
        this.carregandoSocios = false;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
        this.carregandoSocios = false;
      }
    });
  }

  onSocioChange(socioId: number): void {
    if (socioId) {
      // Carregar cobranças do sócio
      this.carregarCobrancasMensais(socioId);
      this.carregarCobrancasRubricas(socioId);
    } else {
      // Limpar lista de cobranças caso o sócio seja deselecionado
      this.cobrancasMensais = [];
      this.cobrancasRubricas = [];
    }
  }

  carregarCobrancasMensais(socioId: number): void {
    this.movimentacoesService.getCobrancasMensaisDoSocio(socioId).subscribe({
      next: (cobrancas) => {
        this.cobrancasMensais = cobrancas;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças mensais:', error);
        this.cobrancasMensais = [];
      }
    });
  }

  carregarCobrancasRubricas(socioId: number): void {
    this.movimentacoesService.getCobrancasRubricasDoSocio(socioId).subscribe({
      next: (cobrancas) => {
        this.cobrancasRubricas = cobrancas;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças de rubricas:', error);
        this.cobrancasRubricas = [];
      }
    });
  }

  adicionarCobrancaRubrica(): void {
    const socioId = this.socioIdControl?.value;
    if (!socioId) {
      alert('Selecione um sócio antes de adicionar uma cobrança de rubrica.');
      return;
    }
    
    // Criar um objeto para a nova cobrança de rubrica
    const novaCobranca = {
      socioId: socioId,
      descricao: prompt('Descrição da cobrança:'),
      valor: parseFloat(prompt('Valor da cobrança:') || '0'),
      dataVencimento: prompt('Data de vencimento (YYYY-MM-DD):'),
      rubricaId: null // Pode ser selecionado mais tarde
    };
    
    if (novaCobranca.descricao && novaCobranca.valor && novaCobranca.dataVencimento) {
      // Neste ponto, normalmente chamaríamos o serviço para criar a cobrança
      // this.movimentacoesService.criarCobrancaRubrica(novaCobranca).subscribe(...)
      
      // Por enquanto, adicionaremos à lista temporariamente para demonstração
      const cobrancaAdicionada: CobrancaSocio = {
        id: Date.now(), // ID temporário
        descricao: novaCobranca.descricao,
        valor: novaCobranca.valor,
        dataVencimento: novaCobranca.dataVencimento,
        status: 'PENDENTE',
        tipo: 'rubrica'
      };
      
      this.cobrancasRubricas = [...this.cobrancasRubricas, cobrancaAdicionada];
      alert('Cobrança de rubrica adicionada com sucesso!');
    } else {
      alert('Preencha todos os campos obrigatórios para adicionar a cobrança.');
    }
  }

  onSubmit(): void {
    if (this.movimentacaoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.carregando = true;
    const formValue = this.movimentacaoForm.value;

    // Remover campos que não são parte do request
    const movimentacaoRequest = {
      descricao: formValue.descricao,
      valor: formValue.valor,
      dataMovimento: formValue.dataMovimento,
      tipoMovimento: formValue.tipoMovimento,
      lancado: formValue.lancado,
      observacao: formValue.observacao,
      rubricaId: formValue.rubricaId || undefined,
      centroCustoId: formValue.centroCustoId || undefined,
      fornecedorId: formValue.fornecedorId,
      socioId: formValue.socioId || null,
      categoriaId: formValue.categoriaId || undefined
    };

    this.movimentacoesService.registrarMovimentacao(movimentacaoRequest).subscribe({
      next: (movimentacao) => {
        this.carregando = false;
        alert('Movimentação registrada com sucesso!');
        this.router.navigate(['/pages/financeiro/quitar-transacoes']); // Navegar para a lista de transações após o registro
      },
      error: (error) => {
        console.error('Erro ao registrar movimentação:', error);
        this.carregando = false;
        alert('Erro ao registrar movimentação. Por favor, tente novamente.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/quitar-transacoes']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.movimentacaoForm.controls).forEach(key => {
      const control = this.movimentacaoForm.get(key);
      control?.markAsTouched();
    });
  }
}