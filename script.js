// Core Application Structure
class MarkdownEditor {
  constructor() {
    this.editor = document.getElementById('editor');
    this.preview = document.getElementById('preview');
    this.lastSaved = '';
    this.autoSaveInterval = null;
    this.isUnsaved = false;
    this.init();
  }

  init() {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      langPrefix: 'language-',
      sanitize: false
    });

    // Initialize components
    this.bindEvents();
    this.loadFromStorage();
    this.startAutoSave();
    this.updatePreview();
    this.updateStats();
    
    // Set initial content if empty
    if (!this.editor.value) {
      this.editor.value = `# Welcome to Markdown Editor

This is a **live preview** markdown editor with multiple features:

## Features
- Real-time preview
- Export to multiple formats
- Auto-save functionality
- Theme support (light/dark)
- Keyboard shortcuts

### Markdown Examples

You can write **bold** or *italic* text.

Create lists:
- Item 1
- Item 2
  - Nested item

Or numbered lists:
1. First item
2. Second item

Add \`inline code\` or code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> Blockquotes are also supported

[Links](https://github.com) and images work too!

---

Happy writing! 📝`;
      this.updatePreview();
    }
  }

  bindEvents() {
    // Editor input
    this.editor.addEventListener('input', this.debounce(() => {
      this.updatePreview();
      this.updateStats();
      this.markUnsaved();
    }, 300));

    // Track cursor position
    this.editor.addEventListener('click', () => this.updateCursorPosition());
    this.editor.addEventListener('keyup', () => this.updateCursorPosition());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 's': 
            e.preventDefault(); 
            this.save(); 
            break;
          case 'b': 
            e.preventDefault(); 
            this.insertFormatting('bold'); 
            break;
          case 'i': 
            e.preventDefault(); 
            this.insertFormatting('italic'); 
            break;
          case 'n':
            e.preventDefault();
            this.newDocument();
            break;
          case 'o':
            e.preventDefault();
            document.getElementById('fileInput').click();
            break;
        }
      }
    });

    // Toolbar buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.insertFormatting(btn.dataset.action);
      });
    });

    // Header buttons
    document.getElementById('newDoc').addEventListener('click', () => this.newDocument());
    document.getElementById('openDoc').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
    document.getElementById('saveDoc').addEventListener('click', () => this.save());
    document.getElementById('exportDoc').addEventListener('click', () => this.showExportModal());
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // File input
    document.getElementById('fileInput').addEventListener('change', (e) => this.openFile(e));

    // Export modal
    document.getElementById('cancelExport').addEventListener('click', () => this.hideExportModal());
    document.querySelectorAll('[data-export]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.export(btn.dataset.export);
        this.hideExportModal();
      });
    });

    // Mobile preview toggle
    document.getElementById('togglePreview').addEventListener('click', () => {
      document.querySelector('.preview-pane').classList.toggle('active');
    });

    // Synchronized scrolling
    let isScrolling = false;
    this.editor.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        this.syncScroll('editor');
        setTimeout(() => isScrolling = false, 100);
      }
    });

    this.preview.parentElement.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        this.syncScroll('preview');
        setTimeout(() => isScrolling = false, 100);
      }
    });
  }

  updatePreview() {
    const markdown = this.editor.value;
    const html = marked.parse(markdown);
    this.preview.innerHTML = html;
    
    // Open links in new tab
    this.preview.querySelectorAll('a').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  insertFormatting(action) {
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const text = this.editor.value;
    const selected = text.substring(start, end);
    
    const formats = {
      bold: { before: '**', after: '**' },
      italic: { before: '_', after: '_' },
      code: selected.includes('\n') ? { before: '```\n', after: '\n```' } : { before: '`', after: '`' },
      link: { before: '[', after: '](url)' },
      image: { before: '![', after: '](url)' },
      heading: { before: '## ', after: '' },
      quote: { before: '> ', after: '' },
      ul: { before: '- ', after: '' },
      ol: { before: '1. ', after: '' },
      table: { before: '| Header 1 | Header 2 |\n|----------|----------|\n| ', after: ' | Cell 2 |' }
    };
    
    const format = formats[action];
    if (format) {
      const newText = text.substring(0, start) + 
                     format.before + selected + format.after + 
                     text.substring(end);
      this.editor.value = newText;
      this.editor.focus();
      this.editor.setSelectionRange(
        start + format.before.length,
        start + format.before.length + selected.length
      );
      this.updatePreview();
      this.markUnsaved();
    }
  }

  updateStats() {
    const text = this.editor.value;
    const words = text.match(/\b\w+\b/g) || [];
    const chars = text.length;
    
    document.getElementById('wordCount').textContent = `Words: ${words.length}`;
    document.getElementById('charCount').textContent = `Characters: ${chars}`;
  }

  updateCursorPosition() {
    const text = this.editor.value.substring(0, this.editor.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    document.getElementById('lineInfo').textContent = `Line: ${line}, Column: ${column}`;
  }

  markUnsaved() {
    this.isUnsaved = true;
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = 'Unsaved';
    saveStatus.classList.add('unsaved');
  }

  markSaved() {
    this.isUnsaved = false;
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = 'Saved';
    saveStatus.classList.remove('unsaved');
  }

  save() {
    localStorage.setItem('markdown-content', this.editor.value);
    this.lastSaved = this.editor.value;
    this.markSaved();
  }

  loadFromStorage() {
    const saved = localStorage.getItem('markdown-content');
    if (saved) {
      this.editor.value = saved;
      this.lastSaved = saved;
      this.updatePreview();
      this.updateStats();
    }
  }

  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (this.isUnsaved) {
        this.save();
      }
    }, 30000); // Auto-save every 30 seconds
  }

  newDocument() {
    if (this.isUnsaved && !confirm('You have unsaved changes. Create a new document?')) {
      return;
    }
    this.editor.value = '';
    this.updatePreview();
    this.updateStats();
    this.save();
  }

  openFile(event) {
    const file = event.target.files[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editor.value = e.target.result;
        this.updatePreview();
        this.updateStats();
        this.markUnsaved();
      };
      reader.readAsText(file);
    }
  }

  export(format) {
    const filename = document.getElementById('filename').value || 'document';
    let content, mimeType, extension;
    
    switch(format) {
      case 'markdown':
        content = this.editor.value;
        mimeType = 'text/markdown';
        extension = '.md';
        break;
      case 'html':
        content = this.getHTMLExport();
        mimeType = 'text/html';
        extension = '.html';
        break;
      case 'text':
        content = this.preview.innerText;
        mimeType = 'text/plain';
        extension = '.txt';
        break;
      case 'pdf':
        window.print();
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + extension;
    a.click();
    URL.revokeObjectURL(url);
  }

  getHTMLExport() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: ${isDark ? '#ffffff' : '#333333'};
            background-color: ${isDark ? '#1e1e1e' : '#ffffff'};
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 2em; border-bottom: 1px solid ${isDark ? '#404040' : '#e0e0e0'}; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid ${isDark ? '#404040' : '#e0e0e0'}; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        code {
            background-color: ${isDark ? '#2d2d2d' : '#f5f5f5'};
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 85%;
        }
        pre {
            background-color: ${isDark ? '#2d2d2d' : '#f5f5f5'};
            padding: 16px;
            overflow: auto;
            border-radius: 6px;
        }
        blockquote {
            padding: 0 1em;
            color: ${isDark ? '#cccccc' : '#666666'};
            border-left: 0.25em solid ${isDark ? '#404040' : '#e0e0e0'};
        }
        a { color: ${isDark ? '#4dabf7' : '#007bff'}; text-decoration: none; }
        a:hover { text-decoration: underline; }
        table { border-collapse: collapse; width: 100%; }
        table th, table td { padding: 6px 13px; border: 1px solid ${isDark ? '#404040' : '#e0e0e0'}; }
        table th { background-color: ${isDark ? '#2d2d2d' : '#f5f5f5'}; font-weight: 600; }
    </style>
</head>
<body>
    ${this.preview.innerHTML}
</body>
</html>`;
  }

  showExportModal() {
    document.getElementById('exportModal').hidden = false;
    document.getElementById('filename').focus();
  }

  hideExportModal() {
    document.getElementById('exportModal').hidden = true;
  }

  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  syncScroll(source) {
    if (source === 'editor') {
      const editorScrollPercentage = this.editor.scrollTop / (this.editor.scrollHeight - this.editor.clientHeight);
      const previewContainer = this.preview.parentElement;
      previewContainer.scrollTop = editorScrollPercentage * (previewContainer.scrollHeight - previewContainer.clientHeight);
    } else {
      const previewContainer = this.preview.parentElement;
      const previewScrollPercentage = previewContainer.scrollTop / (previewContainer.scrollHeight - previewContainer.clientHeight);
      this.editor.scrollTop = previewScrollPercentage * (this.editor.scrollHeight - this.editor.clientHeight);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  // Initialize editor
  window.mdEditor = new MarkdownEditor();
});