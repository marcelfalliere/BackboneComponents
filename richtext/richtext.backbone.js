"use strict"

var BBRichTextModel = Backbone.Model.extend({
	
})

var BBRichTextView = Backbone.View.extend({
	initialize:function(opts) {
		this.$toolbar;
		this.$editor; // this.$el, but overriden by this.$container
		this.$htmlEditor;

		this.$el.hide();
		this.$el.wrap('<section class="bb-rich-text-container"></section>');
		this.$el = this.$el.parent();
		this.$el.prepend('<div class="bb-rich-text-toolbar"></div><div class="bb-rich-text-editor"></div>');
		this.$editor = this.$el.find('.bb-rich-text-editor');
		this.$toolbar = this.$el.find('.bb-rich-text-toolbar');
		this.$htmlEditor = this.$el.find('textarea');

		// Buttons
		var buttons = opts.config.buttons.split(",");
		for (var i in buttons) {
			this.$toolbar.append("<div data-for-action='"+buttons[i]+"'><button class='bb-rich-text-toolbar-"+buttons[i]+"'>"+buttons[i]+"</button></div>")
		}
		for (var i in buttons) {
			switch(buttons[i]) {
				case "color": 
					this.$toolbar.append("<div class='bb-rich-text-toolbar-color-palette'></div>");
					this.colorPaletteView = new BBRichTextColorPaletteView({
						el: this.$toolbar.find('.bb-rich-text-toolbar-color-palette')[0],
						collection: new BBRichTextColorPaletteCollection(),
						bbRichText:this
					});
			}
		}
		
		// Editor
		this.$editor.attr('contenteditable', "");
		this.$editor.html(this.$htmlEditor.val());

		// Model
		this.model.set('htmlValue', this.$htmlEditor.val())
	},

	events: {
		"click .bb-rich-text-toolbar-bold" : "bold",
		"click .bb-rich-text-toolbar-italic" : "italic",
		"click .bb-rich-text-toolbar-ol" : "ol",
		"click .bb-rich-text-toolbar-ul" : "ul",
		"click .bb-rich-text-toolbar-color" : "color"
	},

	bold:function() {
		document.execCommand("bold", false, undefined);
		this.updateHtmlEditor();
	},

	italic:function() {
		document.execCommand("italic", false, undefined);
		this.updateHtmlEditor();
	},

	ul:function() {
		document.execCommand("insertunorderedlist", false, undefined);
		this.updateHtmlEditor();
	},

	ol:function() {
		document.execCommand("insertorderedlist", false, undefined);
		this.updateHtmlEditor();
	},

	updateHtmlEditor:function() {
		this.$htmlEditor.val(this.$editor.html());
	},

	color:function() {
		this.colorPaletteView.toggleDisplay();
	},

	colorHasBeenPicked:function(hexColor) {
		document.execCommand("foreColor", false, hexColor);
		this.updateHtmlEditor();
	}

});


var BBRichTextColorPaletteModel = Backbone.Model.extend({

});


var BBRichTextColorPaletteCollection = Backbone.Collection.extend({
	model: new BBRichTextColorPaletteModel()
});

var BBRichTextColorPaletteView = Backbone.View.extend({
	initialize:function(opts) {
		this.bbRichText=opts.bbRichText;
		this.template = _.template($('#bb-rich-text-toolbar-color-palette').html());
		this.collection.on("all", _.bind(this.render, this));
		this.$el.hide();
		this.collection.add([
			new BBRichTextColorPaletteModel({hex:'#000'}), 
			new BBRichTextColorPaletteModel({hex:'#ff0000'}), 
			new BBRichTextColorPaletteModel({hex:'#848484'})
		]);

		this.$input = this.$el.find('.bb-rich-text-toolbar-color-palette-add-input');
		this.$button = this.$el.find('.bb-rich-text-toolbar-color-palette-add-button');
		this.$preview = this.$el.find('.bb-rich-text-toolbar-color-palette-add-preview');
	},

	events:{
		"keyup .bb-rich-text-toolbar-color-palette-add-input":"updatePreview",
		"click .bb-rich-text-toolbar-color-palette-add-button":"addColor",
		"click .bb-rich-text-toolbar-color-palette-list button":"selectColor"
	},

	render: function() {
		this.$el.html(this.template({colors:this.collection.toJSON()}));
	},

	toggleDisplay:function() {
		this.$el.toggle();
	},

	updatePreview:function() {
		this.$preview.css("background-color", "#"+this.$input.val());
	},

	addColor:function() {
		this.collection.add(new BBRichTextColorPaletteModel({hex:'#'+this.$input.val()}));
		this.$input.val("");
		this.$preview.css("background-color", "transparent");
	},

	selectColor:function(event) {
		this.bbRichText.colorHasBeenPicked($(event.target).attr('data-color'));
	}

});







