# Markdown Editor

A modern, feature-rich web-based Markdown editor with real-time preview functionality. This application provides a clean, distraction-free environment for writing and formatting documents using Markdown syntax.

## Features

### Core Functionality
- **Real-time Preview**: See your formatted content as you type with synchronized rendering
- **Live Editing**: Split-pane interface with editor on the left, preview on the right
- **Auto-save**: Automatic saving to local storage every 30 seconds
- **Export Options**: Export documents as Markdown, HTML, PDF, or plain text
- **Theme Support**: Toggle between light and dark themes

### Editor Features
- **Toolbar Shortcuts**: Quick access buttons for common formatting
- **Keyboard Shortcuts**: Standard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.)
- **File Operations**: Create new documents, open existing files, save current work
- **Document Statistics**: Real-time word count, character count, and cursor position
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Markdown Support
- **Full CommonMark**: Complete Markdown specification support
- **GitHub Flavored Markdown**: Tables, task lists, strikethrough text
- **Code Highlighting**: Syntax highlighting for code blocks
- **Rich Formatting**: Headers, lists, links, images, blockquotes, and more

## Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No installation required - runs entirely in the browser

### Usage
1. Open `index.html` in your web browser
2. Start typing your Markdown content in the left editor pane
3. See the formatted preview update in real-time on the right
4. Use toolbar buttons or keyboard shortcuts for quick formatting
5. Export your document when ready using the Export button

### Keyboard Shortcuts
- `Ctrl+N` - New document
- `Ctrl+O` - Open file
- `Ctrl+S` - Save document
- `Ctrl+B` - Bold text
- `Ctrl+I` - Italic text
- `Ctrl+1-6` - Heading levels

## Interface Overview

The application features a clean, professional interface with:

- **Header Bar**: Document operations (New, Open, Save, Export) and theme toggle
- **Toolbar**: Formatting shortcuts for bold, italic, headings, links, images, code blocks, lists, and tables
- **Split Editor**: Side-by-side Markdown editor and HTML preview
- **Status Bar**: Document statistics and save status

## Responsive Design

The editor adapts to different screen sizes:
- **Desktop**: Full split-pane view with resizable divider
- **Tablet**: Tabbed interface switching between editor and preview
- **Mobile**: Stacked layout with toggle button for preview

## Technical Details

### Architecture
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Markdown Parser**: Marked.js for fast, accurate parsing
- **Styling**: CSS Grid and Flexbox for responsive layouts
- **Storage**: Browser localStorage for persistence
- **No Dependencies**: Pure client-side application with no server required

### File Structure
```
/
├── index.html          # Main application file
├── styles.css          # All styling and themes
├── script.js           # Core application logic
├── SPEC.md            # Detailed project specification
└── screenshots/       # Application screenshots
```

### Browser Compatibility
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Microsoft Edge 90+
- Mobile browsers with modern JavaScript support

## Use Cases

Perfect for:
- **Content Writers**: Blog posts, articles, and documentation
- **Developers**: README files, technical documentation, project notes
- **Students**: Essays, research papers, study notes
- **Educators**: Course materials, assignments, presentations
- **Technical Writers**: API documentation, user guides, tutorials

## Performance

- **Fast Loading**: Minimal footprint with instant startup
- **Smooth Typing**: Debounced updates for responsive editing
- **Efficient Rendering**: Optimized HTML generation and DOM updates
- **Memory Management**: Clean resource handling for long editing sessions

## Privacy & Security

- **Client-Side Only**: No data sent to external servers
- **Local Storage**: Documents saved securely in your browser
- **No Tracking**: No analytics or user tracking
- **Secure Rendering**: XSS protection in preview rendering

## Highlights

- Zero setup required - works immediately in any modern browser
- Completely offline after initial load
- Professional-grade editor suitable for serious writing
- Export to multiple formats for various publishing needs
- Responsive design works on all devices
- Clean, distraction-free interface focused on writing

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features
- Submit pull requests for improvements
- Share feedback on usability and design

---

**Start writing beautiful Markdown documents today!**