    const gender_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    const farm_item_options = [
        {id: 1, value: 'wheat', displayValue: ' Wheat'}, 
        {id: 2, value: 'millet', displayValue: ' Millet'},
        {id: 3, value: 'sorghum', displayValue: ' Sorghum'},
        {id: 4, value: 'maize', displayValue: ' Maize'},
        {id: 5, value: 'cassava', displayValue: ' Cassava'},
        {id: 6, value: 'avacado', displayValue: ' Avacado'},
        {id: 7, value: 'palm oil', displayValue: ' Palm oil'},
        {id: 8, value: 'tea', displayValue: ' Tea'},
        {id: 9, value: 'coffee', displayValue: ' Coffee'},
        {id: 10, value: 'cabbage', displayValue: ' Cabbage'},
        {id: 11, value: 'tomatoes', displayValue: ' Tomatoes'},
        {id: 12, value: 'spinach', displayValue: ' Spinach'},
        {id: 13, value: 'carrots', displayValue: ' Carrots'},
        {id: 14, value: 'onions', displayValue: ' Onions'},
        {id: 15, value: 'capscisum', displayValue: ' Capscisum'},
        {id: 16, value: 'beans', displayValue: ' Beans'},
        {id: 17, value: 'mushroom', displayValue: ' Mushroom'},
        {id: 18, value: 'snail', displayValue: ' Snail'},
        {id: 19, value: 'sheep', displayValue: ' Sheep'},
        {id: 20, value: 'beef', displayValue: ' Beef'},
        {id: 21, value: 'bees', displayValue: ' Bees'},
        {id: 22, value: 'rabbit', displayValue: ' Rabbit'},
        {id: 23, value: 'dairy', displayValue: ' Dairy'},
        {id: 24, value: 'duck', displayValue: ' Duck'},
        {id: 25, value: 'fish', displayValue: ' Fish'},
        {id: 26, value: 'turkey', displayValue: ' Turkey'},
        {id: 27, value: 'kienyeji chicken', displayValue: ' Kienyeji Chicken'},
        {id: 28, value: 'broiler chicken', displayValue: ' Broiler Chicken'},
    ];
  
    const education_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'tertiary', label: 'Tertiary' },
        { value: 'bachelors', label: 'Bachelors or equivalent' },
        { value: 'masters', label: 'Masters or equivalent' },
        { value: 'doctoral', label: 'Doctoral or equivalent' },
    ];
  
    const age_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: '18-25', label: '{18-25}' },
        { value: '26-33', label: '{26-33}' },
        { value: '34-41', label: '{34-41}' },
        { value: '42-49', label: '{42-49}' },
        { value: '50-57', label: '{50-57}' },
        { value: '58-65', label: '{58-65}' },
        { value: '66-73', label: '{66-73}' },
        { value: '74-81', label: '{74-81}' },
        { value: '82-89', label: '{82-89}' },
    ];
 
    const entity_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' },
    ];

    const account_type_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: 'farmer', label: 'Farmer' },
        { value: 'business', label: 'Business' },
    ];
    
    const category_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: 'owner', label: 'Owner' },
        { value: 'employee', label: 'Employee' },
    ];

    const shop_publish_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: '0', label: 'Publish' },
        { value: '1', label: 'Unpublish' },
    ];  

    const search_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: '0', label: 'Search by Name' },
        { value: '1', label: 'Search by Country' },
        { value: '2', label: 'Search by Farmed Item' },
    ];
    
    const stat_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: '0', label: 'Farmers' },
        { value: '1', label: 'Businesses' },
        { value: '2', label: 'Stories' },
        { value: '3', label: 'Comments' },
        { value: '4', label: 'API Requests' },
        { value: '5', label: 'Survey Requests' },
    ];    

  export default 1;
  
  export {
    gender_options,
    farm_item_options,
    education_options,
    age_options,
    entity_options,
    shop_publish_options,
    category_options,
    account_type_options,
    search_options,
    stat_options
  };