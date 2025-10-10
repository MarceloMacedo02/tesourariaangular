# Implementação Backend para OUTRAS_RUBRICAS

## Visão Geral
Este documento descreve os componentes backend necessários para implementar completamente a funcionalidade OUTRAS_RUBRICAS, conforme implementado no frontend.

## Endpoints CRUD para Cobrança de Outras Rubricas

### Entities e DTOs

#### Cobranca.java (Entity)
```java
@Entity
@Table(name = "cobrancas")
public class Cobranca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "socio_id")
    private Socio socio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubrica_id")
    private Rubrica rubrica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grupo_mensalidade_id")
    private GrupoMensalidade grupoMensalidade;

    @Enumerated(EnumType.STRING)
    private TipoCobranca tipoCobranca;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorOriginal;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorPago;

    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @Enumerated(EnumType.STRING)
    private StatusCobranca status;

    private String descricao;

    @CreationTimestamp
    @Column(name = "data_registro")
    private LocalDateTime dataRegistro;

    // getters e setters
}
```

#### CobrancaDTO.java
```java
public class CobrancaDTO {
    private Long id;
    private Long socioId;
    private String socioNome;
    private Long rubricaId;
    private String rubricaNome;
    private Long fornecedorId;
    private String fornecedorNome;
    private Long grupoMensalidadeId;
    private String grupoMensalidadeNome;
    private TipoCobranca tipoCobranca;
    private BigDecimal valorOriginal;
    private BigDecimal valorPago;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento;
    private StatusCobranca status;
    private String descricao;
    private LocalDateTime dataRegistro;
    private Float valor;
    private List<Long> sociosIds; // Para cobrança manual coletiva
    private String pagador;
    private String nomeSocio;
    private LocalDate inicio;
    private LocalDate fim;
    private LocalDate dataPagamentoInicio;
    private LocalDate dataPagamentoFim;
    private Long transacaoId;
    private Integer mesLancamento;
    private Integer anoLancamento;

    // getters e setters
}
```

#### Enum TipoCobranca.java
```java
public enum TipoCobranca {
    MENSALIDADE("Mensalidade"),
    OUTRAS_RUBRICAS("Outras Rubricas"),
    AVULSA("Contas a Receber");

    private final String descricao;

    TipoCobranca(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

## Controladores e Serviços

### CobrancaController.java
```java
@RestController
@RequestMapping("/api/cobrancas")
public class CobrancaController {

    @Autowired
    private CobrancaService cobrancaService;

    // CRUD completo:
    // - POST /api/cobrancas - para criar cobrança
    @PostMapping
    public ResponseEntity<CobrancaDTO> criarCobranca(@RequestBody CobrancaDTO cobrancaDTO) {
        CobrancaDTO criada = cobrancaService.criarCobranca(cobrancaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    // - GET /api/cobrancas/{id} - para buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<CobrancaDTO> getCobrancaPorId(@PathVariable Long id) {
        return cobrancaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // - PUT /api/cobrancas/{id} - para atualizar cobrança
    @PutMapping("/{id}")
    public ResponseEntity<CobrancaDTO> atualizarCobranca(@PathVariable Long id, @RequestBody CobrancaDTO cobrancaDTO) {
        CobrancaDTO atualizada = cobrancaService.atualizarCobranca(id, cobrancaDTO);
        return ResponseEntity.ok(atualizada);
    }

    // - DELETE /api/cobrancas/{id} - para excluir cobrança
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirCobranca(@PathVariable Long id) {
        cobrancaService.excluirCobranca(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoints de filtragem:
    // - GET /api/cobrancas/tipo/{tipoCobranca} - lista por TipoCobranca
    @GetMapping("/tipo/{tipoCobranca}")
    public ResponseEntity<Page<CobrancaDTO>> getCobrancasPorTipo(
            @PathVariable TipoCobranca tipoCobranca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CobrancaDTO> cobrancas = cobrancaService.buscarPorTipo(tipoCobranca, PageRequest.of(page, size));
        return ResponseEntity.ok(cobrancas);
    }

    // - GET /api/cobrancas/socio/{socioId} - lista por sócio
    @GetMapping("/socio/{socioId}")
    public ResponseEntity<Page<CobrancaDTO>> getCobrancasPorSocio(
            @PathVariable Long socioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CobrancaDTO> cobrancas = cobrancaService.buscarPorSocio(socioId, PageRequest.of(page, size));
        return ResponseEntity.ok(cobrancas);
    }

    // - GET /api/cobrancas/fornecedor/{fornecedorId} - lista por fornecedor
    @GetMapping("/fornecedor/{fornecedorId}")
    public ResponseEntity<Page<CobrancaDTO>> getCobrancasPorFornecedor(
            @PathVariable Long fornecedorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CobrancaDTO> cobrancas = cobrancaService.buscarPorFornecedor(fornecedorId, PageRequest.of(page, size));
        return ResponseEntity.ok(cobrancas);
    }

    // - GET /api/cobrancas/rubrica/{rubricaId} - lista por rubrica
    @GetMapping("/rubrica/{rubricaId}")
    public ResponseEntity<Page<CobrancaDTO>> getCobrancasPorRubrica(
            @PathVariable Long rubricaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CobrancaDTO> cobrancas = cobrancaService.buscarPorRubrica(rubricaId, PageRequest.of(page, size));
        return ResponseEntity.ok(cobrancas);
    }

    // - GET /api/cobrancas/data-vencimento - lista por data de vencimento específica
    @GetMapping("/data-vencimento")
    public ResponseEntity<List<CobrancaDTO>> getCobrancasPorDataVencimento(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<CobrancaDTO> cobrancas = cobrancaService.buscarPorDataVencimento(data);
        return ResponseEntity.ok(cobrancas);
    }

    // - GET /api/cobrancas/periodo-vencimento - lista por período de vencimento
    @GetMapping("/periodo-vencimento")
    public ResponseEntity<List<CobrancaDTO>> getCobrancasPorPeriodoVencimento(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        List<CobrancaDTO> cobrancas = cobrancaService.buscarPorPeriodoVencimento(inicio, fim);
        return ResponseEntity.ok(cobrancas);
    }

    // - GET /api/cobrancas - lista todas com paginação
    @GetMapping
    public ResponseEntity<Page<CobrancaDTO>> getAllCobrancas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CobrancaDTO> cobrancas = cobrancaService.buscarTodos(PageRequest.of(page, size));
        return ResponseEntity.ok(cobrancas);
    }
}
```

### CobrancaService.java
```java
@Service
@Transactional
public class CobrancaService {

    @Autowired
    private CobrancaRepository cobrancaRepository;

    @Autowired
    private ModelMapper modelMapper;

    public CobrancaDTO criarCobranca(CobrancaDTO cobrancaDTO) {
        Cobranca cobranca = modelMapper.map(cobrancaDTO, Cobranca.class);
        // Definir valores padrão se necessário
        if (cobranca.getStatus() == null) {
            cobranca.setStatus(StatusCobranca.PENDENTE);
        }
        if (cobranca.getTipoCobranca() == null) {
            cobranca.setTipoCobranca(TipoCobranca.OUTRAS_RUBRICAS);
        }
        cobranca = cobrancaRepository.save(cobranca);
        return modelMapper.map(cobranca, CobrancaDTO.class);
    }

    public Optional<CobrancaDTO> buscarPorId(Long id) {
        return cobrancaRepository.findById(id)
                .map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class));
    }

    public CobrancaDTO atualizarCobranca(Long id, CobrancaDTO cobrancaDTO) {
        Cobranca cobrancaExistente = cobrancaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cobrança não encontrada com ID: " + id));
        
        // Atualizar os campos
        cobrancaExistente.setDescricao(cobrancaDTO.getDescricao());
        cobrancaExistente.setDataVencimento(cobrancaDTO.getDataVencimento());
        cobrancaExistente.setValorOriginal(new BigDecimal(cobrancaDTO.getValor().toString()));
        cobrancaExistente.setRubricaId(cobrancaDTO.getRubricaId());
        cobrancaExistente.setStatus(cobrancaDTO.getStatus());
        
        cobrancaExistente = cobrancaRepository.save(cobrancaExistente);
        return modelMapper.map(cobrancaExistente, CobrancaDTO.class);
    }

    public void excluirCobranca(Long id) {
        if (!cobrancaRepository.existsById(id)) {
            throw new EntityNotFoundException("Cobrança não encontrada com ID: " + id);
        }
        cobrancaRepository.deleteById(id);
    }

    public Page<CobrancaDTO> buscarPorTipo(TipoCobranca tipoCobranca, Pageable pageable) {
        Page<Cobranca> cobrancas = cobrancaRepository.findByTipoCobranca(tipoCobranca, pageable);
        return cobrancas.map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class));
    }

    public Page<CobrancaDTO> buscarPorSocio(Long socioId, Pageable pageable) {
        Page<Cobranca> cobrancas = cobrancaRepository.findBySocioId(socioId, pageable);
        return cobrancas.map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class));
    }

    public Page<CobrancaDTO> buscarPorFornecedor(Long fornecedorId, Pageable pageable) {
        Page<Cobranca> cobrancas = cobrancaRepository.findByFornecedorId(fornecedorId, pageable);
        return cobrancas.map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class));
    }

    public Page<CobrancaDTO> buscarPorRubrica(Long rubricaId, Pageable pageable) {
        Page<Cobranca> cobrancas = cobrancaRepository.findByRubricaId(rubricaId, pageable);
        return cobrancas.map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class));
    }

    public List<CobrancaDTO> buscarPorDataVencimento(LocalDate data) {
        List<Cobranca> cobrancas = cobrancaRepository.findByDataVencimento(data);
        return cobrancas.stream()
                .map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class))
                .collect(Collectors.toList());
    }

    public List<CobrancaDTO> buscarPorPeriodoVencimento(LocalDate inicio, LocalDate fim) {
        List<Cobranca> cobrancas = cobrancaRepository.findByDataVencimentoBetween(inicio, fim);
        return cobrancas.stream()
                .map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class))
                .collect(Collectors.toList());
    }

    public Page<CobrancaDTO> buscarTodos(Pageable pageable) {
        Page<Cobranca> cobrancas = cobrancaRepository.findAll(pageable);
        return cobrancas.map(cobranca -> modelMapper.map(cobranca, CobrancaDTO.class));
    }
}
```

### CobrancaRepository.java
```java
@Repository
public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {
    Page<Cobranca> findByTipoCobranca(TipoCobranca tipoCobranca, Pageable pageable);
    Page<Cobranca> findBySocioId(Long socioId, Pageable pageable);
    Page<Cobranca> findByFornecedorId(Long fornecedorId, Pageable pageable);
    Page<Cobranca> findByRubricaId(Long rubricaId, Pageable pageable);
    List<Cobranca> findByDataVencimento(LocalDate dataVencimento);
    List<Cobranca> findByDataVencimentoBetween(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
    
    @Query("SELECT c FROM Cobranca c WHERE c.socio.id = :socioId AND c.status = 'PENDENTE'")
    List<Cobranca> findBySocioIdAndStatusPendente(@Param("socioId") Long socioId);
    
    @Query("SELECT c FROM Cobranca c WHERE c.socio.id = :socioId AND c.status = 'PENDENTE' AND c.tipoCobranca IN :tipos")
    List<Cobranca> findBySocioIdAndStatusPendenteAndTipoCobrancaIn(@Param("socioId") Long socioId, @Param("tipos") List<TipoCobranca> tipos);
}
```

## Novos Endpoints para Funcionalidades Específicas

### Endpoints para Transações e Quitação de Cobranças

#### TransacaoController.java (adicionar métodos)
```java
// Endpoint para quitar cobranças selecionadas
@PostMapping("/{transacaoId}/quitar-cobrancas")
public ResponseEntity<?> quitarCobrancas(
        @PathVariable Long transacaoId,
        @RequestBody QuitarCobrancasRequest request) {
    
    transacaoService.quitarCobrancas(transacaoId, request);
    return ResponseEntity.ok().build();
}

// Endpoint para associar sócio à transação
@PostMapping("/{transacaoId}/associar-socio")
public ResponseEntity<?> associarSocioTransacao(
        @PathVariable Long transacaoId,
        @RequestBody AssociarSocioRequest request) {
    
    transacaoService.associarSocioTransacao(transacaoId, request.getSocioId());
    return ResponseEntity.ok().build();
}

// Endpoint para obter contas a receber de uma transação
@GetMapping("/{transacaoId}/contas-receber/{contaId}")
public ResponseEntity<CobrancaDTO> getContaReceber(
        @PathVariable Long transacaoId,
        @PathVariable Long contaId) {
    
    Optional<CobrancaDTO> conta = cobrancaService.buscarPorId(contaId);
    return conta.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
}

// Endpoint para atualizar conta a receber
@PutMapping("/{transacaoId}/contas-receber/{contaId}")
public ResponseEntity<CobrancaDTO> atualizarContaReceber(
        @PathVariable Long transacaoId,
        @PathVariable Long contaId,
        @RequestBody CobrancaDTO cobrancaDTO) {
    
    CobrancaDTO atualizada = cobrancaService.atualizarCobranca(contaId, cobrancaDTO);
    return ResponseEntity.ok(atualizada);
}

// Endpoint para excluir conta a receber
@DeleteMapping("/{transacaoId}/contas-receber/{contaId}")
public ResponseEntity<Void> excluirContaReceber(
        @PathVariable Long transacaoId,
        @PathVariable Long contaId) {
    
    cobrancaService.excluirCobranca(contaId);
    return ResponseEntity.noContent().build();
}
```

#### Classes de Request
```java
public class QuitarCobrancasRequest {
    private List<Long> cobrancaIds;
    private Long contaFinanceiraId;

    // getters e setters
}

public class AssociarSocioRequest {
    private Long socioId;

    // getters e setters
}
```

## Observações Importantes

1. O backend deve implementar todos os endpoints descritos acima para que o frontend funcione corretamente
2. Os endpoints de quitação de cobranças devem incluir validação de valores (o total das cobranças selecionadas deve corresponder ao valor da transação)
3. Deve haver tratamento adequado de erros e validações de negócio
4. As transações devem ser tratadas com consistência, especialmente ao quitar cobranças
5. Os endpoints devem incluir controle de acesso e autenticação adequados