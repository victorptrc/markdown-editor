# Markdown Editor - Full Project Specification

## 1. Project Overview

### 1.1 Purpose
Create a web-based Markdown editor with real-time preview and export capabilities, providing users with a powerful yet simple tool for writing and formatting documents using Markdown syntax.

### 1.2 Target Users
- Content writers and bloggers
- Technical documentation writers
- Students and educators
- Developers writing README files
- Anyone needing quick markdown-to-HTML conversion

### 1.3 Core Value Proposition
- Zero setup required - works in any modern browser
- Real-time preview as you type
- Multiple export formats
- Clean, distraction-free interface
- Works offline after initial load

## 2. Functional Requirements

### 2.1 Editor Features
- **Text Editing**
  - Multi-line text input with syntax highlighting
  - Line numbers (optional toggle)
  - Auto-indent support
  - Tab key support for indentation
  - Find/Replace functionality (Ctrl+F)
  
- **Markdown Support**
  - Full CommonMark specification
  - GitHub Flavored Markdown (GFM) extensions
  - Tables, task lists, strikethrough
  - Code syntax highlighting in preview
  - Math expressions (optional - KaTeX/MathJax)

### 2.2 Preview Features
- **Live Preview**
  - Real-time rendering (debounced at 300ms)
  - Synchronized scrolling (editor ↔ preview)
  - Accurate CSS styling matching GitHub/popular platforms
  - Image rendering with error handling
  - Link handling (open in new tab)

### 2.3 Export Options
- **Export Formats**
  - Markdown (.md) - raw text
  - HTML (.html) - standalone with embedded styles
  - PDF - via browser print dialog
  - Plain text (.txt) - stripped formatting
  
- **Export Features**
  - Custom filename input
  - Include metadata (title, date, author)
  - Styling options for HTML export
  - Page setup for PDF (margins, orientation)

### 2.4 Toolbar Functions
- **Formatting Shortcuts**
  - Bold (Ctrl+B) 
  - Italic (Ctrl+I)
  - Heading levels (Ctrl+1-6)
  - Lists (ordered/unordered)
  - Code blocks/inline code
  - Links and images
  - Blockquotes
  - Horizontal rules

### 2.5 Additional Features
- **Auto-save**
  - Save to localStorage every 30 seconds
  - Restore on page reload
  - Multiple document support
  
- **Document Management**
  - New document
  - Open from file (.md, .txt)
  - Recent documents list
  - Clear current document

## 3. Non-Functional Requirements

### 3.1 Performance
- Initial load time < 2 seconds
- Preview update latency < 100ms
- Smooth scrolling at 60 FPS
- Handle documents up to 1MB efficiently
- Memory usage < 50MB for typical documents

### 3.2 Compatibility
- **Browsers**
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+
  - Mobile browsers (responsive design)
  
- **Screen Sizes**
  - Desktop: 1024px - 4K
  - Tablet: 768px - 1024px
  - Mobile: 320px - 768px

### 3.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Adjustable font sizes

### 3.4 Security
- No server-side processing (client-side only)
- XSS prevention in preview rendering
- Safe link handling
- No external dependencies for core features

## 4. UI/UX Specifications

### 4.1 Layout Structure
```
+------------------------------------------+
|  Header (56px)                           |
|  [Logo] [New] [Open] [Save] [Export]     |
+------------------------------------------+
|  Toolbar (40px)                          |
|  [B] [I] [H] [Link] [...] | [Settings]   |
+------------------------------------------+
|  Editor (50%)    |    Preview (50%)      |
|                  |                       |
|  Monospace font  |    Rendered MD        |
|  Line numbers    |    Styled output      |
|                  |                       |
+------------------------------------------+
|  Status Bar (32px)                       |
|  Words: 150 | Chars: 1,024 | Ln 45      |
+------------------------------------------+
```

### 4.2 Visual Design
- **Color Scheme**
  - Light theme: White background, dark text
  - Dark theme: Dark gray background, light text
  - Accent color: Blue (#007bff) for actions
  - Success: Green for saved status
  - Warning: Yellow for unsaved changes

- **Typography**
  - Editor: 'Consolas', 'Monaco', monospace, 14px
  - Preview: System font stack, 16px base
  - UI: -apple-system, BlinkMacSystemFont, 'Segoe UI'

### 4.3 Responsive Behavior
- **Desktop**: Split view (adjustable divider)
- **Tablet**: Tabbed view (Editor | Preview)
- **Mobile**: Stacked view with toggle button

## 5. Technical Architecture

### 5.1 Frontend Stack
- **Core**: Vanilla JavaScript (ES6+)
- **Markdown Parser**: marked.js (v4.0+)
- **Syntax Highlighting**: Prism.js or highlight.js
- **Icons**: SVG inline or icon font
- **Build**: No build process (pure static files)

### 5.2 File Structure
```
/
├── index.html          # Main HTML structure
├── styles.css          # All styles
├── script.js           # Core application logic
├── lib/               # Third-party libraries
│   ├── marked.min.js
│   └── prism.min.js
└── assets/            # Icons, fonts
```

### 5.3 JavaScript Modules
```javascript
// Core modules structure
const MarkdownEditor = {
  editor: {
    init(), 
    getValue(), 
    setValue(), 
    insertText()
  },
  preview: {
    init(), 
    update(), 
    syncScroll()
  },
  toolbar: {
    init(), 
    bindShortcuts(), 
    executeCommand()
  },
  storage: {
    save(), 
    load(), 
    clear()
  },
  export: {
    toMarkdown(), 
    toHTML(), 
    toPDF()
  }
};
```

### 5.4 Data Flow
1. User types in editor → 
2. Debounced update triggered →
3. Markdown parsed to HTML →
4. Preview pane updated →
5. Auto-save to localStorage →
6. Status bar updated

## 6. Implementation Details

### 6.1 HTML Structure
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Editor</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
    <!-- Header -->
    <header class="app-header">
        <div class="header-left">
            <h1 class="app-title">MD Editor</h1>
        </div>
        <div class="header-center">
            <button id="newDoc" title="New Document (Ctrl+N)">New</button>
            <button id="openDoc" title="Open Document (Ctrl+O)">Open</button>
            <input type="file" id="fileInput" accept=".md,.txt" hidden>
            <button id="saveDoc" title="Save Document (Ctrl+S)">Save</button>
            <button id="exportDoc" title="Export Document">Export ▼</button>
        </div>
        <div class="header-right">
            <button id="themeToggle" title="Toggle Theme">🌓</button>
        </div>
    </header>

    <!-- Toolbar -->
    <div class="toolbar">
        <div class="toolbar-group">
            <button data-action="bold" title="Bold (Ctrl+B)">B</button>
            <button data-action="italic" title="Italic (Ctrl+I)">I</button>
            <button data-action="heading" title="Heading">H</button>
            <button data-action="link" title="Insert Link">🔗</button>
            <button data-action="image" title="Insert Image">🖼️</button>
            <button data-action="code" title="Code Block">&lt;/&gt;</button>
            <button data-action="quote" title="Blockquote">"</button>
            <button data-action="ul" title="Unordered List">•</button>
            <button data-action="ol" title="Ordered List">1.</button>
            <button data-action="table" title="Insert Table">⊞</button>
        </div>
    </div>

    <!-- Main Content -->
    <main class="editor-container">
        <div class="editor-pane">
            <textarea id="editor" placeholder="Start typing your markdown here..."></textarea>
        </div>
        <div class="preview-pane">
            <div id="preview" class="markdown-body"></div>
        </div>
    </main>

    <!-- Status Bar -->
    <footer class="status-bar">
        <span id="wordCount">Words: 0</span>
        <span id="charCount">Characters: 0</span>
        <span id="lineInfo">Line: 1, Column: 1</span>
        <span id="saveStatus" class="save-status">Saved</span>
    </footer>

    <!-- Export Modal -->
    <div id="exportModal" class="modal" hidden>
        <div class="modal-content">
            <h2>Export Document</h2>
            <input type="text" id="filename" placeholder="filename" value="document">
            <div class="export-options">
                <button data-export="markdown">Export as Markdown (.md)</button>
                <button data-export="html">Export as HTML (.html)</button>
                <button data-export="pdf">Export as PDF</button>
                <button data-export="text">Export as Text (.txt)</button>
            </div>
            <button id="cancelExport">Cancel</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### 6.2 CSS Architecture
```css
/* CSS Variables for Theming */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent: #007bff;
  --border: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent: #4dabf7;
  --border: #404040;
}

/* Layout Structure */
.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 128px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
  
  .preview-pane {
    display: none;
  }
  
  .preview-pane.active {
    display: block;
  }
}
```

### 6.3 JavaScript Implementation
```javascript
// Core Application Structure
class MarkdownEditor {
  constructor() {
    this.editor = document.getElementById('editor');
    this.preview = document.getElementById('preview');
    this.lastSaved = '';
    this.autoSaveInterval = null;
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
  }

  bindEvents() {
    // Editor input
    this.editor.addEventListener('input', this.debounce(() => {
      this.updatePreview();
      this.updateStats();
    }, 300));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 's': e.preventDefault(); this.save(); break;
          case 'b': e.preventDefault(); this.insertFormatting('bold'); break;
          case 'i': e.preventDefault(); this.insertFormatting('italic'); break;
        }
      }
    });

    // Toolbar buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.insertFormatting(btn.dataset.action);
      });
    });
  }

  updatePreview() {
    const markdown = this.editor.value;
    const html = marked.parse(markdown);
    this.preview.innerHTML = html;
    
    // Syntax highlighting for code blocks
    this.preview.querySelectorAll('pre code').forEach(block => {
      if (typeof Prism !== 'undefined') {
        Prism.highlightElement(block);
      }
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
      code: { before: '```\n', after: '\n```' },
      link: { before: '[', after: '](url)' },
      heading: { before: '## ', after: '' }
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
  window.mdEditor = new MarkdownEditor();
});
```

## 7. Implementation Phases

### Phase 1: Core Editor (Week 1)
- Basic HTML structure
- Split-pane layout
- Text editor with preview
- Basic markdown parsing

### Phase 2: Enhanced Features (Week 2)
- Toolbar implementation
- Keyboard shortcuts
- Export functionality
- Auto-save feature

### Phase 3: Polish & Optimization (Week 3)
- Theme support
- Mobile responsiveness
- Performance optimization
- Accessibility improvements

## 8. Testing Strategy

### 8.1 Unit Tests
- Markdown parsing accuracy
- Export format validation
- Storage operations
- Toolbar commands

### 8.2 Integration Tests
- Editor-preview synchronization
- File import/export flow
- Keyboard shortcut handling
- Cross-browser compatibility

### 8.3 User Testing
- Usability testing with 5-10 users
- Performance testing with large documents
- Accessibility audit
- Mobile device testing

## 9. Deployment & Maintenance

### 9.1 Deployment
- Static file hosting (GitHub Pages, Netlify)
- CDN for third-party libraries
- Progressive Web App capabilities
- Offline support via Service Worker

### 9.2 Monitoring
- Google Analytics for usage
- Error tracking (Sentry)
- Performance monitoring
- User feedback collection

## 10. Future Enhancements

### Version 2.0
- Collaborative editing
- Cloud storage integration
- Plugin system
- Custom themes
- Markdown extensions

### Version 3.0
- Desktop app (Electron)
- Mobile apps
- API for integrations
- Advanced export options
- Version control

## 11. Performance Optimizations

### 11.1 Rendering Performance
- Virtual scrolling for large documents
- Web Workers for markdown parsing
- RequestAnimationFrame for smooth scrolling
- CSS containment for preview pane

### 11.2 Memory Management
- Cleanup event listeners on destroy
- Limit undo/redo history
- Lazy load syntax highlighting
- Efficient DOM updates

### 11.3 Network Optimization
- Service Worker caching
- Minified assets
- Gzip compression
- Resource hints (preconnect, dns-prefetch)

## 12. Security Considerations

### 12.1 XSS Prevention
- Sanitize HTML output
- Content Security Policy headers
- Safe link handling
- Input validation

### 12.2 Data Protection
- Local storage encryption option
- No server-side data transmission
- Clear data on logout
- Secure export options