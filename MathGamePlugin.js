/*:
 * @plugindesc Mini-jogo de matemática com função startMathGame()
 * @help
 * Use em eventos: Script → startMathGame();
 * Defina a variável #28 (Dificuldade) antes de chamar, se quiser.
 */

(function() {

  // Função auxiliar: número aleatório entre a e b
  function randInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  // Gera dois números conforme a dificuldade
  function gerarNumeros(diff) {
    if (diff === 0) return [randInt(1, 10), randInt(1, 10)];
    if (diff === 1) return [randInt(5, 20), randInt(2, 15)];
    return [randInt(10, 50), randInt(2, 20)];
  }

  // Função principal disponível globalmente
  window.startMathGame = function() {
    const diff = $gameVariables.value(28) || 0;
    const opType = Math.floor(Math.random() * 3); // 0:+ 1:- 2:*
    $gameVariables.setValue(25, opType);

    const [a0, b0] = gerarNumeros(diff);
    let a = a0, b = b0;

    // Evita resultado negativo na subtração
    if (opType === 1 && a < b) [a, b] = [b, a];

    $gameVariables.setValue(21, a);
    $gameVariables.setValue(22, b);

    let result = 0;
    if (opType === 0) result = a + b;
    else if (opType === 1) result = a - b;
    else result = a * b;

    $gameVariables.setValue(23, result);
    $gameVariables.setValue(29, 1);      // game rodando
    $gameVariables.setValue(26, 10);     // 10 segundos
    $gameTimer.start(10 * 60);           // inicia timer visual
  };

})();
