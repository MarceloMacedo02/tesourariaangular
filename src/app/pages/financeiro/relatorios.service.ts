import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page, CobrancaAvulsa, ContaPagar } from './financeiro.model';
import { ContasReceberService, ContasPagarService } from './financeiro.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  
  constructor(
    private contasReceberService: ContasReceberService,
    private contasPagarService: ContasPagarService
  ) { }

  /**
   * Exporta um relatório de contas em formato PDF
   */
  exportarRelatorioPDF(
    tipo: 'RECEBER' | 'PAGAR' | 'AMBOS',
    dataInicio?: string,
    dataFim?: string
  ): Observable<Blob> {
    // Esta é uma implementação simplificada
    // Na prática, você poderia chamar uma API do backend para gerar o PDF
    return new Observable(observer => {
      try {
        const doc = new jsPDF();
        
        // Cabeçalho
        doc.setFontSize(18);
        doc.text('Relatório Financeiro', 105, 20, { align: 'center' });
        
        if (dataInicio && dataFim) {
          doc.setFontSize(12);
          doc.text(`Período: ${dataInicio} a ${dataFim}`, 105, 30, { align: 'center' });
        }
        
        // Aqui você poderia adicionar tabelas com os dados
        // Por simplicidade, vamos apenas retornar um PDF básico
        
        const blob = doc.output('blob');
        observer.next(blob);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Exporta um relatório de contas em formato CSV
   */
  exportarRelatorioCSV(
    tipo: 'RECEBER' | 'PAGAR' | 'AMBOS',
    dataInicio?: string,
    dataFim?: string
  ): Observable<Blob> {
    return new Observable(observer => {
      try {
        let csvContent = 'ID,Descrição,Tipo,Valor,Data Vencimento,Status\n';
        
        // Aqui você poderia adicionar os dados reais
        // Por simplicidade, vamos apenas retornar um CSV básico
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        observer.next(blob);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}