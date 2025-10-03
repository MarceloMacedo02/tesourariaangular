import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socio, Page, GrupoMensalidade, StatusSocio, GrauSocio, SocioDependente, SocioResumoDTO } from './socio.model';
import { environment } from 'src/environments/environment';

/**
 * Serviço para gerenciamento de Sócios
 * Campos dataRegistro e dataAtualizacao são de uso exclusivo do backend
 * e não devem ser manipulados no frontend
 */
@Injectable({
  providedIn: 'root'
})
export class SocioService {

  private apiUrl = `${environment.apiBaseUrl}/api/socios`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista paginada de sócios
   * Retorna campos dataRegistro e dataAtualizacao que são de uso exclusivo do backend
   */
  getSocios(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<Socio>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<Socio>>(this.apiUrl, { params });
  }

  /**
   * Obtém um sócio específico pelo ID
   * Retorna campos dataRegistro e dataAtualizacao que são de uso exclusivo do backend
   */
  getSocioById(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo sócio
   * Campos dataRegistro e dataAtualizacao são gerenciados exclusivamente pelo backend
   */
  createSocio(socio: Socio): Observable<Socio> {
    return this.http.post<Socio>(this.apiUrl, socio);
  }

  /**
   * Atualiza um sócio existente
   * Campos dataRegistro e dataAtualizacao são gerenciados exclusivamente pelo backend
   */
  updateSocio(id: number, socio: Socio): Observable<Socio> {
    return this.http.put<Socio>(`${this.apiUrl}/${id}`, socio);
  }

  /**
   * Cria um novo sócio com upload de imagem
   * O backend processa a imagem base64 e armazena no diretório configurado
   */
  createSocioWithImage(socio: Socio): Observable<Socio> {
    return this.http.post<Socio>(`${this.apiUrl}/com-imagem`, socio);
  }

  /**
   * Faz o upload temporário de uma imagem
   * O backend processa a imagem base64 e retorna um UUID para referência
   */
  uploadImagemTemporaria(imageData: string): Observable<string> {
    // Se for uma string base64 completa, extrair apenas os dados
    let base64Data = imageData;
    if (imageData && imageData.startsWith('data:image')) {
      base64Data = imageData.split(',')[1];
    }
    
    // Criar FormData com o campo 'file' como esperado pelo backend
    const formData = new FormData();
    // Converter base64 para Blob
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    formData.append('file', blob, 'temp-image.jpg');
    
    return this.http.post(`${this.apiUrl}/upload-imagem-temp`, formData, { responseType: 'text' });
  }

  /**
   * Atualiza a imagem de um sócio existente
   * O backend processa a imagem base64 e atualiza o arquivo existente
   */
  updateSocioImage(id: number, imageData: string): Observable<Socio> {
    // Se for uma string base64 completa, extrair apenas os dados
    let base64Data = imageData;
    if (imageData && imageData.startsWith('data:image')) {
      base64Data = imageData.split(',')[1];
    }
    
    const formData = new FormData();
    // Converter base64 para Blob
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    formData.append('file', blob, 'temp-image.jpg');
    
    return this.http.put<Socio>(`${this.apiUrl}/${id}/upload-imagem`, formData);
  }

  /**
   * Obtém a URL da imagem de um sócio
   */
  getSocioImageUrl(socioId: number, extensao: string = 'jpg'): string {
    return `${this.apiUrl}/imagens/${socioId}.${extensao}`;
  }

  /**
   * Exclui um sócio
   */
  deleteSocio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Faz upload de arquivo CSV com sócios
   */
  uploadSociosCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.apiBaseUrl}/api/csv/upload-socios`, formData);
  }

  /**
   * Obtém a lista de sócios ativos
   */
  getSociosAtivos(): Observable<Socio[]> {
    return this.http.get<Socio[]>(`${this.apiUrl}/ativos`);
  }

  /**
   * Obtém a lista de grupos de mensalidade
   */
  getGruposMensalidade(): Observable<GrupoMensalidade[]> {
    // Usando o serviço de GrupoMensalidade para obter os dados
    // O endpoint direto /api/socios/grupos-mensalidade está causando erro 500
    // Portanto, estamos usando o serviço de GrupoMensalidade diretamente
    const grupoMensalidadeService = new (class {
      getAllGruposMensalidade(): Observable<GrupoMensalidade[]> {
        const apiUrl = `${environment.apiBaseUrl}/api/grupos-mensalidade`;
        return this.http.get<Page<GrupoMensalidade>>(apiUrl, { 
          params: new HttpParams().set('page', '0').set('size', '1000') 
        }).pipe(map(response => response.content));
      }
      
      constructor(private http: HttpClient) {}
    })(this.http);
    
    const apiUrl = `${environment.apiBaseUrl}/api/grupos-mensalidade`;
    return this.http.get<Page<GrupoMensalidade>>(apiUrl, { 
      params: new HttpParams().set('page', '0').set('size', '1000') 
    }).pipe(map(response => response.content));
  }

  /**
   * Obtém a lista de status de sócios
   */
  getStatusSocios(): Observable<StatusSocio[]> {
    return this.http.get<StatusSocio[]>(`${this.apiUrl}/status`);
  }

  /**
   * Obtém a lista de graus de sócios
   */
  getGrausSocios(): Observable<GrauSocio[]> {
    return this.http.get<GrauSocio[]>(`${this.apiUrl}/graus`);
  }

  /**
   * Obtém a lista de sócios frequentes para uso em selects de dependentes
   */
  getSociosFrequentes(): Observable<SocioResumoDTO[]> {
    return this.http.get<SocioResumoDTO[]>(`${this.apiUrl}/frequentes`);
  }

  /**
   * Gera cobranças de mensalidade em lote para os sócios selecionados
   */
  gerarCobrancasMensalidade(sociosIds: number[], mes: number, ano: number): Observable<any> {
    const requestBody = {
      sociosIds: sociosIds,
      mes: mes,
      ano: ano
    };
    
    const cobrancasUrl = `${environment.apiBaseUrl}/api/cobrancas/salvar-mensalidade`;
    return this.http.post(cobrancasUrl, requestBody);
  }


}