const DATA = {
	allPersons: [
		{
      id: 'ID_1',	
      firstName: 'John', 
      lastName: 'Smith', 
      middleName: 'Johnson', 
      birthdate: 971136000000, 
      address: 'Moscow, Red Square, b.1'
    },
    {
      id: 'ID_2',  
      firstName: 'Yan', 
      lastName: 'Guillan', 
      middleName: 'Johnson', 
      birthdate: 1218484800000, 
      address: 'London, Dawning street, b.1'
    },
    {
      id: 'ID_3',  
      firstName: 'John', 
      lastName: 'Kennedy', 
      middleName: 'Richard', 
      birthdate: 1218484800000, 
      address: 'New York, Bruklin, b.1'
    },
    {
      id: 'ID_4',  
      firstName: 'Paul', 
      lastName: 'Maccartny', 
      middleName: 'Mark', 
      birthdate: 1436734800000, 
      address: 'StPetersburg, Nevskiy, b.1'
    },
	],
	relatives: {
    ID_1:['ID_2'],
    ID_2:['ID_1'],
    ID_3:['ID_1','ID_4'],
    ID_4:['ID_1','ID_3'],
  }    
} 


export default DATA