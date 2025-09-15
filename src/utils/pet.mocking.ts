import { faker } from "@faker-js/faker";

const generateMockPet = () => {
  return {
    name: faker.person.firstName(),
    specie: faker.animal.type(),
    birthDate: faker.date.birthdate().toISOString(),
  };
};

export const generateMockPets = (count: number) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push(generateMockPet());
  }
  return pets;
};
