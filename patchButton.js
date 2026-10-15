const fs = require('fs');
let code = fs.readFileSync('client/src/components/ui/Button.jsx', 'utf8');

code = code.replace(
    'const Button = ({ children, variant = "primary", className = "", ...props }) => {',
    'const Button = ({ children, variant = "primary", className = "", isLoading, disabled, ...props }) => {'
);

code = code.replace(
    '<button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>',
    '<button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading || disabled} {...props}>'
);

code = code.replace(
    '{children}',
    '{isLoading ? "Loading..." : children}'
);

fs.writeFileSync('client/src/components/ui/Button.jsx', code);
console.log('Fixed Button.jsx');
