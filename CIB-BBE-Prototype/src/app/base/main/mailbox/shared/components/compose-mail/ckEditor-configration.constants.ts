export const CKEDITOR_CONFIGRATION = {
  extraPlugins: 'colorbutton,font,justify',
  toolbar: [
    { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
    {
      name: 'basicstyles',
      items: ['Bold', 'Italic', 'Underline', '-', 'TextColor', 'BGColor'],
    },
    {
      name: 'paragraph',
      items: [
        'NumberedList',
        'BulletedList',
        '-',
        'Outdent',
        'Indent',
        '-',
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock',
        '-',
      ],
    },
    { name: 'insert', items: ['Table'] },
  ],
  removePlugins: 'elementspath,resize',
};
