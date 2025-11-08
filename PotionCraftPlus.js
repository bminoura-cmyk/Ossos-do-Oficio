/*:
 * @plugindesc Sistema de criação de poções com aviso de ingredientes e animação ✨
 * @author ChatGPT
 *
 * @help
 * Use o comando de evento:
 *   CraftPotion
 *
 * Exemplo de receita:
 * 2 Ervas (ID 1) + 1 Água (ID 2) = 1 Poção de Cura (ID 3)
 */

(function() {

    const recipe = {
        ingredients: [
            { id: 5, name: "Seiva de raíz branca", qty: 1 },
            { id: 6, name: "Pó de flor da Lua", qty: 1 },
            { id: 7, name: "Néctar Violeta", qty: 1 }

        ],
        result: { id: 1, name: "Antídoto fase 1", qty: 1 },
        animationId: 42,
        soundEffect: { name: "Magic1", volume: 90, pitch: 100, pan: 0 }
    };

    function missingIngredients() {
        let missing = [];
        recipe.ingredients.forEach(ing => {
            const have = $gameParty.numItems($dataItems[ing.id]);
            if (have < ing.qty) {
                missing.push(`${ing.name}: falta ${ing.qty - have}`);
            }
        });
        return missing;
    }

    function removeIngredients() {
        recipe.ingredients.forEach(ing => {
            $gameParty.loseItem($dataItems[ing.id], ing.qty, false);
        });
    }

    function giveResult() {
        $gameParty.gainItem($dataItems[recipe.result.id], recipe.result.qty, false);
    }

    function playAnimation() {
        const player = $gamePlayer;
        if (player) {
		$gameMap.requestAnimation([$gamePlayer], recipe.animationId);
        }
        AudioManager.playSe(recipe.soundEffect);
    }
	function craftPotion() {
		console.log("Plugin detectado: tentando criar poção..."); // Debug
		const missing = missingIngredients();
		if (missing.length === 0) {
			removeIngredients();
			playAnimation();
			giveResult();
			$gameMessage.add(`✨ Você criou uma ${recipe.result.name}!`);
		} else {
			$gameMessage.add("❌ Ingredientes insuficientes:\n- " + missing.join("\n- "));
		}
	}


    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command && command.toLowerCase() === "craftpotion") {
            craftPotion();
        }
    };

})();

