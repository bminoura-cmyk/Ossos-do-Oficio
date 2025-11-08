/*:
 * @plugindesc Cria um menu personalizado simples. Você pode editar o conteúdo depois. 
 * @author ChatGPT
 *
 * @help
 * Este plugin adiciona um novo comando no menu principal chamado "Menu Custom".
 * Quando selecionado, abre uma tela personalizada.
 */

(function() {

    // 1️⃣ Adiciona o comando "Menu Custom" no menu principal
    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand('Lista de Itens', 'customMenu', true);
    };

    // 2️⃣ Cria a cena personalizada
    function Scene_CustomMenu() {
        this.initialize.apply(this, arguments);
    }

    Scene_CustomMenu.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CustomMenu.prototype.constructor = Scene_CustomMenu;

    Scene_CustomMenu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);

        // Fundo opcional
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);

        // Exemplo de texto central
        const text = new Window_Base(new Rectangle(0, 0, Graphics.width, 100));
        text.drawText("Itens que você precisa coletar:", 0, 0, Graphics.width, 100, 'center');
        this.addChild(text);

        // Botão para voltar ao menu principal
        const backButton = new Window_Command(new Rectangle(Graphics.width / 2 - 100, 150, 200, 60));
        backButton.makeCommandList = function() {
            this.addCommand('Voltar', 'cancel');
            this.addCommand('Ver Ingredientes', 'ingredientes');
            this.addCommand('Progresso da Coleta', 'progresso');
        };
        backButton.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(backButton);

        backButton.setHandler('ingredientes', () => {
        SoundManager.playOk();
        alert('Aqui você pode abrir a lista de ingredientes!');
    });

    backButton.setHandler('progresso', () => {
        SoundManager.playOk();
        alert('Aqui pode mostrar o progresso do jogador.');
    });

    };

    // 3️⃣ Quando o comando for selecionado no menu principal, abre a cena customizada
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('customMenu', this.commandCustomMenu.bind(this));
    };

    Scene_Menu.prototype.commandCustomMenu = function() {
        SceneManager.push(Scene_CustomMenu);
    };

})();
