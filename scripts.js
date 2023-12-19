//Capturando as tag's do HTML para serem usadas no Javascript
const inputPergunta = document.getElementById("inputPergunta");
const resultado = document.getElementById("resultado");
const enviarPergunta = document.querySelector("#container-button button");

//Capturando as ações de digitação dentro do inputPergunta(textarea) e de click no botão para quando forem clicados, chamarem a próxima função, que faz a requisição na api.
inputPergunta.addEventListener("keypress", (e) => {
    if (inputPergunta.value && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Impede que a pergunta seja enviada no momento que teclar enter segurando o shift. Ou seja, permite a quebra de linha sem enviar a pergunta.
        SendQuestion();
    }
});

enviarPergunta.addEventListener("click", () => {
    if (inputPergunta.value) {
        SendQuestion();
    }
});

// Declarando API_KEY no escopo global, para conseguir ser utilizada dentro de qualquer função. DENTRO DAS ASPAS DEVE SER INFORMADO A KEY DA API
const API_KEY = "";


//Função que faz a requisição na API, passando no Authorization a chave da API e no prompt o texto que foi digitado no input de pergunta.
function SendQuestion() {
    var sQuestion = inputPergunta.value;

    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: sQuestion,
            max_tokens: 2048,
            temperature: 0.5,
        }),
    })
        // Recebimento da resposta da API e tratamento de dados (sejam eles de erros ou a resposta correta em si).
        .then((response) => response.json())
        .then((json) => {
            if (resultado.value) resultado.value += "\n \n";

            if (json.error?.message) {
                resultado.value += `Error: ${json.error.message}`;
            } else if (json.choices?.[0].text) {
                var text = json.choices[0].text || "Sem resposta";

                resultado.value += "Resposta da IA: " + text;
            }

            resultado.scrollTop = resultado.scrollHeight;
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
            inputPergunta.value = "";
            inputPergunta.disabled = false;
            inputPergunta.focus();
        });

    if (resultado.value) resultado.value += "\n\n\n";

    resultado.value += `Pergunta: ${sQuestion}`;
    inputPergunta.value = "Carregando...";
    inputPergunta.disabled = true;

    resultado.scrollTop = resultado.scrollHeight;
}