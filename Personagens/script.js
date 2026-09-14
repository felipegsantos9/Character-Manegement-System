const personagens = {
    marcelo: {
        nivel: 6
    },

    kylie: {
        nivel: 1
    },

    gabrielly: {
        nivel: 1
    }
};


function carregarPersonagem(id) {
    const dadosSalvos = localStorage.getItem(`personagem_${id}`);

    if (dadosSalvos) {
        return {
            ...personagens[id],
            ...JSON.parse(dadosSalvos)
        };
    }

    return personagens[id];
}


function formatarAcesso(data) {
    if (!data) {
        return "Nunca acessado";
    }

    const agora = new Date();
    const acesso = new Date(data);

    const diferenca = agora - acesso;
    const minutos = Math.floor(diferenca / 60000);

    if (minutos < 1) {
        return "Agora";
    }

    if (minutos < 60) {
        return `Há ${minutos} min`;
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
        return `Há ${horas}h`;
    }

    const dias = Math.floor(horas / 24);

    if (dias === 1) {
        return `Ontem, ${acesso.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })}`;
    }

    return acesso.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


function atualizarCards() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        const id = card.dataset.personagem;
        const personagem = carregarPersonagem(id);

        if (!personagem) {
            return;
        }

        const nivel = card.querySelector(".nivel");
        const acesso = card.querySelector(".acesso");

        if (nivel) {
            nivel.textContent = String(personagem.nivel).padStart(2, "0");
        }

        if (acesso) {
            acesso.textContent = formatarAcesso(personagem.ultimoAcesso);
        }

    });
}


function registrarEntrada(id) {

    const personagem = carregarPersonagem(id);

    if (!personagem) {
        return;
    }

    personagem.ultimoAcesso = new Date().toISOString();

    localStorage.setItem(
        `personagem_${id}`,
        JSON.stringify(personagem)
    );
}


function configurarEntradas() {

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        const id = card.dataset.personagem;

        card.addEventListener("click", () => {
            registrarEntrada(id);
        });

    });
}


function atualizarQuantidade() {

    const quantidade = Object.keys(personagens).length;

    const contador = document.getElementById("quantidade-registros");
    const texto = document.getElementById("contador-registros");

    if (contador) {
        contador.textContent = String(quantidade).padStart(2, "0");
    }

    if (texto) {
        texto.textContent = `${String(quantidade).padStart(2, "0")} REGISTROS`;
    }
}


atualizarCards();
configurarEntradas();
atualizarQuantidade();