# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Markdown Editor web application with live preview functionality. The project provides a full-featured markdown editor with real-time preview, export options, and theme support.

## Project Structure

The codebase is organized as follows:

- `html_test/` - Contains the website files
  - `index.html` - Main HTML file with editor layout and UI components
  - `styles.css` - Stylesheet with theme support and responsive design
  - `script.js` - JavaScript file implementing the MarkdownEditor class
  - `SPEC.md` - Full project specification document

## Project Testing

Project is running using the live server extension on this url `http://127.0.0.1:5500/`

## Development Commands

Since this is a static HTML website, no build process or package manager is required. To develop:

1. **Run the website**: Open `html_test/index.html` directly in a web browser
2. **Test changes**: Refresh the browser after modifying any files

## Architecture Notes

- The website uses vanilla HTML, CSS, and JavaScript with no frameworks or dependencies
- CSS follows a mobile-first responsive design approach with flexbox layout
- JavaScript uses event delegation and DOM manipulation for interactivity
- All files are linked relatively, making the site portable
