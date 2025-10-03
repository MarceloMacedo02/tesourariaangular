# Especificação para Upload de Imagem de Sócio - Backend

## Objetivo
Implementar a funcionalidade de upload de imagem para o avatar do sócio no backend do sistema de tesouraria.

## Requisitos Funcionais

### 1. Manipulação de Imagem no Backend
- O backend deve aceitar imagens enviadas como strings base64 no campo `caminhoFoto`
- O backend deve validar o formato da imagem antes de salvá-la
- O backend deve converter a string base64 para um arquivo de imagem real
- O backend deve armazenar a imagem em um local apropriado (sistema de arquivos ou serviço de armazenamento)
- O backend deve atualizar o campo `caminhoFoto` no registro do sócio com o caminho do arquivo salvo

### 2. Validação de Imagem
- Validar que o arquivo enviado é uma imagem válida (JPEG, PNG, GIF, etc.)
- Validar o tamanho máximo do arquivo (sugerido: 5MB)
- Validar dimensões máximas da imagem (sugerido: 2000x2000 pixels)
- Garantir que o nome do arquivo seja seguro (sem caracteres especiais que possam causar problemas)

### 3. Segurança
- Validar e sanitizar o nome do arquivo para prevenir ataques
- Armazenar arquivos em diretório seguro, com acesso controlado
- Implementar tipo de conteúdo (Content-Type) correto no retorno
- Prevenir manipulação de arquivos por outros usuários

## Implementação Necessária

### 1. Atualização do Model Sócio
No model `Socio.java`, o campo `caminhoFoto` deve permitir armazenar o caminho relativo da imagem no servidor.

### 2. Atualização do DTO Sócio
O DTO `SocioDTO.java` deve manter o campo `caminhoFoto` para suportar o upload de imagem.

### 3. Implementação no Service
No service `SocioService.java`, adicionar métodos para:

```java
public class SocioService {
    
    // Caminho padrão para armazenamento de imagens
    private static final String FOTO_DIR = "uploads/socios/";
    
    // Método para converter base64 para arquivo
    public String saveFotoFromBase64(String base64Data, Long socioId) throws IOException {
        // 1. Validar o formato base64
        // 2. Decodificar a string base64
        // 3. Determinar o tipo de imagem
        // 4. Salvar o arquivo em FOTO_DIR com nome único (ex: socioId + timestamp)
        // 5. Retornar o caminho relativo do arquivo
    }
    
    // Atualizar o método de salvamento para processar caminhoFoto
    @Transactional
    public Socio save(Socio socio) {
        // Se caminhoFoto for base64, converter e salvar arquivo
        if (socio.getCaminhoFoto() != null && socio.getCaminhoFoto().startsWith("/9j/")) {
            String relativePath = saveFotoFromBase64(socio.getCaminhoFoto(), socio.getId());
            socio.setCaminhoFoto(relativePath);
        }
        return socioRepository.save(socio);
    }
}
```

### 4. Validação de Imagem
Criar um utilitário para validação de imagem:

```java
@Component
public class ImagemUtil {
    
    private static final Set<String> FORMATOS_VALIDOS = Set.of("JPEG", "PNG", "GIF", "JPG");
    private static final long TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB
    
    public boolean validarImagem(String base64Data) throws IOException {
        // Decodificar base64
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);
        
        // Validar tamanho
        if (imageBytes.length > TAMANHO_MAXIMO) {
            throw new IllegalArgumentException("Imagem excede o tamanho máximo permitido");
        }
        
        // Validar formato
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        if (image == null) {
            throw new IllegalArgumentException("Formato de imagem inválido");
        }
        
        // Verificar extensão
        String formato = getFormatoImagem(imageBytes);
        return FORMATOS_VALIDOS.contains(formato.toUpperCase());
    }
    
    private String getFormatoImagem(byte[] imageBytes) throws IOException {
        // Detectar formato da imagem
        // ...
    }
}
```

### 5. Configuração de Upload
- Configurar o diretório de upload (ex: `uploads/socios/`) com permissões adequadas
- Configurar a URL para acesso às imagens (ex: `/api/socios/imagens/{id}.{extensao}`)
- Considerar o uso de serviço de armazenamento em nuvem como AWS S3, Google Cloud Storage, etc.

### 6. Endpoint para Recuperação de Imagem
Adicionar endpoint para servir as imagens dos sócios:

```java
@GetMapping("/imagens/{id}.{extensao}")
public ResponseEntity<byte[]> getImagemSocio(@PathVariable Long id, @PathVariable String extensao) {
    // Recuperar caminho da imagem do banco
    // Ler arquivo do sistema de arquivos
    // Retornar com content-type apropriado
}
```

## Considerações Técnicas

### 1. Nomeação de Arquivos
- Usar formato como: `{socioId}_{timestamp}.{extensao}` (ex: `123_20231001123059.jpg`)
- Isso evita conflitos e facilita a gestão de arquivos

### 2. Tamanho de Imagem
- Considerar redimensionamento automático para um tamanho padrão (ex: 300x300px)
- Isso economiza espaço e melhora o desempenho

### 3. Cache HTTP
- Configurar cabeçalhos de cache para imagens
- Definir TTL adequado para imagens estáticas

### 4. Segurança de Arquivos
- Validar extensão e conteúdo real do arquivo
- Não confiar apenas na extensão do arquivo
- Verificar o magic number do arquivo

## Testes Necessários

### 1. Testes Unitários
- Testar a conversão de base64 para arquivo
- Testar validação de formato e tamanho
- Testar geração de nome único

### 2. Testes de Integração
- Testar upload e recuperação de imagem
- Testar os endpoints de CRUD com imagem
- Testar validação de segurança

## Documentação Swagger
Atualizar a documentação Swagger para indicar o suporte a upload de imagem no DTO e endpoints.

## Riscos e Mitigações

### 1. Consumo de Espaço
- **Risco**: Upload excessivo de imagens pode consumir espaço em disco
- **Mitigação**: Implementar validação de tamanho e políticas de retenção

### 2. Segurança
- **Risco**: Upload de arquivos maliciosos
- **Mitigação**: Validação rigorosa de formato e conteúdo

### 3. Performance
- **Risco**: Processamento de imagens pode impactar a performance
- **Mitigação**: Processamento assíncrono e cache adequado