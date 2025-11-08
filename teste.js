/*:
 * @plugindesc Adiciona "Lista de Coleta" ao menu principal, mostrando o progresso de coleta de ingredientes. 
 * @author Be Mi
 *
 * @help
 * =========================================================
 * Plugin: IngredientListMenu.js
 * =========================================================
 * 
 * ➤ O que faz:
 * Adiciona uma opção "Lista de Coleta" no menu principal.
 * Mostra os ingredientes que o jogador precisa coletar,
 * quantos ele já tem e quantos faltam.
 * 
 * ➤ Como configurar:
 * Vá até a parte marcada no código:
 *     const ingredients = [
 *         { id: 1, needed: 3 },
 *         { id: 2, needed: 5 },
 *         { id: 3, needed: 2 }
 *     ];
 * 
 * Troque os IDs e as quantidades conforme seu jogo.
 * - id: é o ID do item no banco de dados
 * - needed: é o total que o jogador deve coletar
 * 
 * =========================================================
 */

(function() {
    "use strict";

    // --- Adiciona o comando "Lista de Coleta" ao menu principal ---
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand("📜 Lista de Coleta", "ingredientList", true);
    };

    // --- Liga o comando à cena personalizada ---
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("ingredientList", this.commandIngredientList.bind(this));
    };

    Scene_Menu.prototype.commandIngredientList = function() {
        SceneManager.push(Scene_IngredientList);
    };

    // =========================
    // Cena personalizada
    // =========================
    function Scene_IngredientList() {
        this.initialize(...arguments);
    }

    Scene_IngredientList.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_IngredientList.prototype.constructor = Scene_IngredientList;

    Scene_IngredientList.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createIngredientWindow();
    };

    Scene_IngredientList.prototype.createIngredientWindow = function() {
        const rect = this.windowRect();
        this._ingredientWindow = new Window_IngredientList(rect);
        this.addWindow(this._ingredientWindow);
    };

    Scene_IngredientList.prototype.windowRect = function() {
        const ww = 520;
        const wh = 380;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_IngredientList.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered('cancel')) {
            SoundManager.playCancel();
            SceneManager.pop();
        }
    };

    // =========================
    // Janela da lista de coleta
    // =========================
    function Window_IngredientList() {
        this.initialize(...arguments);
    }

    Window_IngredientList.prototype = Object.create(Window_Base.prototype);
    Window_IngredientList.prototype.constructor = Window_IngredientList;

    Window_IngredientList.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.refresh();
    };

    Window_IngredientList.prototype.refresh = function() {
        this.contents.clear();
        this.drawText("📜 Lista de Coleta", 0, 0, this.contents.width, "center");

        // --- EDITAR AQUI: IDs e quantidades necessárias ---
        const ingredients = [
            { id: 2, needed: 3 }, // ID 1 = Erva Verde, precisa de 3
            { id: 3, needed: 5 }, // ID 2 = Cogumelo Vermelho, precisa de 5
            { id: 4, needed: 2 }, // ID 3 = Peixe Azul, precisa de 2
            { id: 5, needed: 4 }  // ID 4 = Pena de Corvo, precisa de 4
        ];

        let y = 48;
        for (const ing of ingredients) {
            const item = $dataItems[ing.id];
            if (!item) continue;
            const have = $gameParty.numItems(item);
            const needed = ing.needed;
            const enough = have >= needed;

            // muda a cor do texto conforme o progresso
            if (enough) {
                this.changeTextColor(this.textColor(24)); // verde (cor do sistema)
            } else {
                this.changeTextColor(this.textColor(2)); // vermelho
            }

            const text = `${item.name}: ${have} / ${needed}`;
            this.drawText(text, 20, y, this.contents.width - 40, "left");
            y += this.lineHeight() + 6;
        }

        this.resetTextColor();
        this.drawText("Pressione ESC para voltar", 0, this.contents.height - 36, this.contents.width, "center");
    };

})();
