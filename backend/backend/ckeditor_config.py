CKEDITOR_5_CONFIGS = {
    'default': {
        'toolbar': [
            'heading', 'style',
            '|',
            'bold', 'italic', 'underline', 'strikethrough', 'link',
            '|',
            'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
            '|',
            'bulletedList', 'numberedList', 'outdent', 'indent',
            '|',
            'alignment', 'blockQuote', 'code', 'codeBlock', 'horizontalLine', 'removeFormat',
            '|',
            'imageUpload', 'insertTable', 'mediaEmbed'
        ],
        'fontFamily': {
            'options': [
                'default',
                'Montserrat, Arial, sans-serif',
                'Arial, Helvetica, sans-serif',
                'Times New Roman, Times, serif',
                'Georgia, serif',
                'Courier New, Courier, monospace',
            ],
            'supportAllValues': False,
        },
        'fontSize': {
            'options': [10, 12, 14, 16, 18, 20, 24, 30, 36],
            'supportAllValues': True,
        },
        'fontColor': {
            'columns': 6,
            'colors': [
                { 'color': '#111111', 'label': 'Black' },
                { 'color': '#ffffff', 'label': 'White' },
                { 'color': '#1E293B', 'label': 'Slate-900' },
                { 'color': '#0EA5E9', 'label': 'Sky' },
                { 'color': '#22C55E', 'label': 'Green' },
                { 'color': '#EF4444', 'label': 'Red' },
                { 'color': '#F59E0B', 'label': 'Amber' },
                { 'color': '#3B82F6', 'label': 'Blue' },
                { 'color': '#8B5CF6', 'label': 'Violet' },
                { 'color': '#F472B6', 'label': 'Pink' },
            ],
        },
        'fontBackgroundColor': {
            'columns': 6,
            'colors': [
                { 'color': '#000000', 'label': 'Black' },
                { 'color': '#ffffff', 'label': 'White' },
                { 'color': '#F1F5F9', 'label': 'Slate-50' },
                { 'color': '#E2E8F0', 'label': 'Slate-200' },
                { 'color': '#FEF9C3', 'label': 'Yellow-100' },
                { 'color': '#DCFCE7', 'label': 'Green-100' },
                { 'color': '#DBEAFE', 'label': 'Blue-100' },
                { 'color': '#FCE7F3', 'label': 'Pink-100' },
            ],
        },
        'heading': {
            'options': [
                {'model': 'paragraph', 'title': 'Paragraph', 'class': 'ck-heading_paragraph'},
                {'model': 'heading1', 'view': 'h1', 'title': 'Heading 1', 'class': 'ck-heading_heading1'},
                {'model': 'heading2', 'view': 'h2', 'title': 'Heading 2', 'class': 'ck-heading_heading2'},
                {'model': 'heading3', 'view': 'h3', 'title': 'Heading 3', 'class': 'ck-heading_heading3'},
                {'model': 'heading4', 'view': 'h4', 'title': 'Heading 4', 'class': 'ck-heading_heading4'},
                {'model': 'heading5', 'view': 'h5', 'title': 'Heading 5', 'class': 'ck-heading_heading5'},
                {'model': 'heading6', 'view': 'h6', 'title': 'Heading 6', 'class': 'ck-heading_heading6'},
            ]
        },
        'image': {
            'toolbar': [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                'linkImage'
            ],
        },
        'table': {
            'contentToolbar': [
                'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
            ]
        },
        'style': {
            'definitions': [
                {
                    'name': 'Quote author',
                    'element': 'paragraph',
                    'classes': [ 'quote-author' ]
                }
            ]
        },
        'htmlSupport': {
            'allow': [
                {
                    'name': 'p',
                    'classes': [ 'quote-author' ]
                }
            ]
        }
    },
}


