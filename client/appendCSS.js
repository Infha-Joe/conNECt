import fs from 'fs';

const cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const animations = `
/* Landing Page Animations */
@media (prefers-reduced-motion: no-preference) {
  .anim-slide-right {
    animation: slideRight 700ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  .anim-slide-left {
    animation: slideLeft 700ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
}

@keyframes slideRight {
  0% { opacity: 0; transform: translateX(-40px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes slideLeft {
  0% { opacity: 0; transform: translateX(40px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Fallback for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .anim-slide-right, .anim-slide-left {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}

.opacity-0-init {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .opacity-0-init {
    opacity: 1;
  }
}
`;

if (!css.includes('anim-slide-right')) {
  fs.appendFileSync(cssPath, '\n' + animations);
}
