import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GrauSocio,
  GrupoMensalidade,
  Socio,
  SocioDependente,
  SocioResumoDTO,
  StatusSocio,
} from '../socio.model';
import { SocioService } from '../socio.service';

@Component({
  selector: 'app-socio-form',
  templateUrl: './socio-form.component.html',
  styleUrls: ['./socio-form.component.scss'],
})
export class SocioFormComponent implements OnInit {
  activeTab = 'dados-pessoais'; // Controla a aba ativa
  // Objeto Sócio baseado no DTO do backend
  socio: Socio = {
    nomeSocio: '',
    grau: 'TITULAR', // Valor padrão
    cpf: '',
    celular: '',
    email: '',
    dataNascimento: undefined,
    ativo: true,
    imagemAvatar: undefined,
    grupoMensalidadeId: undefined,
    dependentes: [],
  };

  isEditing = false;
  loading = false;
  loadingImage = false; // Loading state specifically for image uploads
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;
  gruposMensalidade: GrupoMensalidade[] = [];
  statusSocios: StatusSocio[] = [];
  grausSocios: GrauSocio[] = [];

  novoDependente: SocioDependente = {
    nomeSocio: '',
    grau: '',
  };

  // Sócios frequentes para selecionar como dependentes
  sociosFrequentes: SocioResumoDTO[] = [];

  // Novo dependente como sócio frequente
  novoDependenteSocioFrequenteId: number | null = null;

  // Toast
  toastMessage: WritableSignal<string | null> = signal(null);
  toastType: WritableSignal<'success' | 'error' | 'warning' | 'info'> = signal('info');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Novo Sócio', active: true },
    ];

    // Carregar dados necessários para os selects
    this.loadData().then(() => {
      // Após carregar os dados, verificar se é edição
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditing = true;
        this.breadCrumbItems[1] = { label: 'Editar Sócio', active: true };
        this.loadSocio(parseInt(id, 10));
      }
    });
  }

  async loadData(): Promise<void> {
    try {
      // Carregar grupos de mensalidade
      this.gruposMensalidade =
        (await this.socioService.getGruposMensalidade().toPromise()) || [];
    } catch (error) {
      console.error('Erro ao carregar grupos de mensalidade:', error);
      this.errors.push('Erro ao carregar grupos de mensalidade');
    }

    try {
      // Carregar status de sócios
      this.statusSocios =
        (await this.socioService.getStatusSocios().toPromise()) || [];
    } catch (error) {
      console.error('Erro ao carregar status de sócios:', error);
      this.errors.push('Erro ao carregar status de sócios');
    }

    try {
      // Carregar graus de sócios
      this.grausSocios =
        (await this.socioService.getGrausSocios().toPromise()) || [];
    } catch (error) {
      console.error('Erro ao carregar graus de sócios:', error);
      this.errors.push('Erro ao carregar graus de sócios');
    }

    try {
      // Carregar sócios frequentes para usar como dependentes
      this.sociosFrequentes =
        (await this.socioService.getSociosFrequentes().toPromise()) || [];
    } catch (error) {
      console.error('Erro ao carregar sócios frequentes:', error);
      this.errors.push('Erro ao carregar sócios frequentes');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar o tipo de arquivo
      if (!file.type.match('image.*')) {
        this.errors.push(
          'Por favor, selecione um arquivo de imagem válido (JPEG, PNG, etc.)'
        );
        return;
      }

      // Validar o tamanho do arquivo (ex: máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errors.push('A imagem deve ter no máximo 5MB');
        return;
      }

      // Converter o arquivo para base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result; // Armazenar como base64

        // Ativar o loading específico para upload de imagem
        this.loadingImage = true;

        // Fazer upload temporário da imagem
        this.socioService.uploadImagemTemporaria(base64Image).subscribe({
          next: (response: string) => {
            // O backend retorna o nome do arquivo como texto (ex: "uuid.jpg")
            // Vamos armazenar o nome do arquivo completo com a extensão
            const fileName = response.trim();
            // Armazenar o nome do arquivo completo com extensão
            this.socio.imagemAvatar = fileName;

            // Desativar o loading de upload de imagem
            this.loadingImage = false;
          },
          error: (error: any) => {
            console.error('Erro ao fazer upload temporário da imagem:', error);
            this.errors.push(
              'Erro ao fazer upload da imagem: ' +
                (error.error?.message || 'Erro desconhecido')
            );
            // Desativar o loading de upload de imagem mesmo em caso de erro
            this.loadingImage = false;
          },
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.socio.imagemAvatar = undefined;
  }

  loadSocio(id: number): void {
    this.loading = true;
    this.socioService.getSocioById(id).subscribe({
      next: (data: Socio) => {
        this.socio = data;
        this.loading = false;
        // Recarregar os dados para filtrar os sócios
        this.loadData();
      },
      error: (error: any) => {
        console.error('Erro ao carregar sócio:', error);
        this.loading = false;
        // Redirecionar de volta para a lista em caso de erro
        this.router.navigate(['/pages/cadastros/socio']);
      },
    });
  }

  onSubmit(): void {
    console.log('onSubmit chamado - debug', this.socio);
    this.errors = [];

    // Validações de campos obrigatórios
    if (!this.socio.nomeSocio?.trim()) {
      console.log('Nome do sócio está vazio');
      this.errors.push('Nome do sócio é obrigatório');
    }

    if (!this.socio.cpf?.trim()) {
      console.log('CPF do sócio está vazio');
      this.errors.push('CPF do sócio é obrigatório');
    } else {
      // Validar formato do CPF
      if (!this.isValidCpf(this.socio.cpf)) {
        this.errors.push('Formato de CPF inválido');
      }
    }

    if (!this.socio.grau) {
      this.errors.push('Grau do sócio é obrigatório');
    }

    if (this.socio.nomeSocio && this.socio.nomeSocio.trim().length > 100) {
      this.errors.push('Nome do sócio não pode ter mais de 100 caracteres');
    }

    // Validar formato de email se fornecido
    if (this.socio.email && !this.isValidEmail(this.socio.email)) {
      this.errors.push('Formato de email inválido');
    }

    // Validar formato de email alternativo se fornecido
    if (
      this.socio.emailAlternativo &&
      !this.isValidEmail(this.socio.emailAlternativo)
    ) {
      this.errors.push('Formato de email alternativo inválido');
    }

    // Validar formato de celular se fornecido
    if (this.socio.celular && !this.isValidCelular(this.socio.celular)) {
      this.errors.push('Formato de celular inválido. Use (XX) 9XXXX-XXXX');
    }

    // Validar formato de telefone residencial se fornecido
    if (
      this.socio.telefoneResidencial &&
      !this.isValidTelefoneResidencial(this.socio.telefoneResidencial)
    ) {
      this.errors.push(
        'Formato de telefone residencial inválido. Use (XX) XXXX-XXXX'
      );
    }

    // Validar endereços se fornecidos
    if (
      this.socio.enderecoResidencial &&
      this.socio.enderecoResidencial.length > 500
    ) {
      this.errors.push(
        'Endereço residencial não pode ter mais de 500 caracteres'
      );
    }

    if (
      this.socio.enderecoComercial &&
      this.socio.enderecoComercial.length > 500
    ) {
      this.errors.push(
        'Endereço comercial não pode ter mais de 500 caracteres'
      );
    }

    if (this.socio.enderecoOutro && this.socio.enderecoOutro.length > 500) {
      this.errors.push('Outro endereço não pode ter mais de 500 caracteres');
    }

    // Validar se ocorreram erros
    if (this.errors.length > 0) {
      console.log('Erros de validação:', this.errors);
      return;
    }

    // Formatar campos antes de enviar
    if (this.socio.cpf) {
      this.socio.cpf = this.formatCpf(this.socio.cpf);
    }

    if (this.socio.celular) {
      this.socio.celular = this.formatCelular(this.socio.celular);
    }

    if (this.socio.telefoneResidencial) {
      this.socio.telefoneResidencial = this.formatTelefoneResidencial(
        this.socio.telefoneResidencial
      );
    }

    // Preparar os dados para envio, garantindo que dependentes contenham somente os IDs
    const socioParaEnviar: any = { ...this.socio };
    
    // Converter dependentes para uma lista contendo apenas os IDs
    if (this.socio.dependentes && this.socio.dependentes.length > 0) {
      const dependentesSomenteComIds = this.socio.dependentes.map(dependente => ({
        id: dependente.id
      }));
      socioParaEnviar.dependentes = dependentesSomenteComIds;
    } else {
      socioParaEnviar.dependentes = [];
    }

    // Log do objeto socio antes de salvar
    console.log('Sócio a ser salvo:', JSON.stringify(socioParaEnviar, null, 2));
    console.log('Modo edição:', this.isEditing, 'ID do sócio:', this.socio.id);

    this.loading = true;

    if (this.isEditing && this.socio.id) {
      console.log('Atualizando sócio com ID:', this.socio.id);
      // Para edição, atualizar os dados do sócio
      this.socioService.updateSocio(this.socio.id, socioParaEnviar).subscribe({
        next: () => {
          console.log('Sócio atualizado com sucesso');
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/socio']);
          // Mostrar toast de sucesso
          this.showCustomToast('Sócio atualizado com sucesso!', 'success');
        },
        error: (error: any) => {
          console.error('Erro ao atualizar sócio:', error);
          this.loading = false;
          // Mostrar toast de erro com mensagem amigável
          const mensagemErro = error.error?.message || 'Não foi possível atualizar o sócio. Tente novamente.';
          this.showCustomToast(mensagemErro, 'error');
        },
      });
    } else {
      console.log('Criando novo sócio');
      // Para criação, criar o sócio
      this.socioService.createSocio(socioParaEnviar).subscribe({
        next: (novoSocio: Socio) => {
          console.log('Sócio criado com sucesso:', novoSocio);
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/socio']);
          // Mostrar toast de sucesso
          this.showCustomToast('Sócio cadastrado com sucesso!', 'success');
        },
        error: (error: any) => {
          console.error('Erro ao criar sócio:', error);
          this.loading = false;
          // Mostrar toast de erro com mensagem amigável
          const mensagemErro = error.error?.message || 'Não foi possível cadastrar o sócio. Tente novamente.';
          this.showCustomToast(mensagemErro, 'error');
        },
      });
    }
  }

  onCancel(): void {
    // Redirecionar de volta para a lista
    this.router.navigate(['/pages/cadastros/socio']);
  }

  // Validações de formato
  private isValidCpf(cpf: string): boolean {
    // Remover caracteres não numéricos
    const cleanedCpf = cpf.replace(/\D/g, '');

    // Verificar se tem 11 dígitos
    if (cleanedCpf.length !== 11) {
      return false;
    }

    // Verificar se todos os dígitos são iguais (ex: 000.000.000-00)
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return false;
    }

    // Validar dígitos verificadores
    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cleanedCpf.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cleanedCpf.substring(10, 11))) {
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidCelular(celular: string): boolean {
    const celularRegex = /^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/;
    return celularRegex.test(celular);
  }

  private isValidTelefoneResidencial(telefone: string): boolean {
    const telefoneRegex = /^\([1-9]{2}\) [0-9]{4}-[0-9]{4}$/;
    return telefoneRegex.test(telefone);
  }

  formatCelular(celular: string): string {
    // Remover caracteres não numéricos
    const cleanedCelular = celular.replace(/\D/g, '');

    // Aplicar máscara (XX) 9XXXX-XXXX
    // Ajustar a máscara dependendo do número de dígitos
    if (cleanedCelular.length <= 2) {
      return cleanedCelular;
    } else if (cleanedCelular.length <= 7) {
      return cleanedCelular.replace(/(\d{2})(\d+)/, '($1) $2');
    } else if (cleanedCelular.length <= 10) {
      return cleanedCelular.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    } else {
      return cleanedCelular.replace(
        /(\d{2})(\d{1})(\d{4})(\d{4})/,
        '($1) $2$3-$4'
      );
    }
  }

  formatTelefoneResidencial(telefone: string): string {
    // Remover caracteres não numéricos
    const cleanedTelefone = telefone.replace(/\D/g, '');

    // Aplicar máscara (XX) XXXX-XXXX
    // Ajustar a máscara dependendo do número de dígitos
    if (cleanedTelefone.length <= 2) {
      return cleanedTelefone;
    } else if (cleanedTelefone.length <= 6) {
      return cleanedTelefone.replace(/(\d{2})(\d+)/, '($1) $2');
    } else {
      return cleanedTelefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
  }

  adicionarDependente(): void {
    // Adiciona um dependente a partir de um sócio frequente
    if (this.novoDependenteSocioFrequenteId) {
      // Encontrar o sócio frequente selecionado
      const socioFrequente = this.sociosFrequentes.find(
        (s) => s.id === this.novoDependenteSocioFrequenteId
      );
      if (socioFrequente) {
        if (!this.socio.dependentes) {
          this.socio.dependentes = [];
        }

        // Adiciona o sócio frequente como dependente usando ID e nome
        const novoDependente: SocioDependente = {
          id: socioFrequente.id,
          nomeSocio: socioFrequente.nomeSocio, // Sempre enviar o nome do dependente
          grau: 'DEPENDENTE', // Definir o grau como DEPENDENTE
        };

        this.socio.dependentes.push(novoDependente);

        // Limpa a seleção
        this.novoDependenteSocioFrequenteId = null;
      }
    }
  }

  removerDependente(index: number): void {
    if (this.socio.dependentes && this.socio.dependentes.length > index) {
      this.socio.dependentes.splice(index, 1);
    }
  }

  formatCpf(cpf: string): string {
    // Remover caracteres não numéricos
    const cleanedCpf = cpf.replace(/\D/g, '');

    // Aplicar máscara XXX.XXX.XXX-XX
    // Ajustar a máscara dependendo do número de dígitos
    if (cleanedCpf.length <= 3) {
      return cleanedCpf;
    } else if (cleanedCpf.length <= 6) {
      return cleanedCpf.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (cleanedCpf.length <= 9) {
      return cleanedCpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  }

  // Função de Toast
  showCustomToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 5000);
  }

  getToastClasses(type: 'success' | 'error' | 'warning' | 'info') {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-secondary text-white';
    }
  }
}
