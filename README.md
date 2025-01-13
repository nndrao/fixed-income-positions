function findSelectedViewTitle(layout) {
    // Helper function to traverse the layout tree
    function traverse(node, parentIsSelected = false) {
        // Check if this is a component that matches our criteria
        if (node.type === 'component' && 
            node.componentName === 'view' && 
            node.title && 
            parentIsSelected) {
            return node.title;
        }

        // Handle tabset - check if it has a selected property
        if (node.type === 'tabset' && Array.isArray(node.content)) {
            const selectedIndex = node.selected || 0;
            // Only traverse the selected tab
            if (node.content[selectedIndex]) {
                const result = traverse(node.content[selectedIndex], true);
                if (result) return result;
            }
        }

        // For other container types (row, column, stack)
        if (node.content && Array.isArray(node.content)) {
            // Traverse all children
            for (const child of node.content) {
                const result = traverse(child, parentIsSelected);
                if (result) return result;
            }
        }

        return null;
    }

    return traverse(layout);
}

// Example usage:
const sampleLayout = {
    type: 'row',
    content: [{
        type: 'tabset',
        selected: 1,
        content: [{
            type: 'component',
            title: 'Market Data',
            componentName: 'view',
            componentState: {
                url: 'market-data.html'
            }
        }, {
            type: 'component',
            title: 'Order Entry',
            componentName: 'view',
            componentState: {
                url: 'order-entry.html'
            }
        }]
    }]
};

// Test the function
console.log(findSelectedViewTitle(sampleLayout)); // Should output: "Order Entry"
