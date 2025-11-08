/*:
 * @plugindesc Menu personalizado de coleta de itens. 
 * @author Be Mi
 *
 * @help
 * Adiciona um menu chamado "Lista de Coleta" no menu principal.
 */

(function() {

    // 1️⃣ Adiciona o comando no menu principal
    const _addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _addOriginalCommands.call(this);
        this.addCommand('📜 Lista de Coleta', 'customMenu', true);
    };

    // 2️⃣ Liga o comando a uma função
    const _createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _createCommandWindow.call(this);
        this._commandWindow.setHandler('customMenu', this.commandCustomMenu.bind(this));
    };

    Scene_Menu.prototype.commandCustomMenu = function() {
        SceneManager.push(Scene_CustomMenu);
    };

    // 3️⃣ Cria a cena personalizada
    function Scene_CustomMenu() {
        this.initialize.apply(this, arguments);
    }

    Scene_CustomMenu.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CustomMenu.prototype.constructor = Scene_CustomMenu;

    Scene_CustomMenu.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_CustomMenu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);

        // Fundo (opcional, mantém efeito de borrão do mapa)
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);

        // Janela principal para mostrar o texto
        const rect = new Rectangle(100, 100, Graphics.width - 200, Graphics.height - 200);
        this._mainWindow = new Window_Base(rect);
        this.addChild(this._mainWindow);

        // Texto de exemplo
        this._mainWindow.drawText("📜 Lista de Coleta", 0, 0, this._mainWindow.contents.width, 'center');
        this._mainWindow.drawText("🌿 Erva Verde: " + $gameParty.numItems($dataItems[1]) + " / 3", 0, 40, this._mainWindow.contents.width, 'left');
        this._mainWindow.drawText("🍄 Cogumelo Vermelho: " + $gameParty.numItems($dataItems[2]) + " / 5", 0, 70, this._mainWindow.contents.width, 'left');

        // Botão Voltar
        const commandRect = new Rectangle(Graphics.width/2 - 100, Graphics.height - 150, 200, 60);
        this._backButton = new Window_Command(commandRect);
        this._backButton.makeCommandList = function() {
            this.addCommand("Voltar", "cancel");
        };
        this._backButton.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._backButton);

        // Ativa o botão para receber input
        this._backButton.activate();
    };

})();
