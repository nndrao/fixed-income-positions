function findSelectedViewTitle(layout) {
    function traverse(node, checkIndex = false, targetIndex = 0) {
        // For any container type that can have an activeItemIndex
        if (Array.isArray(node.content) && 
            (node.type === 'tabset' || 
             node.type === 'stack' || 
             node.type === 'row' || 
             node.type === 'column')) {
            
            // Get the active index from either selected or activeItemIndex
            const activeIndex = node.selected ?? node.activeItemIndex ?? 0;
            
            if (node.content[activeIndex]) {
                return traverse(node.content[activeIndex], true, activeIndex);
            }
        }

        // Check if this is a matching component at the correct index
        if (node.type === 'component' && 
            node.componentName === 'view' && 
            node.title && 
            checkIndex) {
            return node.title;
        }

        // For any node with content array
        if (node.content && Array.isArray(node.content)) {
            for (let i = 0; i < node.content.length; i++) {
                const result = traverse(
                    node.content[i], 
                    // Only check index if parent wanted us to and we're at the right index
                    checkIndex && i === targetIndex,
                    targetIndex
                );
                if (result) return result;
            }
        }

        return null;
    }

    return traverse(layout);
}

// Example usage with different container types:
const sampleLayout = {
    type: 'row',
    activeItemIndex: 1,
    content: [{
        type: 'component',
        title: 'First Component',
        componentName: 'view'
    }, {
        type: 'column',
        activeItemIndex: 0,
        content: [{
            type: 'component',
            title: 'Selected Component',
            componentName: 'view'
        }, {
            type: 'component',
            title: 'Another Component',
            componentName: 'view'
        }]
    }]
};

console.log(findSelectedViewTitle(sampleLayout)); // Should output: "Selected Component"
