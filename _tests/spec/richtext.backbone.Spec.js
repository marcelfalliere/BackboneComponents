function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

describe("Richtext", function() {

  beforeEach(function() {
  	$("#test").remove();
    $("body").append('<div id="test"></div>');
    $("#test").append("<textarea>intial <b>fucking bolded</b> value</textarea> ")
  });

  it("should initialize dom correctly", function() {
    // Given
    new BBRichTextView({
    	el:'textarea',
    	model:new BBRichTextModel(),
    	config: {
    		buttons: "bold,italic,hyperlink,ul,ol"
    	}
    });

    // Then
    var $parent = $('textarea').parent();
    expect($parent.is('section')).toBe(true);
    expect($parent.hasClass('bb-rich-text-container')).toBe(true);
    expect($($parent.children()[0]).hasClass('bb-rich-text-toolbar')).toBe(true);
    expect($($parent.children()[1]).hasClass('bb-rich-text-editor')).toBe(true);

    var $editor = $parent.find('.bb-rich-text-editor');
    expect($editor.attr('contenteditable')).toBeDefined();
    expect($editor.html()).toEqual("intial <b>fucking bolded</b> value");

    var $toolbar = $parent.find('.bb-rich-text-toolbar');
    expect($toolbar.is('div')).toBe(true);
    expect($toolbar.length).toBe(1);
    expect($toolbar.children().length).toBe(5);
    expect($($toolbar.children()[0]).children('button').hasClass('bb-rich-text-toolbar-bold')).toBe(true);
    expect($($toolbar.children()[1]).children('button').hasClass('bb-rich-text-toolbar-italic')).toBe(true);
    expect($($toolbar.children()[2]).children('button').hasClass('bb-rich-text-toolbar-hyperlink')).toBe(true);
    expect($($toolbar.children()[3]).children('button').hasClass('bb-rich-text-toolbar-ul')).toBe(true);
    expect($($toolbar.children()[4]).children('button').hasClass('bb-rich-text-toolbar-ol')).toBe(true);

  });

 it("should initialize model correctly", function() {
    // Given
    var view = new BBRichTextView({
    	el:'textarea',
    	model:new BBRichTextModel(),
    	config: {
    		buttons: "bold,italic,hyperlink,ul,ol"
    	}
    });

    // Then
    expect(view.model.get('htmlValue')).toEqual("intial <b>fucking bolded</b> value");

  });

  it("should make some text bold", function() {
    // Given
    var view = new BBRichTextView({
    	el:'textarea',
    	model:new BBRichTextModel(),
    	config: {
    		buttons: "bold,italic,hyperlink,ul,ol"
    	}
    });

    // When
    selectElementContents($('.bb-rich-text-editor')[0]);
    $('.bb-rich-text-toolbar-bold').trigger('click');

    // Then
    expect($('.bb-rich-text-editor').html()).toBe("<b>intial fucking bolded value</b>");
    expect($('textarea').val()).toBe("<b>intial fucking bolded value</b>");

  });

});


describe("Richtext color palette", function() {

  beforeEach(function() {
  	$("#test").remove();
    $("body").append('<div id="test"></div>');
    $("#test").append("<textarea>intial <b>fucking bolded</b> value</textarea> ")
    $("body").append('<script type="html/template" id="bb-rich-text-toolbar-color-palette"><ul class="bb-rich-text-toolbar-color-palette-list"><% _.each(colors, function(color){ %><li style="background-color:<%= color.hex %>"></li><% }) %></ul><div class="bb-rich-text-toolbar-color-palette-add">'
    	+ '#<input type="text" maxlength="6" class="bb-rich-text-toolbar-color-palette-add-input"/><div class="bb-rich-text-toolbar-color-palette-add-preview"></div><button class="bb-rich-text-toolbar-color-palette-add-button">Ajouter</button>'
    	+ '</div></script>');
  });

  it("should initialize dom correctly for the color specific element", function() {
    // Given
    new BBRichTextView({
    	el:'textarea',
    	model:new BBRichTextModel(),
    	config: {
    		buttons: "bold,italic,color,hyperlink,ul,ol"
    	}
    });

    // Then
	var $toolbar = $('.bb-rich-text-toolbar');
    expect($toolbar.find('[data-for-action=color]').children('button').length).toEqual(1);
    var $colorPalette = $toolbar.find('[data-for-action=color]').children('.bb-rich-text-toolbar-color-palette');
    expect($colorPalette.length).toEqual(1);
    expect($colorPalette.children().length).toEqual(2); // colors and add color with hex
    
    var $colorLists = $colorPalette.children('.bb-rich-text-toolbar-color-palette-list');
    expect($colorLists.length).toEqual(1);
    expect($colorLists.children().length).toEqual(3); // 3 colors
    var $colorAdd = $colorPalette.children('.bb-rich-text-toolbar-color-palette-add');
    expect($colorAdd.length).toEqual(1);
    expect($colorAdd.children().length).toEqual(3); // input, preview and button
    
    
    var $colorAddInput = $colorAdd.find('.bb-rich-text-toolbar-color-palette-add-input');
    var $colorAddPreview = $colorAdd.find('.bb-rich-text-toolbar-color-palette-add-preview');
    var $colorAddButton = $colorAdd.find('.bb-rich-text-toolbar-color-palette-add-button');
    expect($colorAddInput.length).toBe(1);
    expect($colorAddPreview.length).toBe(1);
    expect($colorAddButton.length).toBe(1);
    expect($colorAddInput.is('input')).toBe(true);
    expect($colorAddButton.is('button')).toBe(true);
    expect($colorAddPreview.is('div')).toBe(true);



  });



});