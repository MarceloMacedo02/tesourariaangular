import { Component } from '@angular/core';
import { SocioService } from '../socio.service';

interface SocioProcessadoDTO {
  nomeSocio: string;
  grau: any; // Seria GrauSocio no backend
  dataNascimento?: string;
  cpf: string;
  status: any; // Seria StatusSocio no backend
  celular?: string;
  telefoneResidencial?: string;
  email?: string;
  emailAlternativo?: string;
  enderecoResidencial?: string;
  enderecoComercial?: string;
  enderecoOutro?: string;
  novo: boolean;
  atualizado: boolean;
  mensagem: string;
}

interface ProcessamentoResponse {
  message: string;
  linhasProcessadas: number;
  sociosProcessados: SocioProcessadoDTO[];
}

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare global {
  interface jsPDF {
    autoTable: any;
  }
}

@Component({
  selector: 'app-socio-importar',
  templateUrl: './socio-importar.component.html',
  styleUrls: []
})
export class SocioImportarComponent {
  selectedFile: File | null = null;
  loading = false;
  error: string | null = null;
  results: ProcessamentoResponse | null = null;

  constructor(private socioService: SocioService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        this.error = 'Apenas arquivos CSV são permitidos.';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.error = null;
    }
  }

  uploadCSV(): void {
    if (!this.selectedFile) {
      this.error = 'Por favor, selecione um arquivo CSV.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.socioService.uploadSociosCSV(this.selectedFile).subscribe({
      next: (response: ProcessamentoResponse) => {
        this.results = response;
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.error || 'Erro ao processar o arquivo CSV.';
      }
    });
  }

  exportResults(): void {
    // Exportar resultados em formato CSV ou JSON
    if (this.results) {
      const dataStr = JSON.stringify(this.results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'resultados_importacao_socios.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }

  exportResultsToPDF(): void {
    if (!this.results || !this.results.sociosProcessados || this.results.sociosProcessados.length === 0) {
      console.warn('Nenhum resultado para exportar');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4'); // orientação paisagem, milímetros, tamanho A4
    
    // Cabeçalho profissional
    doc.setDrawColor(41, 128, 185); // Azul profissional
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 297, 30, 'F'); // Retângulo superior
    
    // Título branco
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Importação de Sócios', 148.5, 18, { align: 'center' });
    
    // Informações do relatório
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(`Linhas Processadas: ${this.results.linhasProcessadas}`, 20, 40);
    doc.text(`Sócios Novos: ${this.getNovosSociosCount()}`, 20, 48);
    doc.text(`Sócios Atualizados: ${this.getAtualizadosSociosCount()}`, 20, 56);
    
    // Data e hora
    const now = new Date();
    const dataHora = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    doc.text(`Data e Hora: ${dataHora}`, 220, 40);
    
    // Preparar dados para a tabela
    const tableColumn = ['Nome', 'CPF', 'Status', 'Tipo', 'Mensagem'];
    const tableRows: (string | number)[][] = [];
    
    this.results.sociosProcessados.forEach(socio => {
      const dadosSocio: (string | number)[] = [
        socio.nomeSocio,
        socio.cpf,
        socio.status,
        socio.novo ? 'Novo' : socio.atualizado ? 'Atualizado' : 'Sem alteração',
        socio.mensagem
      ];
      tableRows.push(dadosSocio);
    });
    
    // Adicionar tabela com design executivo
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [52, 152, 219], // Azul mais claro
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [50, 50, 50]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250] // Cinza muito claro
      },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 60 }, // Nome
        1: { cellWidth: 40 }, // CPF
        2: { cellWidth: 30 }, // Status
        3: { cellWidth: 30 }, // Tipo
        4: { cellWidth: 70 }  // Mensagem
      }
    });
    
    // Rodapé profissional
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Linha separadora no rodapé
      doc.setDrawColor(200, 200, 200);
      doc.line(15, doc.internal.pageSize.height - 20, 282, doc.internal.pageSize.height - 20);
      
      // Informações no rodapé
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Sistema de Gestão de Sócios - ${new Date().getFullYear()}`, 15, doc.internal.pageSize.height - 10);
      doc.text(`Página ${i} de ${pageCount}`, 270, doc.internal.pageSize.height - 10, { align: 'right' });
    }
    
    // Salvar PDF
    doc.save('relatorio_importacao_socios.pdf');
  }

  getNovosSociosCount(): number {
    if (!this.results || !this.results.sociosProcessados) return 0;
    return this.results.sociosProcessados.filter(s => s.novo).length;
  }

  getAtualizadosSociosCount(): number {
    if (!this.results || !this.results.sociosProcessados) return 0;
    return this.results.sociosProcessados.filter(s => s.atualizado).length;
  }

  getStatusBadgeClass(status: any): string {
    if (!status) return 'bg-secondary';
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'ativo':
        return 'bg-success';
      case 'inativo':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  getTipoBadgeClass(socio: SocioProcessadoDTO): string {
    if (socio.novo) {
      return 'bg-primary';
    } else if (socio.atualizado) {
      return 'bg-info';
    } else {
      return 'bg-secondary';
    }
  }
}