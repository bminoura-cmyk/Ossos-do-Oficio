/*:
 * @plugindesc Exibe uma lista estática de ingredientes no menu.
 * @author SeuNome
 *
 * @param IngredientText
 * @type note
 * @default Você precisa coletar:
 * \n[1] Maçã Gigante: 0/3
 * \n[1] Minério Raro: 1/5
 * \n[1] Essência Mística: 0/1
 * @text Conteúdo da Lista
 * @desc O texto formatado que será exibido. Use códigos de texto do RMV.
 */

(function() {
    var parameters = PluginManager.parameters('IngredientsDisplay');
    var ingredientText = String(parameters['IngredientText'] || '');

    // 1. Definindo a Nova Cena (Scene_IngredientList)
    var Scene_IngredientList_alias_createAllWindows = Scene_MenuBase.prototype.createAllWindows;
    Scene_MenuBase.prototype.createAllWindows = function() {
        Scene_IngredientList_alias_createAllWindows.call(this);
        if (this._scene.name === 'IngredientList') { // Verifica se estamos na nossa cena
            this.createIngredientWindow();
        }
    };

    function Scene_IngredientList() {
        this.initialize.apply(this, arguments);
    }

    Scene_IngredientList.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_IngredientList.prototype.constructor = Scene_IngredientList;

    Scene_IngredientList.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_MenuBase.prototype.createIngredientWindow = function() {
        this._ingredientWindow = new Window_IngredientList(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.addWindow(this._ingredientWindow);
    };

    Scene_IngredientList.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createIngredientWindow(); // Chamada corrigida para a janela
    };

    Scene_IngredientList.prototype.createIngredientWindow = function() {
        this._ingredientWindow = new Window_IngredientList(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.addWindow(this._ingredientWindow);
        this._ingredientWindow.setText(ingredientText); // Define o texto
        this.createCancelButton(); // Adiciona o botão de Cancelar/Voltar
    };

    Scene_IngredientList.prototype.createCancelButton = function() {
        this._cancelButton = new Sprite_Button();
        this._cancelButton.setClickHandler(this.popScene.bind(this));
        this.addChild(this._cancelButton);
    };

    Scene_IngredientList.prototype.isCancelEnabled = function() {
        return true;
    };

    Scene_IngredientList.prototype.needsCancelButton = function() {
        return true;
    };


    // 2. Definindo a Janela que exibe o texto (Window_IngredientList)
    function Window_IngredientList() {
        this.initialize.apply(this, arguments);
    }

    Window_IngredientList.prototype = Object.create(Window_Base.prototype);
    Window_IngredientList.prototype.constructor = Window_IngredientList;

    Window_IngredientList.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = "";
    };

    Window_IngredientList.prototype.setText = function(text) {
        this._text = text;
        this.refresh();
    };

    Window_IngredientList.prototype.refresh = function() {
        this.contents.clear();
        var lines = this._text.split(/\\n/);
        var y = this.itemPadding();
        
        // Exibe cada linha do texto
        lines.forEach(function(line) {
            var fmtLine = this.convertEscapeCharacters(line);
            var textHeight = this.textHeight();
            this.drawText(fmtLine, 0, y, this.contentsWidth(), 'left');
            y += textHeight + 2; // Pula para a próxima linha
        }, this);
    };

    // 3. Mapeando a Cena
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        // Garante que Scene_Menu sabe sobre nossa nova cena (não estritamente necessário se usarmos SceneManager.push)
    };
    
    var _Scene_Menu_createHelpWindow = Scene_Menu.prototype.createHelpWindow;
    Scene_Menu.prototype.createHelpWindow = function() {
        // Previne a criação da janela de ajuda padrão se não for necessária
    };
    
    // Alias para garantir que a Scene_Menu chama a Scene_IngredientList corretamente
    var _Scene_Menu_commandCustom = Scene_Menu.prototype.commandCustom;
    Scene_Menu.prototype.commandCustom = function() {
        // Se você usar um Symbol customizado que aponta para esta função
        SceneManager.push(Scene_IngredientList);
    };

    // *************************************************************************
    // Correção: Substituindo o método de push para ser mais limpo
    // Vamos redefinir a forma como o Menu chama a cena.
    // *************************************************************************
    
    Scene_Menu.prototype.commandIngredientList = function() {
        SceneManager.push(Scene_IngredientList);
    };

})();