const formulario = document.querySelector("form")
const iName = document.querySelector(".name")
const iBirthDate = document.querySelector(".birth-date")
const pessoaList = document.getElementById('pessoa-list');


function formatarData(vData) {

    var data = new Date(vData);
    
    var dia = String(data.getDate()).padStart(2,'0');
    var mes = String(data.getMonth() + 1).padStart(2,'0'); // Os meses começam do zero, então adicionamos 1
    var ano = data.getFullYear();

    var dataFormatada = dia + '/' + mes + '/' + ano;
    return dataFormatada;
}


function validarNome() {

    var valor = iName.value.trim(); // Remove espaços em branco do início e do fim
    var isValid = true;

    console.log(valor)

    // Verificar se o nome atende aos critérios de comprimento mínimo e máximo
    if (valor.length < 3 || valor.length > 120) {
        iName.setCustomValidity("Por favor, nome de ter no mínimo 3 e no máximo 120 caracteres.");
        alert("Por favor, nome de ter no mínimo 3 e no máximo 120 caracteres.");
        isValid = false;;
    }

    // Permite letras maiúsculas/minúsculas/acentuadas e espaço
    var regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/; 
    if (!regex.test(valor)) {
        iName.setCustomValidity("Por favor, insira apenas letras.");
        alert("Por favor, insira apenas letras no Nome.");
        isValid = false;
    } else {
        iName.setCustomValidity("");
    }
    return isValid;
       
}

function salvarPessoa() {

    // var dataNiver = formatarData(iBirthDate.value);

    if (validarNome()) {
        // Cria um objeto representando a pessoa
        var pessoa = {
            nome: iName.value,
            dataNascimento: iBirthDate.value
        };

        // Recupera o array de pessoas do localStorage
        var pessoasSalvas = localStorage.getItem('arpessoas');

        // Verifica se há dados no localStorage
        if (pessoasSalvas) {
            // Converte a string JSON de volta para um array
            var pessoas = JSON.parse(pessoasSalvas);
        } else {
            // Se não houver dados no localStorage, inicializa um novo array vazio
            var pessoas = [];
        }

        // Acrescenta a nova pessoa ao array existente
        pessoas.push(pessoa);

        // Salva o array atualizado no localStorage
        localStorage.setItem('arpessoas', JSON.stringify(pessoas));
        renderTable();

        // Exibe uma mensagem de confirmação
        console.log("Pessoa salva localmente com sucesso!");
    }

}

// Função para editar ou excluir uma pessoa
function gerenciarPessoa(index, acao) {
    // Implemente a lógica de edição aqui
    var pessoas = JSON.parse(localStorage.getItem('arpessoas')) || [];

    // Verificar se o índice fornecido está dentro dos limites do array
    if (index >= 0 && index < pessoas.length) {
        console.log('Acao', acao);
   
        if (acao == 'U') {
            if (validarNome()) {
                // Atualizar os dados no Local Storage
                const novaPessoa = { nome: iName.value, dataNascimento: iBirthDate.value };
                
                // Substituir a pessoa no índice especificado
                pessoas[index] = novaPessoa;                
            }
            
        } else {
            pessoas.splice(index, 1);
        }

        localStorage.setItem('arpessoas', JSON.stringify(pessoas));
        renderTable();
    } else {
        console.error('Índice fora dos limites');
    }

}

// Função para editar uma pessoa
function editarPessoa(index) {
    // Implemente a lógica de edição aqui
    console.log('Editar pessoa de índice', index);
    gerenciarPessoa(index, 'U'); //Update
}

// Função para excluir uma pessoa
function excluirPessoa(index) {
    // Implemente a lógica de exclusão aqui
    console.log('Excluir pessoa de índice', index);
    gerenciarPessoa(index, 'R'); //Remove
}

// Função para renderizar a tabela
function renderTable() {
    pessoaList.innerHTML = '';

    // Carregar os dados do Local Storage
    const pessoas = JSON.parse(localStorage.getItem('arpessoas')) || [];

    pessoas.forEach((pessoa, index) => {
        const tr = document.createElement('tr');

        // Coluna de Nome da Pessoa
        const tdNome = document.createElement('td');
        tdNome.textContent = pessoa.nome;

        // Coluna de Data de Nascimento
        const tdDataNascimento = document.createElement('td');
        tdDataNascimento.textContent = pessoa.dataNascimento;

        // Coluna de Ação
        const tdAcao = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarPessoa(index));
        btnEditar.className = 'buttonUpdTable';

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirPessoa(index));
        btnExcluir.className = 'buttonExcTable';

        tdAcao.appendChild(btnEditar);
        tdAcao.appendChild(btnExcluir);

        // Adicionando as colunas à linha
        tr.appendChild(tdNome);
        tr.appendChild(tdDataNascimento);
        tr.appendChild(tdAcao);

        // Adicionando a linha à tabela
        pessoaList.appendChild(tr);
    });
}


function limpar() {
    iName.value = "";
    iBirthDate.value = "";
}


// Chama a função para exibir os dados da pessoa quando a página for carregada
window.onload = renderTable();

formulario.addEventListener("DOMContentLoaded", function() {
    var inputLetras = document.getElementById("name");

    // Carregar os dados do Local Storage
    const pessoas = JSON.parse(localStorage.getItem('arpessoas')) || [];

    // Renderizar a tabela inicialmente
    renderTable();
});

// Função que será chamada no evento submit do formulário
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    salvarPessoa()

    //limpar();
});

// console.log(formulario)