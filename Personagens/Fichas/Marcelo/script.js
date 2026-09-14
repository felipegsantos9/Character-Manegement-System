const xpPorNivel = {
    2: 230,
    3: 450,
    4: 700,
    5: 890,
    6: 950,
    7: 1000,
    8: 1250,
    9: 1500,
    10: 2850,
    11: 2000,
    12: 2500,
    13: 2500,
    14: 3700,
    15: 5000,
    16: 6500,
    17: 7000,
    18: 8500,
    19: 10000,
    20: 30000
};

const estadoPadrao = {
    nivel: 7,
    pvAtual: 200,
    peAtual: 120,
    sanAtual: 280,
    pmAtual: 260,
    xpAtual: 0,
    equalizeAcumulado: 0,
    buffs: {
        concentracao: false,
        racaSuperior: false
    },
    poderesPersonalizados: [],
    habilidadesPersonalizadas: []
};

const atributosBase = {
    FOR: {
        nome: "FORÇA",
        valor: 3
    },
    AGI: {
        nome: "AGILIDADE",
        valor: 3
    },
    VIG: {
        nome: "VIGOR",
        valor: 2
    },
    PRE: {
        nome: "PRESENÇA",
        valor: 2
    },
    INT: {
        nome: "INTELECTO",
        valor: 3
    }
};

const pericias = {
    Acrobacia: {
        atributo: "AGI",
        bonus: 5
    },

    Alquimia: {
        atributo: "INT",
        bonus: 0
    },

    Atletismo: {
        atributo: "FOR",
        bonus: 5
    },

    Atualidades: {
        atributo: "INT",
        bonus: 0
    },

    Adestramento: {
        atributo: "PRE",
        bonus: 0
    },

    Artes: {
        atributo: "PRE",
        bonus: 0
    },

    Crime: {
        atributo: "AGI",
        bonus: 0
    },

    Ciências: {
        atributo: "INT",
        bonus: 0
    },

    Carisma: {
        atributo: "PRE",
        bonus: 5
    },

    Diplomacia: {
        atributo: "PRE",
        bonus: 5
    },

    Enganação: {
        atributo: "PRE",
        bonus: 5
    },

    Engenharia: {
        atributo: "INT",
        bonus: 0
    },

    Furtividade: {
        atributo: "AGI",
        bonus: 0
    },

    Fortitude: {
        atributo: "VIG",
        bonus: 32
    },

    Iniciativa: {
        atributo: "AGI",
        bonus: 3
    },

    Investigação: {
        atributo: "INT",
        bonus: 10
    },

    Intimidação: {
        atributo: "PRE",
        bonus: 0
    },

    Intuição: {
        atributo: "PRE",
        bonus: 0
    },

    Luta: {
        atributo: "FOR",
        bonus: 5
    },

    Magia: {
        atributo: "INT",
        bonus: 32
    },

    Medicina: {
        atributo: "INT",
        bonus: 0
    },

    Percepção: {
        atributo: "PRE",
        bonus: 10
    },

    Profissão: {
        atributo: "INT",
        bonus: 0
    },

    Pilotagem: {
        atributo: "AGI",
        bonus: 0
    },

    Pontaria: {
        atributo: "AGI",
        bonus: 0
    },

    Reflexos: {
        atributo: "AGI",
        bonus: 19
    },

    Religião: {
        atributo: "PRE",
        bonus: 0
    },

    Sobrevivência: {
        atributo: "INT",
        bonus: 0
    },

    Tática: {
        atributo: "INT",
        bonus: 0
    },

    Tecnologia: {
        atributo: "INT",
        bonus: 0
    },

    Vontade: {
        atributo: "PRE",
        bonus: 5
    }
};

const poderes = [
    {
        id: "azul",
        nome: "Técnica Azul",
        texto: "Concentra e manipula o espaço para criar uma força de atração devastadora.",
        custo: 50,
        critico: 20,
        dano: "10d12",
        extra: 0
    },

    {
        id: "vermelha",
        nome: "Técnica Vermelha",
        texto: "Libera uma poderosa força de repulsão através da manipulação espacial.",
        custo: 50,
        critico: 20,
        dano: "10d12",
        extra: 0
    },

    {
        id: "purpura",
        nome: "Técnica Púrpura",
        texto: "Combina as técnicas Azul e Vermelha para produzir uma força destrutiva absurda.",
        custo: 500,
        critico: 20,
        dano: "25d50",
        extra: 0
    },

    {
        id: "amaterasu",
        nome: "Amaterasu",
        texto: "Invoca chamas negras que queimam o alvo com uma intensidade sobrenatural.",
        custo: 0,
        critico: 20,
        dano: "20d12",
        extra: 5
    }
];

const armas = [
    {
        id: "baixo",
        nome: "Baixo Elétrico Muito Aura",
        ataque: "Luta",
        dano: "6d12+3d8",
        critico: 19,
        extra: 4
    }
];

let estado = carregarEstado();

function carregarEstado() {
    const salvo = localStorage.getItem(
        "personagem_marcelo"
    );

    if (!salvo) {
        return JSON.parse(
            JSON.stringify(estadoPadrao)
        );
    }

    const dados = JSON.parse(salvo);

    return {
        ...estadoPadrao,
        ...dados,

        buffs: {
            ...estadoPadrao.buffs,
            ...(dados.buffs || {})
        },

        poderesPersonalizados:
            dados.poderesPersonalizados || [],

        habilidadesPersonalizadas:
            dados.habilidadesPersonalizadas || []
    };
}

function salvarEstado() {
    const existente = JSON.parse(
        localStorage.getItem(
            "personagem_marcelo"
        ) || "{}"
    );

    localStorage.setItem(
        "personagem_marcelo",
        JSON.stringify({
            ...existente,
            ...estado,
            nivel: estado.nivel
        })
    );
}

function rolarDado(lados) {
    return Math.floor(
        Math.random() * lados
    ) + 1;
}

function rolarGrupo(
    quantidade,
    lados
) {
    const resultados = [];

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {
        resultados.push(
            rolarDado(lados)
        );
    }

    return resultados;
}

function parseDice(expressao) {
    const grupos = expressao
        .toLowerCase()
        .replace(/\s/g, "")
        .split("+");

    return grupos.map(grupo => {
        const partes =
            grupo.split("d");

        return {
            quantidade:
                Number(partes[0]) || 1,

            lados:
                Number(partes[1])
        };
    });
}

function rolarDano(expressao) {
    const grupos =
        parseDice(expressao);

    let total = 0;

    grupos.forEach(grupo => {
        const resultados =
            rolarGrupo(
                grupo.quantidade,
                grupo.lados
            );

        total += resultados.reduce(
            (soma, valor) =>
                soma + valor,
            0
        );
    });

    return total;
}

function adicionarDados(
    expressao,
    quantidadeExtra
) {
    if (!quantidadeExtra) {
        return expressao;
    }

    const grupos =
        parseDice(expressao);

    if (!grupos.length) {
        return expressao;
    }

    const principal =
        grupos[0];

    principal.quantidade +=
        quantidadeExtra;

    return grupos
        .map(
            grupo =>
                `${grupo.quantidade}d${grupo.lados}`
        )
        .join("+");
}

function atributoEfetivo(id) {
    const atributo =
        atributosBase[id];

    if (!atributo) {
        return 0;
    }

    let valor =
        atributo.valor;

    if (estado.pvAtual < 60) {
        valor += 1;
    }

    return valor;
}

function bonusPericia(nome) {
    const pericia =
        pericias[nome];

    if (!pericia) {
        return 0;
    }

    let bonus =
        pericia.bonus;

    if (
        nome === "Fortitude" ||
        nome === "Magia"
    ) {
        bonus +=
            estado.equalizeAcumulado;
    }

    if (
        estado.buffs.concentracao
    ) {
        bonus += 20;
    }

    if (
        estado.buffs.racaSuperior
    ) {
        bonus += 10;
    }

    return bonus;
}

function rolarAtributo(id) {
    const quantidade =
        atributoEfetivo(id);

    const resultados =
        rolarGrupo(
            quantidade,
            20
        );

    const maior =
        Math.max(...resultados);

    mostrarResultado(
        atributosBase[id].nome,
        [
            ["RESULTADO", maior]
        ],
        resultados.includes(20)
            ? "CRÍTICO"
            : ""
    );
}

function rolarPericia(nome) {
    const pericia =
        pericias[nome];

    if (!pericia) {
        return;
    }

    const quantidade =
        atributoEfetivo(
            pericia.atributo
        );

    const resultados =
        rolarGrupo(
            quantidade,
            20
        );

    const maior =
        Math.max(...resultados);

    const bonus =
        bonusPericia(nome);

    const total =
        maior + bonus;

    mostrarResultado(
        nome,
        [
            ["RESULTADO", total]
        ],
        resultados.includes(20)
            ? "CRÍTICO"
            : ""
    );
}

function gastarPM(custo) {
    if (custo <= 0) {
        return true;
    }

    if (
        estado.pmAtual >= custo
    ) {
        estado.pmAtual -=
            custo;

        salvarEstado();
        atualizarInterface();

        return true;
    }

    const pmDisponivel =
        estado.pmAtual;

    estado.pmAtual = 0;
    estado.pvAtual = 0;

    estado.equalizeAcumulado = 0;

    salvarEstado();
    atualizarInterface();

    mostrarResultado(
        "SOBRECARGA",
        [
            [
                "PM NECESSÁRIO",
                `${custo} PM`
            ],

            [
                "PM DISPONÍVEL",
                `${pmDisponivel} PM`
            ],

            [
                "PM RESTANTE",
                "0 PM"
            ],

            [
                "PV",
                "0"
            ],

            [
                "CONSEQUÊNCIA",
                "CORPO LEVADO AO LIMITE"
            ]
        ],
        "PV ZERADO"
    );

    return true;
}

function rolarPoder(id) {
    const poder =
        poderes.find(
            item => item.id === id
        );

    if (!poder) {
        return;
    }

    if (
        !gastarPM(
            poder.custo
        )
    ) {
        return;
    }

    const quantidade =
        atributoEfetivo("INT");

    const resultados =
        rolarGrupo(
            quantidade,
            20
        );

    const maior =
        Math.max(...resultados);

    const bonus =
        bonusPericia("Magia");

    const ataque =
        maior + bonus;

    const critico =
        resultados.includes(20);

    let danoExpressao =
        poder.dano;

    if (
        critico &&
        poder.extra > 0
    ) {
        danoExpressao =
            adicionarDados(
                danoExpressao,
                poder.extra
            );
    }

    let dano =
        rolarDano(
            danoExpressao
        );

    if (
        estado.buffs.concentracao
    ) {
        dano += 20;
    }

    const linhas = [
        [
            "ATAQUE",
            ataque
        ],

        [
            "DANO",
            dano
        ],

        [
            "PM GASTO",
            poder.custo
        ],

        [
            "PM RESTANTE",
            estado.pmAtual
        ]
    ];

    if (critico) {
        linhas.push([
            "CRÍTICO",
            `SIM • ${danoExpressao}`
        ]);
    }

    mostrarResultado(
        poder.nome,
        linhas,
        critico
            ? "CRÍTICO"
            : ""
    );
}

function rolarAtaque(
    armaId
) {
    const arma =
        armas.find(
            item => item.id === armaId
        );

    if (!arma) {
        return;
    }

    const pericia =
        pericias[arma.ataque];

    const quantidade =
        atributoEfetivo(
            pericia.atributo
        );

    const resultados =
        rolarGrupo(
            quantidade,
            20
        );

    const maior =
        Math.max(...resultados);

    const bonus =
        bonusPericia(
            arma.ataque
        );

    const ataque =
        maior + bonus;

    const criticoAtaque =
        resultados.includes(20);

    const criticoArma =
        !criticoAtaque &&
        maior >= arma.critico;

    const critico =
        criticoAtaque ||
        criticoArma;

    let danoExpressao =
        arma.dano;

    if (critico) {
        danoExpressao =
            adicionarDados(
                danoExpressao,
                arma.extra
            );
    }

    let dano =
        rolarDano(
            danoExpressao
        );

    if (
        estado.buffs.concentracao
    ) {
        dano += 20;
    }

    const linhas = [
        [
            "ATAQUE",
            ataque
        ],

        [
            "DANO",
            dano
        ]
    ];

    if (criticoAtaque) {
        linhas.push([
            "CRÍTICO",
            "ATAQUE NATURAL 20"
        ]);
    } else if (criticoArma) {
        linhas.push([
            "CRÍTICO",
            `ARMA • ${arma.critico}`
        ]);
    }

    if (critico) {
        linhas.push([
            "ROLAGEM",
            danoExpressao
        ]);
    }

    mostrarResultado(
        arma.nome,
        linhas,
        critico
            ? "CRÍTICO"
            : ""
    );
}

function adicionarXP(valor) {
    valor = Number(valor);

    if (
        !valor ||
        valor <= 0
    ) {
        return;
    }

    estado.xpAtual += valor;

    while (
        estado.nivel < 20 &&
        estado.xpAtual >=
            xpPorNivel[
                estado.nivel + 1
            ]
    ) {
        estado.xpAtual -=
            xpPorNivel[
                estado.nivel + 1
            ];

        estado.nivel++;
    }

    salvarEstado();
    atualizarInterface();

    document.getElementById(
        "xp-adicionar"
    ).value = "";
}

function atualizarXP() {
    const xpAtual =
        document.getElementById(
            "xp-atual"
        );

    const xpNecessario =
        document.getElementById(
            "xp-necessario"
        );

    const nivel =
        document.getElementById(
            "nivel"
        );

    if (xpAtual) {
        xpAtual.textContent =
            estado.xpAtual;
    }

    if (nivel) {
        nivel.textContent =
            String(
                estado.nivel
            ).padStart(2, "0");
    }

    if (xpNecessario) {
        if (
            estado.nivel >= 20
        ) {
            xpNecessario.textContent =
                "/ MÁXIMO";
        } else {
            xpNecessario.textContent =
                `/ ${
                    xpPorNivel[
                        estado.nivel + 1
                    ]
                }`;
        }
    }
}

function atualizarRecursos() {
    document.getElementById(
        "pv-atual"
    ).value =
        estado.pvAtual;

    document.getElementById(
        "pe-atual"
    ).value =
        estado.peAtual;

    document.getElementById(
        "san-atual"
    ).value =
        estado.sanAtual;

    document.getElementById(
        "pm-atual"
    ).value =
        estado.pmAtual;
}

function atualizarAtributos() {
    Object.keys(
        atributosBase
    ).forEach(id => {
        const elemento =
            document.getElementById(
                `attr-${id}`
            );

        if (elemento) {
            elemento.textContent =
                atributoEfetivo(id);
        }
    });
}

function atualizarPericias() {
    const fortitude =
        document.getElementById(
            "fortitude-valor"
        );

    const magia =
        document.getElementById(
            "magia-valor"
        );

    if (fortitude) {
        fortitude.textContent =
            bonusPericia(
                "Fortitude"
            );
    }

    if (magia) {
        magia.textContent =
            bonusPericia(
                "Magia"
            );
    }
}

function atualizarBuffs() {
    document.getElementById(
        "buff-concentracao"
    ).checked =
        estado.buffs.concentracao;

    document.getElementById(
        "buff-raca"
    ).checked =
        estado.buffs.racaSuperior;
}

function atualizarInterface() {
    atualizarXP();
    atualizarRecursos();
    atualizarAtributos();
    atualizarPericias();
    atualizarBuffs();
}

function mostrarResultado(
    titulo,
    linhas,
    destaque = ""
) {
    const overlay =
        document.getElementById(
            "resultado-overlay"
        );

    const tituloElemento =
        document.getElementById(
            "resultado-titulo"
        );

    const conteudo =
        document.getElementById(
            "resultado-conteudo"
        );

    tituloElemento.textContent =
        titulo;

    conteudo.innerHTML =
        linhas
            .map(
                linha => `
                    <div class="resultado-linha">
                        <span>
                            ${linha[0]}
                        </span>

                        <strong>
                            ${linha[1]}
                        </strong>
                    </div>
                `
            )
            .join("");

    if (destaque) {
        conteudo.innerHTML += `
            <div class="resultado-linha">
                <span>STATUS</span>

                <strong class="critico">
                    ${destaque}
                </strong>
            </div>
        `;
    }

    overlay.classList.add(
        "ativo"
    );
}

function adicionarPersonalizado() {
    const tipo =
        document.getElementById(
            "novo-tipo"
        ).value;

    const nome =
        document.getElementById(
            "novo-nome"
        ).value.trim();

    const descricao =
        document.getElementById(
            "novo-descricao"
        ).value.trim();

    const dano =
        document.getElementById(
            "novo-dano"
        ).value.trim();

    const buffs =
        document.getElementById(
            "novo-buffs"
        ).value.trim();

    const novo = {
        id: Date.now(),
        nome,
        descricao,
        dano,
        buffs
    };

    if (
        tipo === "poder"
    ) {
        estado.poderesPersonalizados.push(
            novo
        );
    } else {
        estado.habilidadesPersonalizadas.push(
            novo
        );
    }

    salvarEstado();
    renderizarPersonalizados();
    limparFormulario();
}

function criarCardPersonalizado(
    item,
    tipo
) {
    const podeRolar =
        tipo === "poder" &&
        item.dano;

    return `
        <article class="poder-card personalizado">

            <div class="poder-topo">

                <div>

                    <span>
                        ${
                            tipo === "poder"
                                ? "PODER PERSONALIZADO"
                                : "HABILIDADE PERSONALIZADA"
                        }
                    </span>

                    <h3>
                        ${
                            item.nome ||
                            "SEM NOME"
                        }
                    </h3>

                </div>

                <button
                    onclick="
                        removerPersonalizado(
                            ${item.id},
                            '${tipo}'
                        )
                    "
                >
                    ×
                </button>

            </div>

            ${
                item.descricao
                    ? `
                        <p>
                            ${item.descricao}
                        </p>
                    `
                    : ""
            }

            ${
                item.dano
                    ? `
                        <div class="info-personalizado">

                            <span>
                                DANO
                            </span>

                            <strong>
                                ${item.dano}
                            </strong>

                        </div>
                    `
                    : ""
            }

            ${
                item.buffs
                    ? `
                        <div class="info-personalizado">

                            <span>
                                BUFFS
                            </span>

                            <strong>
                                ${item.buffs}
                            </strong>

                        </div>
                    `
                    : ""
            }

            ${
                podeRolar
                    ? `
                        <button
                            class="botao-rolar-poder"
                            onclick="
                                rolarPoderPersonalizado(
                                    ${item.id}
                                )
                            "
                        >
                            ROLAR DANO
                        </button>
                    `
                    : ""
            }

        </article>
    `;
}

function renderizarPersonalizados() {
    const listaPoderes =
        document.getElementById(
            "lista-poderes"
        );

    const listaHabilidades =
        document.getElementById(
            "lista-habilidades"
        );

    if (listaPoderes) {
        listaPoderes
            .querySelectorAll(
                ".personalizado"
            )
            .forEach(
                item =>
                    item.remove()
            );

        estado.poderesPersonalizados
            .forEach(item => {
                listaPoderes.insertAdjacentHTML(
                    "beforeend",
                    criarCardPersonalizado(
                        item,
                        "poder"
                    )
                );
            });
    }

    if (listaHabilidades) {
        listaHabilidades.innerHTML =
            "";

        estado.habilidadesPersonalizadas
            .forEach(item => {
                listaHabilidades.insertAdjacentHTML(
                    "beforeend",
                    criarCardPersonalizado(
                        item,
                        "habilidade"
                    )
                );
            });
    }
}

function removerPersonalizado(
    id,
    tipo
) {
    if (
        tipo === "poder"
    ) {
        estado.poderesPersonalizados =
            estado.poderesPersonalizados.filter(
                item =>
                    item.id !== id
            );
    } else {
        estado.habilidadesPersonalizadas =
            estado.habilidadesPersonalizadas.filter(
                item =>
                    item.id !== id
            );
    }

    salvarEstado();
    renderizarPersonalizados();
}

function rolarPoderPersonalizado(
    id
) {
    const poder =
        estado.poderesPersonalizados.find(
            item =>
                item.id === id
        );

    if (
        !poder ||
        !poder.dano
    ) {
        return;
    }

    const dano =
        rolarDano(
            poder.dano
        );

    mostrarResultado(
        poder.nome ||
            "PODER",

        [
            [
                "DANO",
                dano
            ]
        ]
    );
}

function limparFormulario() {
    document.getElementById(
        "novo-nome"
    ).value = "";

    document.getElementById(
        "novo-descricao"
    ).value = "";

    document.getElementById(
        "novo-dano"
    ).value = "";

    document.getElementById(
        "novo-buffs"
    ).value = "";
}

function calcularDanoRecebido() {
    const entrada =
        document.getElementById(
            "dano-recebido"
        );

    const resultado =
        document.getElementById(
            "resultado-dano"
        );

    const dano =
        Number(entrada.value);

    if (
        !dano ||
        dano <= 0
    ) {
        resultado.querySelector(
            "strong"
        ).textContent = "0";

        return;
    }

    const defesa = 65;

    const danoFinal =
        Math.max(
            0,
            dano - defesa
        );

    const pvAnterior =
        estado.pvAtual;

    estado.pvAtual =
        Math.max(
            0,
            estado.pvAtual -
                danoFinal
        );

    if (
        estado.pvAtual <
            pvAnterior &&
        estado.pvAtual > 0
    ) {
        estado.equalizeAcumulado +=
            5;
    }

    if (
        estado.pvAtual <= 0
    ) {
        estado.pvAtual = 0;
        estado.equalizeAcumulado = 0;
    }

    salvarEstado();
    atualizarInterface();

    resultado.querySelector(
        "strong"
    ).textContent =
        danoFinal;

    mostrarResultado(
        "DANO RECEBIDO",
        [
            [
                "DANO ORIGINAL",
                dano
            ],

            [
                "DEFESA",
                defesa
            ],

            [
                "DANO SOFRIDO",
                danoFinal
            ],

            [
                "PV RESTANTE",
                `${estado.pvAtual} / 200`
            ]
        ],
        danoFinal > 0
            ? "DANO APLICADO"
            : "DANO NEGADO"
    );

    entrada.value = "";
}

function rolarDadoPersonalizado() {
    const entrada =
        document.getElementById(
            "dado-personalizado"
        );

    const expressao =
        entrada.value
            .trim()
            .toLowerCase();

    if (!expressao) {
        return;
    }

    try {
        const resultado =
            rolarDano(
                expressao
            );

        mostrarResultado(
            "DADO PERSONALIZADO",
            [
                [
                    "ROLAGEM",
                    expressao
                ],

                [
                    "RESULTADO",
                    resultado
                ]
            ]
        );
    } catch {
        mostrarResultado(
            "DADO PERSONALIZADO",
            [
                [
                    "ERRO",
                    "Expressão inválida"
                ]
            ]
        );
    }

    entrada.value = "";
}

function configurarRecursos() {
    const recursos = [
        [
            "pv-atual",
            "pvAtual",
            200
        ],

        [
            "pe-atual",
            "peAtual",
            120
        ],

        [
            "san-atual",
            "sanAtual",
            280
        ],

        [
            "pm-atual",
            "pmAtual",
            260
        ]
    ];

    recursos.forEach(
        (
            [
                id,
                propriedade,
                maximo
            ]
        ) => {
            const elemento =
                document.getElementById(
                    id
                );

            elemento.addEventListener(
                "change",
                () => {
                    const anterior =
                        estado[
                            propriedade
                        ];

                    let novo =
                        Number(
                            elemento.value
                        );

                    if (
                        Number.isNaN(
                            novo
                        )
                    ) {
                        novo =
                            anterior;
                    }

                    novo =
                        Math.max(
                            0,
                            Math.min(
                                maximo,
                                novo
                            )
                        );

                    estado[
                        propriedade
                    ] = novo;

                    if (
                        propriedade ===
                            "pvAtual" &&
                        novo < anterior
                    ) {
                        estado.equalizeAcumulado +=
                            5;
                    }

                    if (
                        propriedade ===
                            "pvAtual" &&
                        novo <= 0
                    ) {
                        estado.equalizeAcumulado =
                            0;
                    }

                    salvarEstado();
                    atualizarInterface();
                }
            );
        }
    );
}

function configurarEventos() {
    document
        .querySelectorAll(
            ".atributo"
        )
        .forEach(botao => {
            botao.addEventListener(
                "click",
                () => {
                    rolarAtributo(
                        botao.dataset
                            .atributo
                    );
                }
            );
        });

    document
        .querySelectorAll(
            ".pericia"
        )
        .forEach(botao => {
            botao.addEventListener(
                "click",
                () => {
                    rolarPericia(
                        botao.dataset
                            .pericia
                    );
                }
            );
        });

    document
        .querySelectorAll(
            ".botao-rolar-poder"
        )
        .forEach(botao => {
            botao.addEventListener(
                "click",
                () => {
                    rolarPoder(
                        botao.dataset
                            .poder
                    );
                }
            );
        });

    document
        .querySelectorAll(
            ".botao-rolar-arma"
        )
        .forEach(botao => {
            botao.addEventListener(
                "click",
                () => {
                    rolarAtaque(
                        botao.dataset
                            .arma
                    );
                }
            );
        });

    document
        .getElementById(
            "buff-concentracao"
        )
        .addEventListener(
            "change",
            evento => {
                estado.buffs.concentracao =
                    evento.target.checked;

                salvarEstado();
                atualizarInterface();
            }
        );

    document
        .getElementById(
            "buff-raca"
        )
        .addEventListener(
            "change",
            evento => {
                estado.buffs.racaSuperior =
                    evento.target.checked;

                salvarEstado();
                atualizarInterface();
            }
        );

    document
        .getElementById(
            "btn-xp"
        )
        .addEventListener(
            "click",
            () => {
                adicionarXP(
                    document.getElementById(
                        "xp-adicionar"
                    ).value
                );
            }
        );

    document
        .getElementById(
            "xp-adicionar"
        )
        .addEventListener(
            "keydown",
            evento => {
                if (
                    evento.key ===
                    "Enter"
                ) {
                    adicionarXP(
                        evento.target
                            .value
                    );
                }
            }
        );

    document
        .getElementById(
            "btn-dano"
        )
        .addEventListener(
            "click",
            calcularDanoRecebido
        );

    document
        .getElementById(
            "btn-dado"
        )
        .addEventListener(
            "click",
            rolarDadoPersonalizado
        );

    document
        .getElementById(
            "dado-personalizado"
        )
        .addEventListener(
            "keydown",
            evento => {
                if (
                    evento.key ===
                    "Enter"
                ) {
                    rolarDadoPersonalizado();
                }
            }
        );

    document
        .getElementById(
            "btn-adicionar"
        )
        .addEventListener(
            "click",
            adicionarPersonalizado
        );

    document
        .getElementById(
            "fechar-resultado"
        )
        .addEventListener(
            "click",
            () => {
                document
                    .getElementById(
                        "resultado-overlay"
                    )
                    .classList.remove(
                        "ativo"
                    );
            }
        );

    document
        .getElementById(
            "resultado-overlay"
        )
        .addEventListener(
            "click",
            evento => {
                if (
                    evento.target.id ===
                    "resultado-overlay"
                ) {
                    evento.currentTarget
                        .classList.remove(
                            "ativo"
                        );
                }
            }
        );
}

configurarRecursos();
configurarEventos();
atualizarInterface();
renderizarPersonalizados();