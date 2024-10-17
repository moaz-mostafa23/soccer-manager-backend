const countries = ['Spain', 'Germany', 'Brazil', 'Argentina', 'France', 'Egypt'];

export const getRandomCountry = () => countries[Math.floor(Math.random() * countries.length)];
