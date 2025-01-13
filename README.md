function findSelectedViewTitle(layout) {
    // Helper function to traverse the layout tree
    function traverse(node, checkIndex = false, targetIndex = 0) {
        // If this is a tabset or has activeItemIndex, look at the specified child
        if ((node.type === 'tabset' || node.type === 'stack') && Array.isArray(node.content)) {
            const selectedIndex = node.selected || node.activeItemIndex || 0;
            if (node.content[selectedIndex]) {
                // Pass down that we should check index for children
                return traverse(node.content[selectedIndex], true, selectedIndex);
            }
        }

        // If this is a component that matches our criteria
        if (node.type === 'component' && 
            node.componentName === 'view' && 
            node.title && 
            checkIndex) {
            return node.title;
        }

        // For other container types (row, column)
        if (node.content && Array.isArray(node.content)) {
            for (let i = 0; i < node.content.length; i++) {
                // For direct children of containers, we don't check index
                const result = traverse(node.content[i], checkIndex && i === targetIndex, targetIndex);
                if (result) return result;
            }
        }

        return null;
    }

    return traverse(layout);
}
