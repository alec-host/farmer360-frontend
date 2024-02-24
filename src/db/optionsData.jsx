    const gender_options = [
        { value: '', label: '--Choose an option--',disabled: true},
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    const farm_item_options = [
        {id: 1, value: 'wheat', label: ' Wheat'}, 
        {id: 2, value: 'millet', label: ' Millet'},
        {id: 3, value: 'sorghum', label: ' Sorghum'},
        {id: 4, value: 'maize', label: ' Maize'},
        {id: 5, value: 'cassava', label: ' Cassava'},
        {id: 6, value: 'avacado', label: ' Avacado'},
        {id: 7, value: 'palm oil', label: ' Palm oil'},
        {id: 8, value: 'tea', label: ' Tea'},
        {id: 9, value: 'coffee', label: ' Coffee'},
        {id: 10, value: 'cabbage', label: ' Cabbage'},
        {id: 11, value: 'tomatoes', label: ' Tomatoes'},
        {id: 12, value: 'spinach', label: ' Spinach'},
        {id: 13, value: 'carrots', label: ' Carrots'},
        {id: 14, value: 'onions', label: ' Onions'},
        {id: 15, value: 'capscisum', label: ' Capscisum'},
        {id: 16, value: 'beans', label: ' Beans'},
        {id: 17, value: 'mushroom', label: ' Mushroom'},
        {id: 18, value: 'snail', label: ' Snail'},
        {id: 19, value: 'sheep', label: ' Sheep'},
        {id: 20, value: 'beef', label: ' Beef'},
        {id: 21, value: 'bees', label: ' Bees'},
        {id: 22, value: 'rabbit', label: ' Rabbit'},
        {id: 23, value: 'dairy', label: ' Dairy'},
        {id: 24, value: 'duck', label: ' Duck'},
        {id: 25, value: 'fish', label: ' Fish'},
        {id: 26, value: 'turkey', label: ' Turkey'},
        {id: 27, value: 'kienyeji chicken', label: ' Kienyeji Chicken'},
        {id: 28, value: 'broiler chicken', label: ' Broiler Chicken'},
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