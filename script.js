const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

// Variáveis de controle
let currentNumber = ""; // Armazena o número atual digitado
let firstOperand = null; // Armazena o primeiro operando para operações
let operator = null; // Armazena o operador atual (+, -, x, ÷)
let restart = false; // Indica se o próximo número deve substituir o atual

// Atualiza o visor da calculadora
function updateResult(originClear = false) {
    // Se originClear for true, exibe 0; caso contrário, formata o número com ponto e vírgula
    if (originClear) {
        result.innerText = 0;
    } else {
        // Substitui a vírgula por ponto para garantir que seja interpretado corretamente
        const formattedNumber = parseFloat(currentNumber.replace(",", "."))
            .toLocaleString("pt-BR") // Formata o número para o formato brasileiro
            .replace(",", "."); // Substitui o ponto de volta para vírgula

        result.innerText = formattedNumber;
    }
}

// Restante do código permanece igual

// Adiciona um dígito ao número atual
function addDigit(digit) {
    // Impede a adição de mais de uma vírgula ou de iniciar com uma vírgula
    if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return;

    // Se a calculadora estiver em modo de reinício, substitui o número atual
    if (restart) {
        currentNumber = digit;
        restart = false;
    } else {
        // Caso contrário, adiciona o dígito ao número atual
        currentNumber += digit;
    }

    updateResult(); // Atualiza o visor
}

// Define o operador matemático (+, -, x, ÷)
function setOperator(newOperator) {
    if (currentNumber) {
        calculate(); // Calcula o resultado se já houver um operador definido

        // Converte o número atual para número decimal e armazena como primeiro operando
        firstOperand = parseFloat(currentNumber.replace(",", "."));
        currentNumber = ""; // Reseta o número atual
    }

    operator = newOperator; // Define o novo operador
}

// Realiza o cálculo baseado no operador e operandos
function calculate() {
    if (operator === null || firstOperand === null) return; // se não houver operador ou operando
    let secondOperand = parseFloat(currentNumber.replace(",", ".")); // Converte o número atual para decimal
    let resultValue;

    // Executa a operação matemática baseada no operador
    switch (operator) {
        case "+":
            resultValue = firstOperand + secondOperand;
            break;
        case "-":
            resultValue = firstOperand - secondOperand;
            break;
        case "x":
            resultValue = firstOperand * secondOperand;
            break;
        case "÷":
            resultValue = firstOperand / secondOperand;
            break;
        default:
            return; //se o operador for inválido
    }

    // Ajusta o resultado para exibir no máximo 5 casas decimais
    if (resultValue.toString().split(".")[1]?.length > 5) {
        currentNumber = parseFloat(resultValue.toFixed(5)).toString();
    } else {
        currentNumber = resultValue.toString();
    }

    // Reseta as variáveis e atualiza o visor
    operator = null;
    firstOperand = null;
    restart = true;
    updateResult();
}

// Limpa a calculadora e reseta os valores
function clearCalculator() {
    currentNumber = "";
    firstOperand = null;
    operator = null;
    updateResult(true); // Reseta o visor para "0"
}

// Calcula a porcentagem do número atual
function setPercentage() {
    let result = parseFloat(currentNumber) / 100;

    // Ajusta o resultado se o operador for "+" ou "-"
    if (["+", "-"].includes(operator)) {
        result = result * (firstOperand || 1);
    }

    // Limita o resultado a 5 casas decimais se necessário
    if (result.toString().split(".")[1]?.length > 5) {
        result = result.toFixed(5).toString();
    }

    currentNumber = result.toString(); // Atualiza o número atual com o valor percentual
    updateResult();
}

// Adiciona eventos de clique a todos os botões
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.innerText; // Obtém o texto do botão clicado

        // Verifica o tipo de botão e executa a ação correspondente
        if (/^[0-9,]+$/.test(buttonText)) {
            addDigit(buttonText); // Se for um número ou vírgula, adiciona ao número atual
        } else if (["+", "-", "x", "÷"].includes(buttonText)) {
            setOperator(buttonText); // Define o operador se for um botão de operação
        } else if (buttonText === "=") {
            calculate(); // Calcula o resultado
        } else if (buttonText === "C") {
            clearCalculator(); // Limpa a calculadora
        } else if (buttonText === "±") {
            // Inverte o sinal do número atual ou do primeiro operando
            currentNumber = (
                parseFloat(currentNumber || firstOperand) * -1
            ).toString();
            updateResult();
        } else if (buttonText === "%") {
            setPercentage(); // Calcula a porcentagem
        }
    });
});


