export const Tabs = ({ children, ...props }) => <div {...props}>{children}</div>
export const TabsList = ({ children, ...props }) => <div className="flex space-x-1 border-b" {...props}>{children}</div>
export const TabsTrigger = ({ children, ...props }) => <button className="px-3 py-2 hover:bg-gray-100" {...props}>{children}</button>
export const TabsContent = ({ children, ...props }) => <div className="pt-4" {...props}>{children}</div>
