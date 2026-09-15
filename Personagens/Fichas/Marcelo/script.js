const STORAGE = "personagem_marcelo";

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

const maximos = {
    pv: 200,
    pe: 120,
    san: 280,
    pm: 260
};

const atributos = {
    FOR: 3,
    AGI: 3,
    VIG: 2,
    PRE: 2,
    INT: 3
};

const pericias = {
    Acrobacia: { atributo: "AGI", bonus: 5 },
    Alquimia: { atributo: "INT", bonus: 0 },
    Atletismo: { atributo: "FOR", bonus: 5 },
    Atualidades: { atributo: "INT", bonus: 0 },
    Adestramento: { atributo: "PRE", bonus: 0 },
    Artes: { atributo: "PRE", bonus: 0 },
    Crime: { atributo: "AGI", bonus: 0 },
    Ciências: { atributo: "INT", bonus: 0 },
    Carisma: { atributo: "PRE", bonus: 5 },
    Diplomacia: { atributo: "PRE", bonus: 5 },
    Enganação: { atributo: "PRE", bonus: 5 },
    Engenharia: { atributo: "INT", bonus: 0 },
    Furtividade: { atributo: "AGI", bonus: 0 },
    Fortitude: { atributo: "VIG", bonus: 32 },
    Iniciativa: { atributo: "AGI", bonus: 3 },
    Investigação: { atributo: "INT", bonus: 10 },
    Intimidação: { atributo: "PRE", bonus: 0 },
    Intuição: { atributo: "PRE", bonus: 0 },
    Luta: { atributo: "FOR", bonus: 5 },
    Magia: { atributo: "INT", bonus: 32 },
    Medicina: { atributo: "INT", bonus: 0 },
    Percepção: { atributo: "PRE", bonus: 10 },
    Profissão: { atributo: "INT", bonus: 0 },
    Pilotagem: { atributo: "AGI", bonus: 0 },
    Pontaria: { atributo: "AGI", bonus: 0 },
    Reflexos: { atributo: "AGI", bonus: 19 },
    Religião: { atributo: "PRE", bonus: 0 },
    Sobrevivência: { atributo: "INT", bonus: 0 },
    Tática: { atributo: "INT", bonus: 0 },
    Tecnologia: { atributo: "INT", bonus: 0 },
    Vontade: { atributo: "PRE", bonus: 5 }
};

const poderesFixos = {
    "Técnica Azul": {
        custo: 50,
        dano: "10d12",
        critico: 20,
        multiplicador: 2
    },

    "Técnica Vermelha": {
        custo: 50,
        dano: "10d12",
        critico: 20,
        multiplicador: 2
    },

    "Técnica Púrpura": {
        custo: 500,
        dano: "25d50",
        critico: 20,
        multiplicador: 2
    },

    "Amaterasu": {
        custo: 0,
        dano: "20d12",
        critico: 20,
        multiplicador: 5
    }
};

localStorage.removeItem("personagem_marcelo");
let estado = carregarEstado();

function estadoInicial() {
    return {
        pv: 200,
        pe: 120,
        san: 280,
        pm: 260,

        xp: 0,
        nivel: 7,

        equalizeAcumulado: 0,

        buffs: {
            concentracao: false,
            racaSuperior: false
        },

        habilidades: [],
        poderesCustom: []
    };
}

function carregarEstado() {
    const salvo = localStorage.getItem(STORAGE);

    if (!salvo) {
        return estadoInicial();
    }

    try {
        const dados = JSON.parse(salvo);
        const base = estadoInicial();

        return {
            ...base,
            ...dados,
            buffs: {
                ...base.buffs,
                ...(dados.buffs || {})
            },
            habilidades: dados.habilidades || [],
            poderesCustom: dados.poderesCustom || []
        };
    } catch {
        return estadoInicial();
    }
}

function salvar() {
    localStorage.setItem(STORAGE, JSON.stringify(estado));

    const arquivo = JSON.parse(localStorage.getItem("personagem_marcelo") || "{}");

    localStorage.setItem(
        "personagem_marcelo",
        JSON.stringify({
            ...arquivo,
            nivel: estado.nivel,
            xp: estado.xp,
            ultimoAcesso: new Date().toLocaleString("pt-BR")
        })
    );
}

function clamp(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

function atributoEfetivo(nome) {
    let valor = atributos[nome];

    if (estado.pv < 60) {
        valor += 1;
    }

    return valor;
}

function bonusPericia(nome) {
    let bonus = pericias[nome]?.bonus || 0;

    if (nome === "Magia") {
        bonus += estado.equalizeAcumulado;
    }

    if (estado.buffs.concentracao) {
        bonus += 20;
    }

    if (estado.buffs.racaSuperior) {
        bonus += 10;
    }

    estado.habilidades.forEach(habilidade => {
        if (
            habilidade.ativa &&
            habilidade.pericia === nome
        ) {
            bonus += habilidade.bonus;
        }
    });

    return bonus;
}

function defesaAtual() {
    return 65 + estado.equalizeAcumulado;
}

function atualizarRecursos() {
    atualizarRecursoVisual("pv");
    atualizarRecursoVisual("pe");
    atualizarRecursoVisual("san");
    atualizarRecursoVisual("pm");

    document.getElementById("status-pv").textContent = estado.pv;
}

function atualizarRecursoVisual(recurso) {
    const atual = estado[recurso];
    const maximo = maximos[recurso];

    document.getElementById(`${recurso}-atual`).textContent = atual;

    const barra = document.getElementById(`${recurso}-barra`);

    if (barra) {
        barra.style.width = `${(atual / maximo) * 100}%`;
    }
}

function atualizarDefesa() {
    document.getElementById("defesa-valor").textContent = defesaAtual();
    document.getElementById("equalize-valor").textContent =
        `+${estado.equalizeAcumulado}`;
}

function atualizarPericias() {
    Object.keys(pericias).forEach(nome => {
        const id = "pericia-" + normalizar(nome);
        const elemento = document.getElementById(id);

        if (!elemento) return;

        const bonus = bonusPericia(nome);

        elemento.textContent = `${bonus >= 0 ? "+" : ""}${bonus}`;

        const pai = elemento.closest(".pericia");

        if (!pai) return;

        pai.classList.remove("amarelo", "roxo", "vermelho");

        if (bonus >= 15) {
            pai.classList.add("vermelho");
        } else if (bonus >= 10) {
            pai.classList.add("roxo");
        } else if (bonus >= 5) {
            pai.classList.add("amarelo");
        }
    });
}

function atualizarAtributos() {
    Object.keys(atributos).forEach(nome => {
        const elemento = document.getElementById(`atributo-${nome}`);

        if (elemento) {
            elemento.textContent = atributoEfetivo(nome);
        }
    });
}

function atualizarXP() {
    document.getElementById("nivel").textContent = estado.nivel;
    document.getElementById("nivel-topo").textContent = estado.nivel;
    document.getElementById("xp-nivel").textContent = estado.nivel;
    document.getElementById("xp-atual").textContent = estado.xp;

    if (estado.nivel >= 20) {
        document.getElementById("xp-proximo").textContent = "NÍVEL MÁXIMO";
        document.getElementById("xp-progresso").style.width = "100%";
        return;
    }

    const necessario = xpPorNivel[estado.nivel + 1] || 30000;

    document.getElementById("xp-proximo").textContent =
        `/ ${necessario} XP`;

    const porcentagem =
        Math.min((estado.xp / necessario) * 100, 100);

    document.getElementById("xp-progresso").style.width =
        `${porcentagem}%`;
}

function atualizarBuffs() {
    atualizarBuffVisual("concentracao");
    atualizarBuffVisual("racaSuperior");
}

function atualizarBuffVisual(nome) {
    const id =
        nome === "concentracao"
            ? "buff-concentracao"
            : "buff-raca";

    const elemento = document.getElementById(id);

    if (!elemento) return;

    const botao = elemento.querySelector("button");

    elemento.classList.toggle("ativo", estado.buffs[nome]);

    botao.textContent =
        estado.buffs[nome]
            ? "ATIVO"
            : "ATIVAR";
}

function atualizarInterface() {
    atualizarRecursos();
    atualizarDefesa();
    atualizarPericias();
    atualizarAtributos();
    atualizarXP();
    atualizarBuffs();
    renderizarHabilidades();
    renderizarPoderesCustom();
}

function alterarRecurso(recurso, quantidade) {
    const anterior = estado[recurso];

    estado[recurso] = clamp(
        estado[recurso] + quantidade,
        0,
        maximos[recurso]
    );

    if (
        recurso === "pv" &&
        estado[recurso] < anterior
    ) {
        estado.equalizeAcumulado += 5;
    }

    if (
        recurso === "pv" &&
        estado.pv <= 0
    ) {
        estado.pv = 0;
        estado.equalizeAcumulado = 0;
    }

    salvar();
    atualizarInterface();
}

function receberDano() {
    const campo = document.getElementById("dano-input");
    const dano = Number(campo.value);

    if (!dano || dano <= 0) {
        mostrarResultado(
            "DANO RECEBIDO",
            "Digite uma quantidade de dano válida."
        );
        return;
    }

    const defesaAntes = defesaAtual();
    const danoPV = Math.max(0, dano - defesaAntes);

    const pvAntes = estado.pv;

    estado.pv = clamp(
        estado.pv - danoPV,
        0,
        maximos.pv
    );

    const perdeuPV = estado.pv < pvAntes;

    if (perdeuPV) {
        estado.equalizeAcumulado += 5;
    }

    if (estado.pv <= 0) {
        estado.pv = 0;
        estado.equalizeAcumulado = 0;
    }

    salvar();
    atualizarInterface();

    document.getElementById("dano-resultado").textContent =
        `${dano} de dano recebido • ${defesaAntes} absorvido pela Defesa • ${danoPV} de dano aplicado ao PV`;

    campo.value = "";

    mostrarResultado(
        "DANO RECEBIDO",
        `Dano: ${dano}
Defesa: ${defesaAntes}
Dano aplicado: ${danoPV}
PV restante: ${estado.pv}
Equalize: +${estado.equalizeAcumulado} Defesa / Magia`
    );
}

function rolarAtributo(nome) {
    const quantidade = atributoEfetivo(nome);
    const resultados = rolarMultiplosD20(quantidade);
    const maior = Math.max(...resultados);

    mostrarResultado(
        nome,
        `Rolagem: ${resultados.join(" • ")}
Resultado: ${maior}`
    );
}

function rolarPericia(nome) {
    const atributo = pericias[nome].atributo;
    const quantidade = atributoEfetivo(atributo);
    const bonus = bonusPericia(nome);

    const resultados = rolarMultiplosD20(quantidade);
    const maior = Math.max(...resultados);

    const total = maior + bonus;

    mostrarResultado(
        nome,
        `Dados: ${resultados.join(" • ")}
Maior dado: ${maior}
Bônus: ${bonus >= 0 ? "+" : ""}${bonus}
Resultado final: ${total}`
    );
}

function rolarMultiplosD20(quantidade) {
    const resultados = [];

    for (let i = 0; i < quantidade; i++) {
        resultados.push(d20());
    }

    return resultados;
}

function usarPoder(nome) {
    const poder = poderesFixos[nome];

    if (!poder) return;

    if (!gastarPM(poder.custo)) return;

    const ataque = rolarAtaque();
    let dano = rolarDados(poder.dano);

    let critico = false;
    const multiplicador = poder.multiplicador || 2;

    if (ataque === poder.critico) {
        critico = true;
        dano *= multiplicador;
    }

    if (estado.buffs.concentracao) {
        dano += 20;
    }

    mostrarResultado(
        nome,
        `Ataque: ${ataque}
${critico ? `CRÍTICO! Dano ×${multiplicador}` : "Ataque normal"}
Dano: ${dano}`
    );
}

function usarArma() {
    const resultados = rolarMultiplosD20(atributoEfetivo("INT"));
    const ataque = Math.max(...resultados);

    const dano12 = rolarDados("6d12");
    const dano8 = rolarDados("3d8");
    let dano = dano12 + dano8;

    let critico = false;
    const multiplicador = 4;

    if (ataque === 19 || ataque === 20) {
        critico = true;
        dano *= multiplicador;
    }

    if (estado.buffs.concentracao) {
        dano += 20;
    }

    mostrarResultado(
        "BAIXO ELÉTRICO MUITO AURA",
        `Ataque: ${ataque}
${critico ? `CRÍTICO! Dano ×${multiplicador}` : "Ataque normal"}
Dano: ${dano}`
    );
}

function rolarAtaque() {
    const quantidade = atributoEfetivo("INT");
    const resultados = rolarMultiplosD20(quantidade);

    return Math.max(...resultados);
}

function gastarPM(custo) {
    if (estado.pm < custo) {
        estado.pm = 0;
        estado.pv = 0;
        estado.equalizeAcumulado = 0;

        salvar();
        atualizarInterface();

        mostrarResultado(
            "MANA INSUFICIENTE",
            `O poder exigia ${custo} PM.

Marcelo não possuía PM suficiente.

PM: 0
PV: 0`
        );

        return false;
    }

    estado.pm -= custo;

    salvar();
    atualizarInterface();

    return true;
}

function rolarDados(expressao) {
    const dados = parseDados(expressao);

    if (!dados.length) {
        return 0;
    }

    return dados.reduce((total, valor) => total + valor, 0);
}


function parseDados(expressao) {
    const match = String(expressao)
        .trim()
        .match(/^(\d+)d(\d+)$/i);

    if (!match) return [];

    const quantidade = Number(match[1]);
    const lados = Number(match[2]);

    const resultados = [];

    for (let i = 0; i < quantidade; i++) {
        resultados.push(
            Math.floor(Math.random() * lados) + 1
        );
    }

    return resultados;
}

function d20() {
    return Math.floor(Math.random() * 20) + 1;
}

function adicionarXP() {
    const campo = document.getElementById("xp-input");
    let quantidade = Number(campo.value);

    if (!quantidade || quantidade <= 0) {
        return;
    }

    estado.xp += quantidade;

    while (
        estado.nivel < 20 &&
        estado.xp >= (xpPorNivel[estado.nivel + 1] || Infinity)
    ) {
        estado.xp -= xpPorNivel[estado.nivel + 1];
        estado.nivel++;
    }

    salvar();
    atualizarInterface();

    campo.value = "";
}

function alternarBuff(nome) {
    estado.buffs[nome] =
        !estado.buffs[nome];

    salvar();
    atualizarInterface();
}

function adicionarHabilidade() {
    const nome =
        document.getElementById("habilidade-nome").value.trim();

    const pericia =
        document.getElementById("habilidade-pericia").value;

    const bonus =
        Number(document.getElementById("habilidade-bonus").value);

    const descricao =
        document.getElementById("habilidade-descricao").value.trim();

    if (!nome || !pericia || Number.isNaN(bonus)) {
        return;
    }

    estado.habilidades.push({
        id: Date.now(),
        nome,
        pericia,
        bonus,
        descricao,
        ativa: false
    });

    salvar();
    atualizarInterface();

    document.getElementById("habilidade-nome").value = "";
    document.getElementById("habilidade-pericia").value = "";
    document.getElementById("habilidade-bonus").value = "";
    document.getElementById("habilidade-descricao").value = "";
}

function renderizarHabilidades() {
    const lista =
        document.getElementById("lista-habilidades");

    lista.innerHTML = "";

    estado.habilidades.forEach(habilidade => {
        const elemento = document.createElement("article");

        elemento.className =
            `custom-item ${habilidade.ativa ? "ativo" : ""}`;

        elemento.innerHTML = `
            <div class="custom-item-top">
                <div>
                    <h3>${escapeHTML(habilidade.nome)}</h3>
                    <p>${escapeHTML(habilidade.descricao || "Sem descrição.")}</p>
                    <span>
                        ${escapeHTML(habilidade.pericia)}
                        ${habilidade.bonus >= 0 ? "+" : ""}
                        ${habilidade.bonus}
                    </span>
                </div>

                <div>
                    <button onclick="alternarHabilidade(${habilidade.id})">
                        ${habilidade.ativa ? "DESATIVAR" : "ATIVAR"}
                    </button>

                    <button onclick="removerHabilidade(${habilidade.id})">
                        EXCLUIR
                    </button>
                </div>
            </div>
        `;

        lista.appendChild(elemento);
    });
}

function alternarHabilidade(id) {
    const habilidade =
        estado.habilidades.find(h => h.id === id);

    if (!habilidade) return;

    habilidade.ativa = !habilidade.ativa;

    salvar();
    atualizarInterface();
}

function removerHabilidade(id) {
    estado.habilidades =
        estado.habilidades.filter(h => h.id !== id);

    salvar();
    atualizarInterface();
}

function adicionarPoder() {
    const nome =
        document.getElementById("poder-nome").value.trim();

    const dano =
        document.getElementById("poder-dano").value.trim();

    const custo =
        Number(document.getElementById("poder-custo").value);

    const descricao =
        document.getElementById("poder-descricao").value.trim();

    if (
        !nome ||
        !dano ||
        Number.isNaN(custo)
    ) {
        return;
    }

    estado.poderesCustom.push({
        id: Date.now(),
        nome,
        dano,
        custo,
        descricao
    });

    salvar();
    atualizarInterface();

    document.getElementById("poder-nome").value = "";
    document.getElementById("poder-dano").value = "";
    document.getElementById("poder-custo").value = "";
    document.getElementById("poder-descricao").value = "";
}

function renderizarPoderesCustom() {
    const lista =
        document.getElementById("lista-poderes");

    lista.innerHTML = "";

    estado.poderesCustom.forEach(poder => {
        const elemento = document.createElement("article");

        elemento.className = "custom-item";

        elemento.innerHTML = `
            <div class="custom-item-top">
                <div>
                    <h3>${escapeHTML(poder.nome)}</h3>
                    <p>${escapeHTML(poder.descricao || "Sem descrição.")}</p>
                    <span>${escapeHTML(poder.dano)} • ${poder.custo} PM</span>
                </div>

                <div>
                    <button onclick="usarPoderCustom(${poder.id})">
                        USAR
                    </button>

                    <button onclick="removerPoder(${poder.id})">
                        EXCLUIR
                    </button>
                </div>
            </div>
        `;

        lista.appendChild(elemento);
    });
}

function usarPoderCustom(id) {
    const poder =
        estado.poderesCustom.find(p => p.id === id);

    if (!poder) return;

    if (!gastarPM(poder.custo)) {
        return;
    }

    const ataque = rolarAtaque();

    let dano;

    try {
        dano = rolarDados(poder.dano);
    } catch {
        dano = 0;
    }

    let critico = false;

    if (ataque === 20) {
        critico = true;
        dano += rolarDados(poder.dano);
    }

    if (estado.buffs.concentracao) {
        dano += 20;
    }

    mostrarResultado(
        poder.nome,
        `Ataque: ${ataque}
${critico ? "CRÍTICO!" : "Ataque normal"}

Dano: ${dano}`
    );
}

function removerPoder(id) {
    estado.poderesCustom =
        estado.poderesCustom.filter(p => p.id !== id);

    salvar();
    atualizarInterface();
}

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function escapeHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function mostrarResultado(titulo, conteudo) {
    document.getElementById("modal-titulo").textContent = titulo;

    document.getElementById("modal-conteudo").innerHTML =
        escapeHTML(conteudo).replaceAll("\n", "<br>");

    document.getElementById("modal").classList.add("aberto");
}

function fecharModal() {
    document.getElementById("modal").classList.remove("aberto");
}

document.getElementById("modal").addEventListener("click", event => {
    if (event.target.id === "modal") {
        fecharModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharModal();
    }
});

atualizarInterface();