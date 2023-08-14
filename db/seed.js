const client = require("./db.js");

const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS owners;
      DROP TABLE IF EXISTS pets_products;
      DROP TABLE IF EXISTS products;
    `);

    console.log("TABLES DROPPED!");
  } catch (error) {
    console.log(error);
  }
};

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE owners (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(30) NOT NULL
      );

      CREATE TABLE pets (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(20) NOT NULL,
        Type VARCHAR(20) NOT NULL,
        Owner_Id INTEGER REFERENCES owners(Id)
      );

      CREATE TABLE products (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
      );

      CREATE TABLE pets_products (
        Id SERIAL PRIMARY KEY,
        Pets_Id INTEGER REFERENCES pets(Id),
        Products_Id INTEGER REFERENCES products(Id),
      );
    `);

    console.log("TABLES CREATED!");
  } catch (error) {
    console.log(error);
  }
};

const createOwner = async (ownersName) => {
  const queryText = `
    INSERT INTO owners (Name)
    VALUES ($1);
  `;
  const values = [ownersName];

  try {
    await client.query(queryText, values);
    console.log("OWNER CREATED");
  } catch (error) {
    console.log(error);
  }
};

const createPet = async (petsName, petType, ownerID) => {
  const queryText = `
    INSERT INTO pets (Name, Type, Owner_Id)
    VALUES ($1, $2, $3);
  `;
  const values = [petsName, petType, ownerID];

  try {
    await client.query(queryText, values);
    console.log("PET CREATED");
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async (productsName, productsDescription) => {
  const queryText = `
    INSERT INTO products (Name, Description)
    VALUES ($1, $2);
  `;
  const values = [productsName, productsDescription];

  try {
    await client.query(queryText, values);
    console.log("PRODUCTS CREATED");
  } catch (error) {
    console.log(error);
  }
};

const associatePetWithProduct = async (petsID, productsID) => {
  const queryText = `
    INSERT INTO pets_products (Pets_Id, Products_Id)
    VALUES ($1, $2);
  `;
  const values = [petsID, productsID];

  try {
    await client.query(queryText, values);
    console.log("ASSOCIATED PRODUCTS CREATED");
  } catch (error) {
    console.log(error);
  }
};

const syncAndSeed = async () => {
  try {
    await client.connect();
    console.log("CONNECTED TO THE DB!");

    await dropTables();
    await createTables();

    const ownerIds = [];
    await createOwner("Jerry");
    ownerIds.push(1);
    await createOwner("Terry");
    ownerIds.push(2);
    await createOwner("Sherry");
    ownerIds.push(3);

    await createPet("Ignacio", "Dog", ownerIds[0]);
    await createPet("Iñigo Montoya", "Vengeful Cat", ownerIds[1]);
    await createPet("Irene", "Lizard", ownerIds[2]);

    await createProduct("Chew Toy", "Chewy Chew Chew.");
    await createProduct("Catnip", "Cat Crack");
    await createProduct("UV Light", "Some Vitamin D for Lizard");

    await associatePetWithProduct(1, 1);
    await associatePetWithProduct(2, 2);
    await associatePetWithProduct(3, 3);
  } catch (error) {
    console.log(error);
  }
};

syncAndSeed();
