# Especificação para Implementação de Upload de Imagens de Sócios - Backend

## Visão Geral
Esta especificação detalha como o backend deve implementar o upload de imagens de sócios, seguindo as melhores práticas de segurança, armazenamento e nomenclatura de arquivos.

## Fluxo de Trabalho

### 1. Recebimento da Imagem (Endpoint: PUT /api/socios/{id}/upload-imagem)
1. O frontend envia uma requisição PUT com corpo contendo:
   ```json
   {
     "imageData": "base64_encoded_image_data"
   }
   ```

2. O backend recebe a requisição e:
   - Valida se o sócio com o ID especificado existe
   - Valida se os dados da imagem estão presentes e no formato correto
   - Decodifica os dados base64 para obter os bytes da imagem

### 2. Processamento e Validação da Imagem
1. Validar o formato da imagem:
   - Verificar se é JPEG, PNG ou GIF
   - Validar magic numbers/header da imagem
   - Verificar tamanho máximo (recomendado: 5MB)

2. Validar dimensões da imagem:
   - Verificar dimensões máximas (recomendado: 2000x2000 pixels)
   - Opcionalmente redimensionar para dimensões padrão (ex: 300x300px)

### 3. Geração de Nome Único e Armazenamento
1. Gerar um UUID único para o arquivo:
   ```java
   String uuid = UUID.randomUUID().toString();
   ```

2. Determinar a extensão do arquivo com base no tipo MIME da imagem:
   - image/jpeg → .jpg
   - image/png → .png
   - image/gif → .gif

3. Construir o nome do arquivo:
   ```
   {uuid}.{extensao}
   Exemplo: a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
   ```

4. Determinar o diretório de armazenamento:
   ```
   {diretorio_configurado}/socios/
   Exemplo: uploads/socios/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
   ```

### 4. Salvamento do Arquivo
1. Salvar o arquivo físico no sistema de arquivos
2. Atualizar o campo `caminhoFoto` no registro do sócio **com apenas o UUID gerado** (não o caminho completo)
3. Retornar o UUID para o frontend

### 5. Retorno para o Frontend
1. Em caso de sucesso:
   ```json
   {
     "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     "message": "Imagem salva com sucesso"
   }
   ```

2. Em caso de erro:
   ```json
   {
     "error": "Mensagem de erro detalhada",
     "timestamp": "2023-01-01T10:00:00Z"
   }
   ```

## Estrutura de Diretórios Recomendada
```
uploads/
└── socios/
    ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
    ├── b2c3d4e5-f6g7-8901-bcde-fg2345678901.png
    └── ...
```

## Configurações Necessárias

### 1. application.properties
```properties
# Diretório base para upload de imagens
app.upload.socios.dir=uploads/socios/
# Tamanho máximo da imagem (em bytes)
app.upload.socios.max-size=5242880
# Dimensões máximas
app.upload.socios.max-width=2000
app.upload.socios.max-height=2000
```

## Considerações de Segurança

### 1. Validação de Conteúdo
- Nunca confiar apenas na extensão do arquivo
- Validar o conteúdo real da imagem (magic numbers)
- Verificar tipo MIME correto

### 2. Sanitização de Nomes
- Usar UUIDs para evitar problemas de segurança com nomes de arquivos
- Não usar dados fornecidos pelo usuário diretamente nos nomes dos arquivos

### 3. Acesso aos Arquivos
- Configurar permissões adequadas no diretório de uploads
- Implementar endpoint protegido para servir as imagens

## Implementação Detalhada

### 1. Endpoint de Upload de Imagem
```java
@RestController
@RequestMapping("/api/socios")
public class SocioController {
    
    @PutMapping("/{id}/upload-imagem")
    public ResponseEntity<?> uploadImagemSocio(
            @PathVariable Long id,
            @RequestBody UploadImagemRequest request) {
        
        try {
            // 1. Validar sócio
            Socio socio = socioService.findById(id);
            if (socio == null) {
                return ResponseEntity.notFound().build();
            }
            
            // 2. Processar imagem
            String uuid = imagemService.salvarImagemSocio(request.getImageData(), id);
            
            // 3. Atualizar registro do sócio
            socio.setCaminhoFoto(uuid);
            socioService.save(socio);
            
            // 4. Retornar sucesso
            return ResponseEntity.ok(new UploadImagemResponse(uuid, "Imagem salva com sucesso"));
        } catch (ImagemInvalidaException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Imagem inválida: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro ao salvar imagem: " + e.getMessage()));
        }
    }
}
```

### 2. Serviço de Processamento de Imagens
```java
@Service
public class ImagemService {
    
    @Value("${app.upload.socios.dir}")
    private String uploadDir;
    
    @Value("${app.upload.socios.max-size}")
    private long maxSize;
    
    public String salvarImagemSocio(String base64Data, Long socioId) 
            throws ImagemInvalidaException, IOException {
        
        // 1. Decodificar base64
        byte[] imageData = Base64.getDecoder().decode(base64Data);
        
        // 2. Validar tamanho
        if (imageData.length > maxSize) {
            throw new ImagemInvalidaException("Imagem excede o tamanho máximo permitido");
        }
        
        // 3. Validar formato e obter tipo
        String mimeType = detectMimeType(imageData);
        String extension = getFileExtension(mimeType);
        
        // 4. Validar conteúdo da imagem
        validateImageContent(imageData);
        
        // 5. Gerar UUID
        String uuid = UUID.randomUUID().toString();
        
        // 6. Criar diretório se não existir
        Path dirPath = Paths.get(uploadDir, "socios");
        Files.createDirectories(dirPath);
        
        // 7. Salvar arquivo
        Path filePath = dirPath.resolve(uuid + "." + extension);
        Files.write(filePath, imageData);
        
        return uuid;
    }
    
    private String detectMimeType(byte[] data) throws ImagemInvalidaException {
        // Implementar detecção de mime type usando biblioteca como Apache Tika
        // ou verificação manual de magic numbers
    }
    
    private String getFileExtension(String mimeType) throws ImagemInvalidaException {
        switch (mimeType.toLowerCase()) {
            case "image/jpeg":
                return "jpg";
            case "image/png":
                return "png";
            case "image/gif":
                return "gif";
            default:
                throw new ImagemInvalidaException("Formato de imagem não suportado: " + mimeType);
        }
    }
    
    private void validateImageContent(byte[] data) throws ImagemInvalidaException {
        // Implementar validação de conteúdo da imagem
        // Ex: verificar dimensões, corrupção, etc.
    }
}
```

### 3. Endpoint para Servir Imagens
```java
@GetMapping("/imagens/{uuid}.{extensao}")
public ResponseEntity<Resource> getImagemSocio(
        @PathVariable String uuid,
        @PathVariable String extensao) throws IOException {
    
    // Validar extensão
    if (!isValidExtension(extensao)) {
        return ResponseEntity.notFound().build();
    }
    
    // Construir caminho do arquivo
    Path filePath = Paths.get(uploadDir, "socios", uuid + "." + extensao);
    
    // Verificar se arquivo existe
    if (!Files.exists(filePath)) {
        return ResponseEntity.notFound().build();
    }
    
    // Servir arquivo
    Resource resource = new UrlResource(filePath.toUri());
    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("image/" + extensao))
            .body(resource);
}
```

## Tratamento de Erros

### Tipos de Erros Comuns
1. **Sócio não encontrado** (HTTP 404)
2. **Imagem inválida** (HTTP 400)
3. **Erro de processamento** (HTTP 500)
4. **Permissões insuficientes** (HTTP 403)
5. **Payload muito grande** (HTTP 413)

## Métricas e Monitoramento

### Logs Recomendados
- Upload iniciado: `INFO - Iniciando upload de imagem para sócio {id}`
- Upload concluído: `INFO - Imagem salva com sucesso para sócio {id}, UUID: {uuid}`
- Erros: `ERROR - Erro ao salvar imagem para sócio {id}: {mensagem}`

### Métricas
- Contador de uploads bem-sucedidos
- Contador de uploads com erro
- Tempo médio de processamento de imagens
- Tamanho médio das imagens recebidas

## Futuras Melhorias

### 1. Integração com Serviços em Nuvem
- Amazon S3
- Google Cloud Storage
- Azure Blob Storage

### 2. Processamento de Imagens Avançado
- Redimensionamento automático
- Compressão otimizada
- Geração de thumbnails

### 3. CDN para Distribuição
- Implementar CDN para servir imagens
- Configurar cache apropriado

## Documentação da API

### PUT /api/socios/{id}/upload-imagem
#### Request Body
```json
{
  "imageData": "string (base64 encoded image data)"
}
```

#### Response (Success - 200 OK)
```json
{
  "uuid": "string (UUID do arquivo salvo)",
  "message": "string (Mensagem de sucesso)"
}
```

#### Response (Error - 400 Bad Request)
```json
{
  "error": "string (Mensagem de erro)",
  "timestamp": "string (ISO 8601 timestamp)"
}
```

#### Response (Error - 404 Not Found)
```json
{
  "error": "Sócio não encontrado",
  "timestamp": "string (ISO 8601 timestamp)"
}
```

#### Response (Error - 500 Internal Server Error)
```json
{
  "error": "string (Mensagem de erro)",
  "timestamp": "string (ISO 8601 timestamp)"
}
```

## Considerações Finais

Esta implementação garante:
1. **Segurança**: Validação rigorosa de conteúdo e uso de UUIDs
2. **Escalabilidade**: Estrutura que permite fácil migração para serviços em nuvem
3. **Manutenibilidade**: Código bem estruturado e documentado
4. **Compatibilidade**: Funciona com o frontend já implementado
5. **Performance**: Processamento eficiente com validações otimizadas