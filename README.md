# HNG Stage 0 - Vanilla JS Todo Card

A highly responsive, accessible, and interactive Todo Card built purely with Semantic HTML, CSS, and Vanilla JavaScript for the HNG Internship Frontend track (Stage 0).

## 🚀 Live Demo
[View the Live Project Here](https://har-beeb.github.io/hng-stage0-todo/)

## ✨ Features
* **Semantic HTML:** Utilizes native semantic tags (`<article>`, `<time>`, `<ul>`) for an optimized DOM structure.
* **Accessibility (a11y) First:** Fully compliant with screen readers. Includes `aria-label` attributes for icon-only buttons and semantic `role="list"` structures.
* **Responsive Layout:** Fluid design utilizing CSS Flexbox. Scales perfectly from 320px (mobile) to large desktop screens without horizontal overflow.
* **Timezone-Aware Logic:** Calculates time remaining accurately based on the West Africa Time (WAT / UTC+1) deadline.
* **DRY CSS Architecture:** Reusable, grouped CSS classes for scalable SVG alignment and component spacing.

## Updates
## Stage 1a Update: Interactive State Management
* Refactored the static Vanilla JS card into a fully stateful component using a unidirectional data-flow pattern (a "Mini-React" architecture). Features include:

* **Edit Mode:** Toggleable form to update task data with focus-trapping.

* **State Syncing:** Checkbox and Status dropdown are mathematically synced via a single source of truth.

* **Dynamic UI:** SVGs, Tag colors, and "Done" strike-throughs update automatically based on state.

* **Granular Time Logic:** Live interval timer that switches between days, hours, and minutes, stopping automatically when marked complete.

## 🛠️ Technologies Used
* HTML5 (Semantic Structure)
* CSS3 (Flexbox, Variables, Fluid Typography)
* Vanilla JavaScript (DOM Manipulation, Date Objects)
* Heroicons & Lucide (Inline SVGs for performance)

## 💻 Local Setup
Since this project uses zero frameworks or build tools, running it locally is incredibly simple:

 ```bash
   #1. Clone the repository:
   git clone https://github.com/har-beeb/hng-stage0-todo.git
   cd hng-stage0-todo
```
Open index.html in your web browser.

## 👤 Author

- **Name:** Har-beebullah I.O
- **HNG Slack ID:** H.A.X
- **Track:** Frontend
