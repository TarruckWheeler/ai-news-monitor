export const Switch = ({ checked, onCheckedChange, ...props }) => <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} className="toggle" {...props} />
