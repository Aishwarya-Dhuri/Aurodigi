export const TINYMCE_DEFAULT_TEXT_CONFIG: any = {
  base_url: '/tinymce',
  suffix: '.min',
  height: 400,
  plugins: '',
  menubar: false,
  toolbar: 'tagList',
  toolbar_mode: 'sliding',
  toolbar_sticky: true,
  quickbars_selection_toolbar: false,
  image_caption: false,
  image_advtab: false,
  autosave_ask_before_unload: false,
};

export const TINYMCE_DEFAULT_CONFIG: any = {
  base_url: '/tinymce',
  suffix: '.min',
  height: 450,
  plugins:
    'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
  menubar: 'file edit view insert format tools table help custom',
  menu: {
    custom: { title: 'Custom menu', items: 'basicitem nesteditem toggleitem' },
  },
  toolbar:
    'tagList | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
  toolbar_mode: 'sliding',
  toolbar_sticky: true,
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  image_caption: true,
  image_advtab: true,
  autosave_ask_before_unload: false,
  /* autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m', */
  /* link_list: [
      { title: 'My page 1', value: 'https://www.tiny.cloud' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' },
    ], */
  /* image_list: [
      { title: 'My page 1', value: 'https://www.tiny.cloud' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' },
    ],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Some class', value: 'class-name' },
    ], */
  /* importcss_append: true, */
  /* file_picker_callback: function (callback, value, meta) {
      // Provide file and text for the link dialog
      if (meta.filetype === 'file') {
        callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
      }

      // Provide image and alt text for the image dialog
      if (meta.filetype === 'image') {
        callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
      }

      // Provide alternative source and posted for the media dialog
      if (meta.filetype === 'media') {
        callback('movie.mp4', {
          source2: 'alt.ogg',
          poster: 'https://www.google.com/logos/google.jpg',
        });
      }
    }, */
  /* Used to Provide Custom template to insert 
    templates: [
      {
        title: 'New Table',
        description: 'creates a new table',
        content:
          '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
      },
      {
        title: 'Starting my story',
        description: 'A cure for writers block',
        content: 'Once upon a time...',
      },
      {
        title: 'New list with dates',
        description: 'New List with dates',
        content:
          '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
      },
    ], 
    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]', */
  /* noneditable_noneditable_class: 'mceNonEditable', */
  /* contextmenu: 'link image imagetools table', */
  /* content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }', */

  /* setup: function (editor) {
    // Menu items are recreated when the menu is closed and opened, so we need a variable to store the toggle menu item state.
    var toggleState = false;

    // example, adding a toolbar menu button
    editor.ui.registry.addMenuButton('tagList', {
      text: 'My button',
      fetch: function (callback) {
        var items = [
          {
            type: 'menuitem',
            text: 'Menu item 1',
            onAction: function () {
              editor.insertContent('&nbsp;<em>You clicked menu item 1!</em>');
            },
          },
          {
            type: 'nestedmenuitem',
            text: 'Menu item 2',
            icon: 'user',
            getSubmenuItems: function () {
              return [
                {
                  type: 'menuitem',
                  text: 'Sub menu item 1',
                  icon: 'unlock',
                  onAction: function () {
                    editor.insertContent('&nbsp;<em>You clicked Sub menu item 1!</em>');
                  },
                },
                {
                  type: 'menuitem',
                  text: 'Sub menu item 2',
                  icon: 'lock',
                  onAction: function () {
                    editor.insertContent('&nbsp;<em>You clicked Sub menu item 2!</em>');
                  },
                },
              ];
            },
          },
          {
            type: 'togglemenuitem',
            text: 'Toggle menu item',
            onAction: function () {
              toggleState = !toggleState;
              editor.insertContent(
                '&nbsp;<em>You toggled a menuitem ' + (toggleState ? 'on' : 'off') + '</em>',
              );
            },
            onSetup: function (api) {
              api.setActive(toggleState);
              return function () {};
            },
          },
        ];
        callback(items);
      },
    });

    editor.ui.registry.addMenuItem('basicitem', {
      text: 'My basic menu item',
      onAction: function () {
        editor.insertContent("<p>Here's some content inserted from a basic menu!</p>");
      },
    });

    editor.ui.registry.addNestedMenuItem('nesteditem', {
      text: 'My nested menu item',
      getSubmenuItems: function () {
        return [
          {
            type: 'menuitem',
            text: 'My submenu item',
            onAction: function () {
              editor.insertContent("<p>Here's some content inserted from a submenu item!</p>");
            },
          },
          {
            type: 'menuitem',
            text: 'My submenu item2',
            onAction: function () {
              editor.insertContent("<p>Here's some content inserted from a submenu item2!</p>");
            },
          },
        ];
      },
    });

    editor.ui.registry.addToggleMenuItem('toggleitem', {
      text: 'My toggle menu item',
      onAction: function () {
        toggleState = !toggleState;
        if (toggleState)
          editor.insertContent(
            '<p class="toggle-item">Here\'s some content inserted from a toggle menu!</p>',
          );
      },
      onSetup: function (api) {
        api.setActive(toggleState);
        return function () {};
      },
    });
  }, */
};
