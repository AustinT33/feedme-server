function makePlacesArray() {
    return [
        {
            id: 1,
            title: 'Test one',
            category: 'Italian',
            price: '$$'
        },
        {
            id: 2,
            title: 'Test two',
            category: 'American',
            price: '$'
        },
        {
            id: 3,
            title: 'Test three',
            category: 'Greek',
            price: '$$$'
        },
    ];
}

module.exports = {
    makePlacesArray,
}